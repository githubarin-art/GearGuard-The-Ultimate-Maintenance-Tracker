import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  signInWithGoogle,
  type FirebaseUser 
} from '../firebase';
import { User, UserRole, AuthState } from '../types';
import api from '../services/api';

// Google signup data types
interface GoogleAdminSignupDto {
  firebaseUid: string;
  email: string;
  name: string;
  avatar?: string;
  department: string;
}

interface GoogleMemberSignupDto {
  firebaseUid: string;
  email: string;
  name: string;
  avatar?: string;
  teamId: string;
  memberId: string;
}

interface AuthContextType extends AuthState {
  // Google Auth methods
  loginWithGoogle: () => Promise<{ isNewUser: boolean; firebaseUser: FirebaseUser | null }>;
  signupAdminWithGoogle: (data: { department: string }) => Promise<void>;
  signupMemberWithGoogle: (data: { teamId: string; memberId: string }) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (requiredRole: UserRole | UserRole[]) => boolean;
  // Pending Google user for signup flow
  pendingGoogleUser: FirebaseUser | null;
  setPendingGoogleUser: (user: FirebaseUser | null) => void;
  clearPendingUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  
  // Store pending Google user during signup flow
  const [pendingGoogleUser, setPendingGoogleUser] = useState<FirebaseUser | null>(null);

  // Load user data from backend using Firebase UID
  const loadUserFromBackend = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    try {
      const response = await api.get(`/auth/user/${firebaseUser.uid}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // User not found in backend
      }
      console.error('Failed to load user from backend:', error);
      return null;
    }
  };

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Check if user exists in our backend
        const user = await loadUserFromBackend(firebaseUser);
        
        if (user) {
          // User exists and is linked
          if (!user.isActive) {
            await firebaseSignOut(auth);
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
            return;
          }
          
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // User logged in via Google but not registered in our system
          // Keep them signed in Firebase but not authenticated in our app
          // This allows the signup flow to continue
          setPendingGoogleUser(firebaseUser);
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        setPendingGoogleUser(null);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Login with Google
  const loginWithGoogle = async (): Promise<{ isNewUser: boolean; firebaseUser: FirebaseUser | null }> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // Sign in with Google
      const firebaseUser = await signInWithGoogle();
      
      // Check if user exists in backend
      const user = await loadUserFromBackend(firebaseUser);
      
      if (user) {
        // Existing user - complete login
        if (!user.isActive) {
          await firebaseSignOut(auth);
          throw new Error('Your account has been deactivated. Please contact admin.');
        }
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        return { isNewUser: false, firebaseUser: null };
      } else {
        // New user - needs to complete registration
        setPendingGoogleUser(firebaseUser);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        
        return { isNewUser: true, firebaseUser };
      }
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Complete Admin signup with Google
  const signupAdminWithGoogle = async (data: { department: string }): Promise<void> => {
    try {
      if (!pendingGoogleUser) {
        throw new Error('No pending Google user. Please sign in with Google first.');
      }
      
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const signupData: GoogleAdminSignupDto = {
        firebaseUid: pendingGoogleUser.uid,
        email: pendingGoogleUser.email || '',
        name: pendingGoogleUser.displayName || 'Admin User',
        avatar: pendingGoogleUser.photoURL || undefined,
        department: data.department,
      };

      // Create user in backend
      const response = await api.post('/auth/signup/admin', signupData);

      setPendingGoogleUser(null);
      setAuthState({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Complete Team Member signup with Google
  const signupMemberWithGoogle = async (data: { teamId: string; memberId: string }): Promise<void> => {
    try {
      if (!pendingGoogleUser) {
        throw new Error('No pending Google user. Please sign in with Google first.');
      }
      
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // First verify the team and member exist
      const verifyResponse = await api.post('/auth/verify-member', {
        teamId: data.teamId,
        memberId: data.memberId,
        email: pendingGoogleUser.email,
      });

      if (!verifyResponse.data.valid) {
        throw new Error(verifyResponse.data.message || 'Invalid team or member ID');
      }

      const signupData: GoogleMemberSignupDto = {
        firebaseUid: pendingGoogleUser.uid,
        email: pendingGoogleUser.email || '',
        name: pendingGoogleUser.displayName || 'Team Member',
        avatar: pendingGoogleUser.photoURL || undefined,
        teamId: data.teamId,
        memberId: data.memberId,
      };

      // Create user in backend
      const response = await api.post('/auth/signup/member', signupData);

      setPendingGoogleUser(null);
      setAuthState({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Clear pending user (cancel signup)
  const clearPendingUser = async () => {
    if (pendingGoogleUser) {
      await firebaseSignOut(auth);
      setPendingGoogleUser(null);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    await firebaseSignOut(auth);
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // Check if user has required permission
  const hasPermission = (requiredRole: UserRole | UserRole[]): boolean => {
    if (!authState.user) return false;
    
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(authState.user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        loginWithGoogle,
        signupAdminWithGoogle,
        signupMemberWithGoogle,
        logout,
        hasPermission,
        pendingGoogleUser,
        setPendingGoogleUser,
        clearPendingUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Role-based permission constants
export const PERMISSIONS = {
  // Admin only actions
  MANAGE_TEAMS: ['admin'] as UserRole[],
  MANAGE_EQUIPMENT: ['admin'] as UserRole[],
  MANAGE_USERS: ['admin'] as UserRole[],
  VIEW_ALL_REQUESTS: ['admin'] as UserRole[],
  DELETE_REQUESTS: ['admin'] as UserRole[],
  
  // Both roles
  VIEW_DASHBOARD: ['admin', 'member'] as UserRole[],
  VIEW_REQUESTS: ['admin', 'member'] as UserRole[],
  CREATE_REQUESTS: ['admin', 'member'] as UserRole[],
  UPDATE_OWN_REQUESTS: ['admin', 'member'] as UserRole[],
  VIEW_CALENDAR: ['admin', 'member'] as UserRole[],
  VIEW_ACTIVITY: ['admin', 'member'] as UserRole[],
};

export default AuthContext;

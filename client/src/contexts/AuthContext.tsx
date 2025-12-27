import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { auth, signInWithGoogle, signOut as firebaseSignOut, onAuthStateChanged } from '../firebase';
import type { FirebaseUser } from '../firebase';

type AuthContextValue = {
  user: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<FirebaseUser | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u ?? null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const doSignIn = async () => {
    try {
      const u = await signInWithGoogle();
      setUser(u ?? null);
      return u ?? null;
    } catch (err) {
      console.error('Sign-in failed', err);
      return null;
    }
  };

  const doSignOut = async () => {
    await firebaseSignOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle: doSignIn, signOut: doSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

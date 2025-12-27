import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { teamService } from '../services/teamService';
import { MaintenanceTeam, TeamMember } from '../types';
import { Wrench, Shield, Users, ArrowRight, ArrowLeft, CheckCircle, Mail } from 'lucide-react';

type SignupStep = 'initial' | 'role-select' | 'complete-profile';
type UserType = 'admin' | 'member';

// Google Icon Component
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    loginWithGoogle, 
    signupAdminWithGoogle, 
    signupMemberWithGoogle, 
    isAuthenticated, 
    isLoading,
    pendingGoogleUser,
    clearPendingUser
  } = useAuth();
  
  const [signupStep, setSignupStep] = useState<SignupStep>('initial');
  const [userType, setUserType] = useState<UserType>('admin');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Form data for profile completion
  const [formData, setFormData] = useState({
    department: '',
    teamId: '',
    memberId: '',
  });

  // Teams and members for selection
  const [teams, setTeams] = useState<MaintenanceTeam[]>([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<TeamMember[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // If there's a pending Google user, show role selection
  useEffect(() => {
    if (pendingGoogleUser && signupStep === 'initial') {
      setSignupStep('role-select');
    }
  }, [pendingGoogleUser, signupStep]);

  // Load teams for member signup
  useEffect(() => {
    if (signupStep === 'complete-profile' && userType === 'member') {
      loadTeams();
    }
  }, [signupStep, userType]);

  // Update members when team is selected
  useEffect(() => {
    const selectedTeam = teams.find(t => t.id === formData.teamId);
    if (selectedTeam && selectedTeam.members) {
      setSelectedTeamMembers(selectedTeam.members.filter(m => m.isActive));
    } else {
      setSelectedTeamMembers([]);
    }
    setFormData(prev => ({ ...prev, memberId: '' }));
  }, [formData.teamId, teams]);

  const loadTeams = async () => {
    setLoadingTeams(true);
    try {
      const data = await teamService.getAllTeams();
      setTeams(data.filter(t => t.isActive));
    } catch (err) {
      console.error('Failed to load teams:', err);
    } finally {
      setLoadingTeams(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  // Handle Google Sign In / Sign Up
  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await loginWithGoogle();
      
      if (result.isNewUser) {
        // New user - need to complete registration
        setSignupStep('role-select');
      }
      // If existing user, AuthContext will handle redirect
    } catch (err: any) {
      const errorMessage = err.message || 'Google authentication failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle role selection and proceed to profile completion
  const handleRoleSelect = (role: UserType) => {
    setUserType(role);
    setSignupStep('complete-profile');
  };

  // Complete signup
  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (userType === 'admin') {
        if (!formData.department.trim()) {
          throw new Error('Please enter your department');
        }
        await signupAdminWithGoogle({ department: formData.department });
      } else {
        if (!formData.teamId || !formData.memberId) {
          throw new Error('Please select your team and member profile');
        }
        await signupMemberWithGoogle({ 
          teamId: formData.teamId, 
          memberId: formData.memberId 
        });
      }
      navigate('/');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Signup failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Cancel signup and go back
  const handleCancelSignup = async () => {
    await clearPendingUser();
    setSignupStep('initial');
    setFormData({ department: '', teamId: '', memberId: '' });
    setError(null);
  };

  // Go back to role selection
  const handleBackToRoleSelect = () => {
    setSignupStep('role-select');
    setFormData({ department: '', teamId: '', memberId: '' });
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)' }}>
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75"></div>
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg mx-auto w-fit mb-4">
              <Wrench className="h-10 w-10 text-white animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)' }}>
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75"></div>
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <Wrench className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>GearGuard</h1>
          <p className="text-gray-600 mt-2 font-medium">Ultimate Maintenance Tracker</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* STEP: Initial - Google Sign In */}
          {signupStep === 'initial' && (
            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
                <p className="text-gray-500 text-sm">Sign in with your Google account to continue</p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Google Sign In Button */}
              <button
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-3.5 px-4 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <span>Connecting...</span>
                ) : (
                  <>
                    <GoogleIcon />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  New user? Click "Continue with Google" to create an account
                </p>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> How it works
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Your Google ID links to your GearGuard profile</li>
                  <li>• First time users will select their role</li>
                  <li>• Returning users are logged in automatically</li>
                </ul>
              </div>
            </div>
          )}

          {/* STEP: Role Selection */}
          {signupStep === 'role-select' && pendingGoogleUser && (
            <div className="p-6">
              {/* User Info */}
              <div className="text-center mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center mb-3">
                  {pendingGoogleUser.photoURL ? (
                    <img 
                      src={pendingGoogleUser.photoURL} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                      {pendingGoogleUser.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <p className="font-semibold text-gray-800">{pendingGoogleUser.displayName}</p>
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                  <Mail className="h-3 w-3" /> {pendingGoogleUser.email}
                </p>
              </div>

              <h2 className="text-lg font-bold text-gray-800 text-center mb-4">Select Your Role</h2>

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Role Selection Cards */}
              <div className="space-y-3">
                <button
                  onClick={() => handleRoleSelect('admin')}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white group-hover:scale-110 transition-transform">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Admin / Manager</p>
                      <p className="text-sm text-gray-500">Full system access, manage teams & equipment</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('member')}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-green-400 hover:bg-gradient-to-br hover:from-green-50 hover:to-teal-50 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 text-white group-hover:scale-110 transition-transform">
                      <Users className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Team Member</p>
                      <p className="text-sm text-gray-500">View & update assigned maintenance tasks</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              </div>

              {/* Cancel Button */}
              <button
                onClick={handleCancelSignup}
                className="w-full mt-4 py-2.5 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
              >
                Cancel and use a different account
              </button>
            </div>
          )}

          {/* STEP: Complete Profile */}
          {signupStep === 'complete-profile' && pendingGoogleUser && (
            <div className="p-6">
              {/* Back Button */}
              <button
                onClick={handleBackToRoleSelect}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-medium mb-4 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to role selection
              </button>

              {/* User Info */}
              <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl">
                {pendingGoogleUser.photoURL ? (
                  <img 
                    src={pendingGoogleUser.photoURL} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {pendingGoogleUser.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{pendingGoogleUser.displayName}</p>
                  <p className="text-xs text-gray-500">{pendingGoogleUser.email}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  userType === 'admin' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {userType === 'admin' ? 'Admin' : 'Member'}
                </div>
              </div>

              <h2 className="text-lg font-bold text-gray-800 mb-4">Complete Your Profile</h2>

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleCompleteSignup} className="space-y-4">
                {/* Admin Fields */}
                {userType === 'admin' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <input
                      type="text"
                      name="department"
                      required
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., Operations, Facilities, Maintenance"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      This helps organize your responsibilities
                    </p>
                  </div>
                )}

                {/* Team Member Fields */}
                {userType === 'member' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Your Team *
                      </label>
                      <select
                        name="teamId"
                        required
                        value={formData.teamId}
                        onChange={handleInputChange}
                        disabled={loadingTeams}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white transition-all"
                      >
                        <option value="">
                          {loadingTeams ? 'Loading teams...' : '-- Select your team --'}
                        </option>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name} {team.specialization ? `(${team.specialization})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Your Profile *
                      </label>
                      <select
                        name="memberId"
                        required
                        value={formData.memberId}
                        onChange={handleInputChange}
                        disabled={!formData.teamId || selectedTeamMembers.length === 0}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white transition-all"
                      >
                        <option value="">
                          {!formData.teamId 
                            ? '-- Select team first --' 
                            : selectedTeamMembers.length === 0 
                              ? 'No available profiles in this team'
                              : '-- Select your profile --'
                          }
                        </option>
                        {selectedTeamMembers.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name} - {member.role || 'Team Member'}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Your profile must be created by an admin first. Email must match.
                      </p>
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3.5 px-4 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:-translate-y-0.5 text-white ${
                    userType === 'admin'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                      : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
                  }`}
                >
                  {loading ? (
                    <span>Creating Account...</span>
                  ) : (
                    <>
                      <span>Complete Registration</span>
                      <CheckCircle className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              {/* Role Info */}
              <div className={`mt-6 p-4 rounded-xl border-2 ${
                userType === 'admin' 
                  ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200' 
                  : 'bg-gradient-to-br from-green-50 to-teal-50 border-green-200'
              }`}>
                <h4 className={`font-semibold mb-2 flex items-center gap-2 text-sm ${
                  userType === 'admin' ? 'text-blue-700' : 'text-green-700'
                }`}>
                  {userType === 'admin' ? (
                    <><Shield className="h-4 w-4" /> Your Admin Privileges</>
                  ) : (
                    <><Users className="h-4 w-4" /> Your Access Level</>
                  )}
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {userType === 'admin' ? (
                    <>
                      <li>✓ Manage teams and members</li>
                      <li>✓ Add/edit/delete equipment</li>
                      <li>✓ View all maintenance requests</li>
                      <li>✓ Assign tasks to team members</li>
                    </>
                  ) : (
                    <>
                      <li>✓ View assigned maintenance requests</li>
                      <li>✓ Update request status</li>
                      <li>✓ View team equipment</li>
                      <li>✗ Cannot manage teams or equipment</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} GearGuard. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from './Button';

const SignInButton: React.FC = () => {
  const { user, signInWithGoogle, signOut } = useAuth();

  const handleSignIn = async () => {
    await signInWithGoogle();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (!user) {
    return (
      <Button onClick={handleSignIn} variant="primary">
        Sign in
      </Button>
    );
  }

  const initials = user.displayName
    ? user.displayName.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase()
    : (user.email || 'U').slice(0, 2).toUpperCase();

  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg">
        {initials}
      </div>
      <Button onClick={handleSignOut} variant="ghost">
        Sign out
      </Button>
    </div>
  );
};

export default SignInButton;

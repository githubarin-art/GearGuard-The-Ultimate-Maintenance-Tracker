import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="h-10 w-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          Sorry, you don't have permission to access this page.
          {user && (
            <span className="block mt-2 text-sm">
              You are logged in as <strong>{user.name}</strong> ({user.role})
            </span>
          )}
        </p>

        <div className="space-y-3">
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="h-5 w-5" />
            Go to Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </div>

        {user?.role === 'member' && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-left">
            <p className="text-sm text-yellow-800">
              <strong>Need access?</strong> Contact your administrator to request additional permissions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnauthorizedPage;

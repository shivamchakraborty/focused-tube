import React from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LoginButton() {
  const { user, signInWithGoogle, logout, error } = useAuth();

  return (
    <div className="flex flex-col items-stretch sm:items-end">
      <div className="flex items-center justify-center sm:justify-end">
        {user ? (
          <button
            onClick={logout}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto px-4 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogIn className="w-5 h-5" />
            <span>Sign in with Google</span>
          </button>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 text-center sm:text-right">
          {error}
        </p>
      )}
    </div>
  );
}
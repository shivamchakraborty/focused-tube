import React from 'react';
import { Navigate } from 'react-router-dom';
import { LogIn, ArrowRight } from 'lucide-react';
import { AnimatedLogo } from '../components/AnimatedLogo';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const { user, signInWithGoogle, error } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-dark dark:via-dark-lighter dark:to-dark flex flex-col items-center justify-center px-4 py-8 sm:p-4 transition-colors relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-900/[0.02] dark:bg-grid-white/[0.02] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/[0.02] to-transparent animate-pulse -z-10" />
      
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-8">
            <AnimatedLogo size="lg" />
          </div>
        </div>
        <div className="bg-white/70 dark:bg-dark-card/70 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
            Your distraction-free YouTube experience awaits
          </p>

          <div className="mt-6 sm:mt-8">
            <button
              onClick={signInWithGoogle}
              className="group relative w-full sm:w-auto sm:mx-auto flex items-center justify-center px-3 py-2 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-lg text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-center space-x-3 pr-6">
                <LogIn className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                <span>Continue with Google</span>
              </div>
              <div className="absolute right-3 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="mt-5 sm:mt-6">
            <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              By continuing, you agree to our{' '}
              <a href="#" className="font-medium text-red-600 hover:text-red-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-red-600 hover:text-red-500">
                Privacy Policy
              </a>
              <span className="text-gray-400 dark:text-gray-500">.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
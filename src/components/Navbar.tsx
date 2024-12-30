import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AnimatedLogo } from './AnimatedLogo';
import { useAuth } from '../contexts/AuthContext';
import { LoginButton } from './LoginButton';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../lib/utils';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = !isOpen ? 'hidden' : 'unset';
  };

  return (
    <nav className="bg-white dark:bg-dark-lighter shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <AnimatedLogo size="sm" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-2">
            <ThemeToggle />
            {user && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, {user.displayName}
              </p>
            )}
            <LoginButton />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">
                {isOpen ? 'Close main menu' : 'Open main menu'}
              </span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={cn(
          'sm:hidden fixed inset-0 top-16 bg-white z-40 transition-transform duration-300 ease-in-out transform',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="px-4 pt-4 pb-6 space-y-4">
          {user && (
            <p className="text-sm text-gray-600 border-b border-gray-200 pb-4">
              Welcome, {user.displayName}
            </p>
          )}
          <div className="pt-2">
            <LoginButton />
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30"
          aria-hidden="true"
          onClick={toggleMenu}
        />
      )}
    </nav>
  );
}
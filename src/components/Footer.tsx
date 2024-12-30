import React from 'react';
import { Heart, Linkedin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-dark-lighter border-t dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400">
          <span>Developed by</span>
          <a
            href="https://www.linkedin.com/in/uxmrinal/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-500 font-medium"
          >
            Mrinal
          </a>
          <span>with</span>
          <Heart className="w-4 h-4 text-red-600 fill-current" />
        </div>
      </div>
    </footer>
  );
};
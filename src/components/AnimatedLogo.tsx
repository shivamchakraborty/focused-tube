import React from 'react';
import { Youtube } from 'lucide-react';
import { cn } from '../lib/utils';

interface AnimatedLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className, size = 'md' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={cn('relative flex items-center group', className)}>
      <div className="relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-all duration-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 rounded-full blur-xl opacity-30 animate-pulse" />
        
        {/* Floating particles */}
        <div className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute w-1 h-1 bg-red-500 rounded-full",
                "animate-float opacity-75",
              )}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Logo icon */}
        <Youtube 
          className={cn(
            sizes[size],
            'text-red-600 relative z-10',
            'transition-all duration-500',
            'group-hover:scale-110 group-hover:rotate-[360deg]',
            'group-hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'
          )}
        />
      </div>

      {/* Logo text */}
      <span className={cn(
        'ml-3 font-bold tracking-tight relative',
        size === 'sm' && 'text-xl',
        size === 'md' && 'text-2xl',
        size === 'lg' && 'text-3xl',
        'bg-gradient-to-r from-red-600 via-red-500 to-red-400',
        'bg-clip-text text-transparent',
        'transition-all duration-500',
        'group-hover:tracking-wide'
      )}>
        FocusedTube
        
        {/* Text glow effect */}
        <span className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-400 opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-500" />
      </span>
    </div>
  );
};
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface CategoryScrollProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  categories: Array<{ id: string; name: string; color: string }>;
}

export const CategoryScroll: React.FC<CategoryScrollProps> = ({
  selectedCategory,
  onSelectCategory,
  categories,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    checkScrollButtons();
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-dark-lighter/90 shadow-md rounded-r-lg p-2"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-1 py-2"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        <button
          onClick={() => onSelectCategory(null)}
          className={cn(
            'flex-none px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            selectedCategory === null
              ? 'bg-gray-900 text-white shadow-md scale-105'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              'flex-none px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              selectedCategory === category.id
                ? 'text-white shadow-md scale-105'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
            style={{
              backgroundColor:
                selectedCategory === category.id ? category.color : undefined,
            }}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 dark:bg-dark-lighter/90 shadow-md rounded-l-lg p-2"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      )}
    </div>
  );
};
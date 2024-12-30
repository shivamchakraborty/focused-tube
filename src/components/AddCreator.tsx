import React, { useState } from 'react';
import { UserPlus, Search, Loader2 } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useCreatorStore } from '../store/useCreatorStore';
import { useChannelSearch } from '../hooks/useYouTube';
import { MobileBottomSheet } from './MobileBottomSheet';
import { cn } from '../lib/utils';

export const AddCreator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('default');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { addCreator, categories } = useCreatorStore();
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  const { data: creator, isLoading } = useChannelSearch(debouncedSearch);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (creator) {
      addCreator({ ...creator, categoryId: selectedCategory });
      setSearchTerm('');
      setSelectedCategory('default');
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        aria-label="Add new creator"
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed z-20 flex items-center gap-2",
          "bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700",
          "transition-colors duration-200",
          isMobile ? "bottom-28 right-4 p-3" : "bottom-8 right-8 px-4 py-3"
        )}
      >
        <UserPlus className={cn(
          "w-6 h-6",
          "transition-transform duration-200"
        )} />
        {!isMobile && (
          <span className="font-medium whitespace-nowrap">
            Add Creator
          </span>
        )}
        
      </button>

      {isOpen && (isMobile ? (
        <MobileBottomSheet
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Add Creator"
          zIndex={20}
        >
          <div className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search creator"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent mobile-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent mobile-input"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              </div>
            )}
            
            {creator && (
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-lighter">
                <div className="flex items-center space-x-4">
                  <img
                    src={creator.thumbnailUrl}
                    alt={creator.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{creator.name}</h3>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!creator || isLoading}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base font-medium dark:disabled:opacity-40"
            >
              Add Creator
            </button>
          </div>
        </MobileBottomSheet>
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-card rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Add Creator</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter creator's name"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {isLoading && (
                <div className="flex items-center justify-center mt-4">
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              )}
              
              {creator && (
                <div className="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-lighter">
                  <div className="flex items-center space-x-4">
                    <img
                      src={creator.thumbnailUrl}
                      alt={creator.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{creator.name}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!creator || isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                >
                  Add Creator
                </button>
              </div>
            </form>
          </div>
        </div>
      ))}
    </>
  );
};
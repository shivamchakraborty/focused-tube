import React, { useState, useEffect } from 'react';
import { X, Plus, Search, Loader2 } from 'lucide-react';
import { Category } from '../types/creator';
import { cn } from '../lib/utils';
import { AddCategoryModal } from './AddCategoryModal';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { MobileBottomSheet } from './MobileBottomSheet';

interface CategoryListModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAdd: (category: Omit<Category, 'id'>) => void;
  onRemove: (id: string) => void;
}

export const CategoryListModal: React.FC<CategoryListModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAdd,
  onRemove,
}) => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Simulate loading state
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const content = (
    <>
      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className={cn(
              "w-full pl-9 pr-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent",
              isMobile ? "mobile-input" : "py-2"
            )}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
          </div>
        ) : (
          <div className={cn(
            "space-y-2 overflow-y-auto pr-2 -mr-2",
            isMobile ? "max-h-[50vh]" : "max-h-[280px]"
          )}>
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-lighter rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                </div>
                {category.id !== 'default' && (
                  <button
                    onClick={() => onRemove(category.id)}
                    className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No categories found</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-dark-lighter">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className={cn(
            "w-full flex items-center justify-center px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors",
            isMobile ? "py-3 text-base" : "py-2 text-sm"
          )}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Category
        </button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        <MobileBottomSheet
          key="category-list"
          isOpen={isOpen}
          onClose={onClose}
          title={`Categories (${categories.length})`}
          zIndex={20}
        >
          {content}
        </MobileBottomSheet>

        <AddCategoryModal
          key="add-category"
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={onAdd}
          existingCategories={categories}
          zIndex={30}
        />
      </>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-card rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Categories</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              placeholder="Search categories..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-2 -mr-2">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-lighter rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
                  </div>
                  {category.id !== 'default' && (
                    <button
                      onClick={() => onRemove(category.id)}
                      className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              {filteredCategories.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No categories found</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-dark-lighter rounded-b-lg">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Category
          </button>
        </div>
      </div>

      <AddCategoryModal
        key="add-category"
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={onAdd}
        existingCategories={categories}
        zIndex={30}
      />
    </div>
  );
};
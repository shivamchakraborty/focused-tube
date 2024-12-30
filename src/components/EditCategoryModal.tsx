import React from 'react';
import { X, Check, Search } from 'lucide-react';
import { useCreatorStore } from '../store/useCreatorStore';
import { Creator } from '../types/creator';
import { cn } from '../lib/utils';

interface EditCategoryModalProps {
  creator: Creator;
  isOpen: boolean;
  onClose: () => void;
  zIndex?: number;
}

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  creator,
  isOpen,
  onClose,
  zIndex = 20,
}) => {
  const categories = useCreatorStore((state) => state.categories);
  const updateCreatorCategory = useCreatorStore((state) => state.updateCreatorCategory);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState(creator.categoryId);

  if (!isOpen) return null;

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = () => {
    updateCreatorCategory(creator.id, selectedCategory);
    onClose();
  };

  const selectedCategoryData = categories.find((cat) => cat.id === selectedCategory);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
      style={{ zIndex }}
    >
      <div className="bg-white dark:bg-dark-card rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Category</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={creator.thumbnailUrl}
              alt={creator.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                {creator.name}
              </h3>
              {selectedCategoryData && (
                <div className="flex items-center mt-1">
                  <div
                    className="w-2 h-2 rounded-full mr-2 ring-1 ring-white dark:ring-gray-700"
                    style={{ backgroundColor: selectedCategoryData.color }}
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Current: {selectedCategoryData.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="max-h-[280px] overflow-y-auto space-y-2">
            {filteredCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  'w-full flex items-center justify-between p-3 rounded-lg transition-all dark:border-red-500/50',
                  selectedCategory === category.id
                    ? 'bg-red-50 dark:bg-red-500/10 border-2 border-red-500'
                    : 'bg-gray-50 dark:bg-dark-lighter hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent'
                )}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full ring-2 ring-white dark:ring-gray-700"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </span>
                </div>
                {selectedCategory === category.id && (
                  <Check className="w-4 h-4 text-red-600" />
                )}
              </button>
            ))}

            {filteredCategories.length === 0 && (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400">No categories found</p>
              </div>
            )}
          </div>

          {selectedCategoryData && selectedCategoryData.id !== creator.categoryId && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-4 h-4 rounded-full ring-2 ring-white dark:ring-gray-700"
                    style={{ backgroundColor: selectedCategoryData.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Selected: {selectedCategoryData.name}
                  </span>
                </div>
              </div>
          )}
        </div>

        <div className="flex justify-end gap-2 p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-dark-lighter rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={selectedCategory === creator.categoryId}
            title={selectedCategory === creator.categoryId ? 'No changes to save' : 'Save changes'}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
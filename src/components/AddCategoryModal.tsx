import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { Category } from '../types/creator';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (category: Omit<Category, 'id'>) => void;
  existingCategories: Category[];
  zIndex?: number;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  existingCategories,
  zIndex = 20,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#94a3b8');
  const [error, setError] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width: 640px)');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setColor('#94a3b8');
      setError(null);
    }
  }, [isOpen]);

  const validateCategory = () => {
    if (!name.trim()) {
      setError('Category name is required');
      return false;
    }
    
    if (existingCategories.some(cat => 
      cat.name.toLowerCase() === name.trim().toLowerCase()
    )) {
      setError('Category with this name already exists');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCategory()) return;

    onAdd({
      name: name.trim(),
      color,
    });
    onClose();
  };

  if (!isOpen) return null;

  const presetColors = [
    '#DC2626', '#EA580C', '#D97706', '#65A30D', 
    '#059669', '#0891B2', '#2563EB', '#7C3AED', 
    '#C026D3', '#94a3b8'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex }}>
      <div className="bg-white dark:bg-dark-card rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Category</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              className="w-full border dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter category name"
            />
            {error && (
              <div className="mt-1 flex items-center gap-1 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category Color
            </label>
            <div className="grid grid-cols-5 gap-2">
              {presetColors.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  onClick={() => setColor(presetColor)}
                  className={cn("w-full transition-all mobile-touch-target", {
                    'ring-2 ring-offset-2 ring-red-500': color === presetColor,
                    'aspect-square rounded-lg': true
                  })}
                  style={{ backgroundColor: presetColor }}
                >
                  {color === presetColor && (
                    <Check className="w-4 h-4 text-white mx-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-dark-lighter p-3 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview</p>
            <div className="flex items-center space-x-2">
              <div
                className="px-3 py-1.5 rounded-full text-sm text-white"
                style={{ backgroundColor: color }}
              >
                {name || 'Category Name'}
              </div>
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-2 p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-dark-lighter rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!name.trim()}
            className={cn(
              "font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
              isMobile ? "px-5 py-3 text-base" : "px-4 py-2 text-sm"
            )}
          >
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
};
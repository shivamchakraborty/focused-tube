import React, { useState } from 'react';
import { CategoryScroll } from './CategoryScroll';
import { useCreatorStore } from '../store/useCreatorStore';
import { CategoryManager } from './CategoryManager';
import { Plus } from 'lucide-react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { cn } from '../lib/utils';

export function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}) {
  const categories = useCreatorStore((state) => state.categories);
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddCreatorModalOpen, setIsAddCreatorModalOpen] = useState(false);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center font-medium px-4 py-2 rounded-lg text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>Add Category</span>
        </button>
      </div>
      <div className="relative mb-4">
        <CategoryScroll
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      </div>
      <CategoryManager isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
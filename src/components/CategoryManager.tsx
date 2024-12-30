import React, { useState } from 'react';
import { useCreatorStore } from '../store/useCreatorStore';
import { CategoryListModal } from './CategoryListModal';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryManager: React.FC<CategoryManagerProps> = ({
  isOpen,
  onClose,
}) => {
  const { categories, addCategory, removeCategory } = useCreatorStore();

  return (
    <CategoryListModal
      isOpen={isOpen}
      onClose={onClose}
      onAdd={addCategory}
      onRemove={removeCategory}
      categories={categories}
      zIndex={30}
    />
  );
};
import { useCreatorStore } from '../store/useCreatorStore';

export const useCategories = () => {
  const categories = useCreatorStore((state) => state.categories);
  const addCategory = useCreatorStore((state) => state.addCategory);
  const removeCategory = useCreatorStore((state) => state.removeCategory);
  const updateCategory = useCreatorStore((state) => state.updateCategory);

  return {
    categories,
    addCategory,
    removeCategory,
    updateCategory,
    getCategoryById: (id: string) => categories.find((c) => c.id === id),
  };
};
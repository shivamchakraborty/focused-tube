import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Creator, Category } from '../types/creator';
import { generateUniqueId } from '../utils/idGenerator';
import { syncCreators, deleteCreator, syncCategories, deleteCategory } from '../lib/firestore';
import { auth } from '../lib/firebase';

interface CreatorStore {
  creators: Creator[];
  categories: Category[];
  addCreator: (creator: Creator) => void;
  removeCreator: (id: string) => void;
  addCategory: (category: Category) => void;
  removeCategory: (id: string) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  updateCreatorCategory: (creatorId: string, categoryId: string) => void;
  setCategories: (categories: Category[]) => void;
  clearStore: () => void;
}

export const useCreatorStore = create<CreatorStore>()(
  persist(
    (set, get) => ({
      creators: [],
      categories: [
        { id: 'default', name: 'Uncategorized', color: '#94a3b8' },
      ],
      addCreator: (creator) =>
        set((state) => {
          const exists = state.creators.some(c => c.channelId === creator.channelId);
          if (exists) return state;
          
          const userId = auth.currentUser?.uid;
          if (!userId) return state;

          const newCreators = [...state.creators, { ...creator, id: generateUniqueId() }];
          syncCreators(userId, newCreators);
          return { creators: newCreators };
        }),
      removeCreator: async (id) =>
        set((state) => {
          const userId = auth.currentUser?.uid;
          if (!userId) return state;

          const newCreators = state.creators.filter((creator) => creator.id !== id);
          deleteCreator(userId, id).catch(console.error);
          return { creators: newCreators };
        }),
      addCategory: (category) =>
        set((state) => {
          const userId = auth.currentUser?.uid;
          if (!userId) return state;

          const newCategory = {
            ...category,
            id: generateUniqueId(),
            userId,
          };
          
          const newCategories = [...state.categories, newCategory];
          
          syncCategories(userId, newCategories).catch(console.error);
          
          return { categories: newCategories };
        }),
      removeCategory: (id) =>
        set((state) => {
          if (id === 'default') return state;
          
          const userId = auth.currentUser?.uid;
          if (!userId) return state;

          const newCategories = state.categories.filter((category) => category.id !== id);
          const newCreators = state.creators.map((creator) =>
            creator.categoryId === id ? { ...creator, categoryId: 'default' } : creator
          );
          
          Promise.all([
            deleteCategory(userId, id),
            syncCreators(userId, newCreators)
          ]).catch(console.error);
          
          return { categories: newCategories, creators: newCreators };
        }),
      updateCategory: (id, updatedCategory) =>
        set((state) => {
          const userId = auth.currentUser?.uid;
          if (!userId) return state;

          const newCategories = state.categories.map((category) =>
            category.id === id ? { ...category, ...updatedCategory } : category
          );
          syncCategories(userId, newCategories);
          return { categories: newCategories };
        }),
      updateCreatorCategory: (creatorId, categoryId) =>
        set((state) => {
          const userId = auth.currentUser?.uid;
          if (!userId) return state;

          const newCreators = state.creators.map((creator) =>
            creator.id === creatorId ? { ...creator, categoryId } : creator
          );
          syncCreators(userId, newCreators);
          return { creators: newCreators };
        }),
      setCategories: (categories) => set({ categories }),
      clearStore: () => set({ creators: [], categories: [{ id: 'default', name: 'Uncategorized', color: '#94a3b8' }] }),
    }),
    {
      name: 'creator-storage',
    }
  )
);
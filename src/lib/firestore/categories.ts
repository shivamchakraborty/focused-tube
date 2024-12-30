import { doc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { categoriesCollection } from './collections';
import { Category } from '../../types/creator';

export const syncCategories = async (userId: string, categories: Category[]) => {
  const batch = [];
  for (const category of categories) {
    if (category.id === 'default') continue;
    const categoryRef = doc(categoriesCollection(userId), category.id);
    batch.push(setDoc(categoryRef, {
      ...category,
      userId,
      updatedAt: serverTimestamp(),
    }));
  }
  await Promise.all(batch);
};

export const deleteCategory = async (userId: string, categoryId: string) => {
  if (categoryId === 'default') return;
  const categoryRef = doc(categoriesCollection(userId), categoryId);
  await deleteDoc(categoryRef);
};

export const subscribeToCategories = (userId: string, onUpdate: (categories: Category[]) => void) => {
  return onSnapshot(categoriesCollection(userId), (snapshot) => {
    const categories: Category[] = [
      { id: 'default', name: 'Uncategorized', color: '#94a3b8' },
    ];
    snapshot.forEach((doc) => {
      categories.push(doc.data() as Category);
    });
    onUpdate(categories);
  });
};
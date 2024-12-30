import { collection, doc, setDoc, getDoc, updateDoc, onSnapshot, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { Creator, Category } from '../types/creator';

// Collection References
export const usersCollection = collection(db, 'users');
export const creatorsCollection = (userId: string) => collection(doc(usersCollection, userId), 'creators');
export const categoriesCollection = (userId: string) => collection(doc(usersCollection, userId), 'categories');

// Creator Management
export const syncCreators = async (userId: string, creators: Creator[]) => {
  const batch = [];
  for (const creator of creators) {
    const creatorRef = doc(creatorsCollection(userId), creator.id);
    batch.push(setDoc(creatorRef, {
      ...creator,
      updatedAt: serverTimestamp(),
    }));
  }
  await Promise.all(batch);
};

export const deleteCreator = async (userId: string, creatorId: string) => {
  const creatorRef = doc(creatorsCollection(userId), creatorId);
  await deleteDoc(creatorRef);
};

// Category Management
export const syncCategories = async (userId: string, categories: Category[]) => {
  const batch = [];
  for (const category of categories) {
    if (category.id === 'default') continue; // Skip default category
    const categoryRef = doc(categoriesCollection(userId), category.id);
    batch.push(setDoc(categoryRef, {
      ...category,
      updatedAt: serverTimestamp(),
    }));
  }
  await Promise.all(batch);
};

export const deleteCategory = async (userId: string, categoryId: string) => {
  if (categoryId === 'default') return; // Prevent deletion of default category
  const categoryRef = doc(categoriesCollection(userId), categoryId);
  await deleteDoc(categoryRef);
};

// Subscription Handlers
export const subscribeToCreators = (userId: string, onUpdate: (creators: Creator[]) => void) => {
  return onSnapshot(creatorsCollection(userId), (snapshot) => {
    const creators: Creator[] = [];
    snapshot.forEach((doc) => {
      creators.push(doc.data() as Creator);
    });
    onUpdate(creators);
  });
};

export const subscribeToCategories = (userId: string, onUpdate: (categories: Category[]) => void) => {
  return onSnapshot(categoriesCollection(userId), (snapshot) => {
    const categories: Category[] = [
      { id: 'default', name: 'Uncategorized', color: '#94a3b8' }, // Always include default
    ];
    snapshot.forEach((doc) => {
      categories.push(doc.data() as Category);
    });
    onUpdate(categories);
  });
};

// User Profile Management
export const initializeUserProfile = async (userId: string, userData: any) => {
  const userRef = doc(usersCollection, userId);
  await setDoc(userRef, {
    email: userData.email,
    displayName: userData.displayName,
    photoURL: userData.photoURL,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  }, { merge: true });
};
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { usersCollection } from './collections';

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

export const subscribeToUserData = (userId: string, onUpdate: (data: any) => void) => {
  const userRef = doc(usersCollection, userId);
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      onUpdate(doc.data());
    }
  });
};
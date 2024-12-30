import { collection, doc } from 'firebase/firestore';
import { db } from '../firebase';

export const usersCollection = collection(db, 'users');
export const creatorsCollection = (userId: string) => collection(doc(usersCollection, userId), 'creators');
export const categoriesCollection = (userId: string) => collection(doc(usersCollection, userId), 'categories');
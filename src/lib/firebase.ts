import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBGJpYzvkms1y7wNFoAReRvuVE1L-fPf6Q",
  authDomain: "creator-d9eb4.firebaseapp.com",
  databaseURL: "https://creator-d9eb4-default-rtdb.firebaseio.com",
  projectId: "creator-d9eb4",
  storageBucket: "creator-d9eb4.firebasestorage.app",
  messagingSenderId: "948779662740",
  appId: "1:948779662740:web:75a0b5885ec4901936e381"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.warn('The current browser does not support offline persistence.');
  }
});
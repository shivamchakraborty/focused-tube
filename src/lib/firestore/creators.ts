import { doc, setDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { creatorsCollection } from './collections';
import { Creator } from '../../types/creator';

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

export const subscribeToCreators = (userId: string, onUpdate: (creators: Creator[]) => void) => {
  return onSnapshot(creatorsCollection(userId), (snapshot) => {
    const creators: Creator[] = [];
    snapshot.forEach((doc) => {
      creators.push(doc.data() as Creator);
    });
    onUpdate(creators);
  });
};
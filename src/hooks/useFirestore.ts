import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToCreators, subscribeToCategories } from '../lib/firestore';
import { useCreatorStore } from '../store/useCreatorStore';

export const useFirestoreSync = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setCategories = useCreatorStore((state) => state.setCategories);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const unsubscribeCreators = subscribeToCreators(user.uid, (firestoreCreators) => {
      if (!isMounted) return;
      window.requestAnimationFrame(() => {
        useCreatorStore.setState({ creators: firestoreCreators });
      });
    });

    const unsubscribeCategories = subscribeToCategories(user.uid, (firestoreCategories) => {
      if (!isMounted) return;
      window.requestAnimationFrame(() => {
        setCategories(firestoreCategories);
      });
    });

    setLoading(false);

    return () => {
      isMounted = false;
      unsubscribeCreators();
      unsubscribeCategories();
    };
  }, [user, setCategories]);

  return { loading, error };
};
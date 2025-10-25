import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Material {
  id: string;
  name: string;
  orderIndex: number;
}

export function useMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'materials'), orderBy('orderIndex'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const materialsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Material));
      setMaterials(materialsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { materials, loading };
}

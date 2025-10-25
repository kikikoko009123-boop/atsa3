import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  slug?: string;
  bio?: string;
  createdAt: number;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up Firestore listener for products collection...');
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log('Products updated. Total count:', snapshot.docs.length);
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching products from Firestore:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { products, loading };
}

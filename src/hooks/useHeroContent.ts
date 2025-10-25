import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface HeroContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
}

export function useHeroContent() {
  const [heroContent, setHeroContent] = useState<HeroContent>({
    id: 'main',
    title: 'Precision Manufacturing in Stainless Steel',
    subtitle: 'Since 1992, ATSA has been leading the industry with over 30 years of expertise in stainless steel fabrication and precision metalwork.',
    description: 'Specializing in aluminum, inox, stainless steel, welding, cutting, bending, and mechanical works.'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'hero', 'main'), (snapshot) => {
      if (snapshot.exists()) {
        setHeroContent({
          id: snapshot.id,
          ...snapshot.data()
        } as HeroContent);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { heroContent, loading };
}

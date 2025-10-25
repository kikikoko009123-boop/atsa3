import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface SiteSettings {
  logoUrl: string;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>({
    logoUrl: 'https://i.postimg.cc/9F7TBQqY/dfefwe.png'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'site'), (doc) => {
      if (doc.exists()) {
        setSettings(doc.data() as SiteSettings);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching site settings:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { settings, loading };
}

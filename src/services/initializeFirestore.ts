import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export async function initializeSiteSettings() {
  try {
    const settingsRef = doc(db, 'settings', 'site');
    const settingsDoc = await getDoc(settingsRef);

    if (!settingsDoc.exists()) {
      await setDoc(settingsRef, {
        logoUrl: 'https://i.postimg.cc/9F7TBQqY/dfefwe.png'
      });
      console.log('Site settings initialized with default logo');
    }
  } catch (error) {
    console.error('Error initializing site settings:', error);
  }
}

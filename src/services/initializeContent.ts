import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

const defaultServices = [
  {
    id: 'welding',
    title: 'Welding',
    description: 'Expert welding services ensuring strong, durable bonds for all metal types.',
    imageUrl: 'https://images.pexels.com/photos/1474993/pexels-photo-1474993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    icon: 'Zap',
    orderIndex: 1
  },
  {
    id: 'cutting-bending',
    title: 'Cutting & Bending',
    description: 'Precision cutting and bending services for complex metal forming requirements.',
    imageUrl: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    icon: 'Shield',
    orderIndex: 2
  },
  {
    id: 'mechanical-works',
    title: 'Mechanical Works',
    description: 'Comprehensive mechanical fabrication and assembly services.',
    imageUrl: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
    icon: 'CheckCircle',
    orderIndex: 3
  }
];

const defaultMaterials = [
  { id: 'stainless-steel', name: 'Stainless Steel (Inox)', orderIndex: 1 },
  { id: 'aluminum', name: 'Aluminum', orderIndex: 2 },
  { id: 'carbon-steel', name: 'Carbon Steel', orderIndex: 3 },
  { id: 'galvanized-steel', name: 'Galvanized Steel (Galva)', orderIndex: 4 },
  { id: 'metal-alloys', name: 'Various Metal Alloys', orderIndex: 5 }
];

const defaultHeroContent = {
  id: 'main',
  title: 'Precision Manufacturing in Stainless Steel',
  subtitle: 'Since 1992, ATSA has been leading the industry with over 30 years of expertise in stainless steel fabrication and precision metalwork.',
  description: 'Specializing in aluminum, inox, stainless steel, welding, cutting, bending, and mechanical works.'
};

export async function initializeContent() {
  try {
    const servicesSnapshot = await getDocs(collection(db, 'services'));
    if (servicesSnapshot.empty) {
      console.log('Initializing services...');
      for (const service of defaultServices) {
        await setDoc(doc(db, 'services', service.id), service);
      }
    }

    const materialsSnapshot = await getDocs(collection(db, 'materials'));
    if (materialsSnapshot.empty) {
      console.log('Initializing materials...');
      for (const material of defaultMaterials) {
        await setDoc(doc(db, 'materials', material.id), material);
      }
    }

    const heroDoc = await getDocs(collection(db, 'hero'));
    if (heroDoc.empty) {
      console.log('Initializing hero content...');
      await setDoc(doc(db, 'hero', defaultHeroContent.id), defaultHeroContent);
    }

    console.log('Content initialization complete');
  } catch (error) {
    console.error('Error initializing content:', error);
  }
}

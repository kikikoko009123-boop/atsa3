import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDNRFcuFNjrTN2JYMo2MmXiD7j3rfoGlYA",
  authDomain: "atsa-ab22d.firebaseapp.com",
  projectId: "atsa-ab22d",
  storageBucket: "atsa-ab22d.firebasestorage.app",
  messagingSenderId: "797606886129",
  appId: "1:797606886129:web:e83461d961af3c82b9c750",
  measurementId: "G-3GQYWV4JVV"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase issue de google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyBiYv8N4sdMBl286g5pmjOvfaKoUkdXorU",
  authDomain: "tiktok-80.firebaseapp.com",
  projectId: "tiktok-80",
  storageBucket: "tiktok-80.firebasestorage.app",
  messagingSenderId: "374478252228",
  appId: "1:374478252228:android:7ab445e407e6af7b090191"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Exporter les services Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

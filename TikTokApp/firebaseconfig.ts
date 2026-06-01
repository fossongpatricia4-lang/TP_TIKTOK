/**
 * TikTok Clone — firebaseConfig.ts
 * Configuration Firebase — NE PAS METTRE SUR GITHUB
 * Projet : TP TIKTOK (tiktok-80)
 * Chef de projet : Patricia
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase de Patricia
const firebaseConfig = {
  apiKey: "AIzaSyAkN95aRmEzfnlQ-VWd0FbT4TFgjYUfDBQ",
  authDomain: "tiktok-80.firebaseapp.com",
  projectId: "tiktok-80",
  storageBucket: "tiktok-80.firebasestorage.app",
  messagingSenderId: "374478252228",
  appId: "1:374478252228:web:12356075c1270ecf090191",
  measurementId: "G-9RJCCHG1FC"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Exporter les services Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration Firebase issue de google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyBmeiwYzgwA8SVyJwo_NnSV7demsmWwl84",
  authDomain: "icttok.firebaseapp.com",
  projectId: "icttok",
  storageBucket: "icttok.firebasestorage.app",
  messagingSenderId: "340558321578",
  appId: "1:340558321578:web:28dbc37db8910574543dd3",
  measurementId: "G-4Z8594V3VL"
};  

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Exporter les services Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

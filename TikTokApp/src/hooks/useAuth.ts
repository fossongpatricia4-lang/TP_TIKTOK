/**
 * TikTok Clone — useAuth.ts
 * Hook personnalise pour gerer l'authentification
 * Utilisable dans tous les ecrans de l'app
 */

import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebaseconfig';

interface AuthState {
  loading: boolean;
  error: string | null;
}

const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    loading: false,
    error: null,
  });

  // Inscription
  const register = async (
    email: string,
    password: string,
    username: string
  ): Promise<User | null> => {
    setState({ loading: true, error: null });
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Sauvegarder le profil dans Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        username,
        profilePic: '',
        bio: '',
        followers: 0,
        following: 0,
        createdAt: serverTimestamp(),
      });

      setState({ loading: false, error: null });
      return user;
    } catch (err: any) {
      setState({ loading: false, error: err.message });
      return null;
    }
  };

  // Connexion
  const login = async (
    email: string,
    password: string
  ): Promise<User | null> => {
    setState({ loading: true, error: null });
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setState({ loading: false, error: null });
      return user;
    } catch (err: any) {
      setState({ loading: false, error: err.message });
      return null;
    }
  };

  // Deconnexion
  const logout = async (): Promise<void> => {
    setState({ loading: true, error: null });
    try {
      await signOut(auth);
      setState({ loading: false, error: null });
    } catch (err: any) {
      setState({ loading: false, error: err.message });
    }
  };

  return {
    loading: state.loading,
    error: state.error,
    register,
    login,
    logout,
    currentUser: auth.currentUser,
  };
};

export default useAuth;

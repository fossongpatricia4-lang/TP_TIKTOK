/**
 * TikTok Clone — theme.ts
 * Couleurs et styles globaux de toute l'application
 * Dev 8 peut enrichir ce fichier(le dev 8 a deja fait son travail)
 */

import { StyleSheet, Dimensions } from 'react-native';

// Récupération des dimensions de l'écran pour le responsive
const { width, height } = Dimensions.get('window');

// 1. Dictionnaire des couleurs globales (Ambiance Cyber-Créateur)
export const COLORS = {
  primary: '#7B61FF',    // Violet électrique (pour les boutons principaux, likes)
  secondary: '#00F5D4',  // Menthe fluo (pour les switchs, badges ou effets)
  background: '#09090B', // Noir légèrement bleuté/gris très profond
  white: '#FFFFFF',
  text: '#F3F4F6',       // Blanc cassé doux pour lire sans se fatiguer les yeux
  textGray: '#9CA3AF',   // Gris pour les textes secondaires (@username, dates...)
  border: '#27272A',     // Gris foncé pour les bordures et séparateurs
  lightGray: '#E5E5E5',
};

// 2. Dimensions globales
export const SIZES = {
  width,
  height,
  padding: 15,
  iconSmall: 24,
  iconMedium: 32,
  iconLarge: 40,
};

// 3. Styles communs réutilisables par toute l'équipe
export const globalStyles = StyleSheet.create({
  // Conteneur principal pour les écrans classiques
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // Conteneur centré (très utile pour le LoginScreen et RegisterScreen)
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  // Style de texte de base
  text: {
    color: COLORS.text,
    fontSize: 16,
  },
  // Titres des écrans
  title: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  // Style global pour les boutons d'action (ex: Se connecter, S'inscrire)
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  },
  // Texte à l'intérieur des boutons
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  // Style global pour les champs de saisie (TextInput)
  input: {
    backgroundColor: '#18181B',
    color: COLORS.text,
    width: '100%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  // Ligne de séparation horizontale (utile pour la liste des commentaires)
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    width: '100%',
    marginVertical: 10,
  }
});
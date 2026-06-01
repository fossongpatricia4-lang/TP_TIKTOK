/**
 * TikTok Clone — LoadingScreen.tsx
 * Ecran de chargement pendant la verification de l'authentification
 */

import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { COLORS } from '../utils/theme';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>TikTok</Text>
      <ActivityIndicator
        size="large"
        color={COLORS.primary}
        style={styles.spinner}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 30,
    letterSpacing: 2,
  },
  spinner: {
    marginTop: 20,
  },
});

export default LoadingScreen;

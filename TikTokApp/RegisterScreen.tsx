/**
 * TikTok Clone — RegisterScreen.tsx
 * PLACEHOLDER — A completer par Dev 2
 * Ce fichier est cree par le chef de projet pour que
 * la navigation fonctionne des le debut
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/theme';

const RegisterScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🔐 Authentification</Text>
      <Text style={styles.sub}>A completer par Dev 2</Text>
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
  text: { color: COLORS.white, fontSize: 24, fontWeight: 'bold' },
  sub: { color: COLORS.lightGray, fontSize: 14, marginTop: 10 },
});

export default RegisterScreen;

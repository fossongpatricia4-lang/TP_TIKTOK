/**
 * TikTok Clone — HomeScreen.tsx
 * PLACEHOLDER — A completer par Dev 3
 * Ce fichier est cree par le chef de projet pour que
 * la navigation fonctionne des le debut
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/theme';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🎬 Fil de videos</Text>
      <Text style={styles.sub}>A completer par Dev 3</Text>
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

export default HomeScreen;

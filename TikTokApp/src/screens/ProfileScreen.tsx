/**
 * TikTok Clone — ProfileScreen.tsx
 * PLACEHOLDER — A completer par Dev 6
 * Ce fichier est cree par le chef de projet pour que
 * la navigation fonctionne des le debut
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/theme';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>👤 Profil utilisateur</Text>
      <Text style={styles.sub}>A completer par Dev 6</Text>
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

export default ProfileScreen;

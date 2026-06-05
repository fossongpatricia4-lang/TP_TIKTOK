/**
 * TikTok Clone — CommentsScreen.tsx
 * PLACEHOLDER — A completer par Dev 5
 * Ce fichier est cree par le chef de projet pour que
 * la navigation fonctionne des le debut
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/theme';

const CommentsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>💬 Commentaires</Text>
      <Text style={styles.sub}>A completer par Dev 5</Text>
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

export default CommentsScreen;

/**
 * TikTok Clone — HomeScreen.tsx
 * Affiche le fil de vidéos avec les interactions (like, commentaires, etc.)
 * Intégration Firebase pour les likes et les commentaires
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import CommentsScreen from './CommentsScreen';
import { auth } from '../config/firebaseconfig';
import { likeVideo, unlikeVideo } from '../services/interactionService';
import { COLORS } from '../styles/theme';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

// Données fictives pour les vidéos
const MOCK_VIDEOS = [
  {
    id: '1',
    author: 'Alice Martin',
    avatar: 'https://via.placeholder.com/40',
    description: 'Incroyable talent! 🎸',
    thumbnail: 'https://via.placeholder.com/400x600',
    likes: 12450,
    comments: 234,
    shares: 890,
  },
  {
    id: '2',
    author: 'Bob Chen',
    avatar: 'https://via.placeholder.com/40',
    description: 'Ma première vidéo TikTok! #debut',
    thumbnail: 'https://via.placeholder.com/400x600',
    likes: 8900,
    comments: 145,
    shares: 560,
  },
];

const HomeScreen = () => {
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [videoLikeCounts, setVideoLikeCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Initialiser les compteurs de likes
    const initialCounts: { [key: string]: number } = {};
    MOCK_VIDEOS.forEach(video => {
      initialCounts[video.id] = video.likes;
    });
    setVideoLikeCounts(initialCounts);
  }, []);

  const handleOpenComments = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  const handleLike = async (videoId: string) => {
    if (!auth.currentUser) {
      console.warn('Utilisateur non authentifié');
      return;
    }

    const isLiked = likedVideos.has(videoId);

    try {
      if (isLiked) {
        // Retirer le like
        await unlikeVideo(videoId, auth.currentUser.uid);
        setLikedVideos(prev => {
          const newSet = new Set(prev);
          newSet.delete(videoId);
          return newSet;
        });
        setVideoLikeCounts(prev => ({
          ...prev,
          [videoId]: Math.max(0, (prev[videoId] || 0) - 1),
        }));
      } else {
        // Ajouter le like
        await likeVideo(videoId, auth.currentUser.uid);
        setLikedVideos(prev => new Set(prev).add(videoId));
        setVideoLikeCounts(prev => ({
          ...prev,
          [videoId]: (prev[videoId] || 0) + 1,
        }));
      }
    } catch (error) {
      console.error('Erreur lors du like/unlike:', error);
    }
  };

  const renderVideoItem = ({ item }: any) => {
    const isLiked = likedVideos.has(item.id);
    const likeCount = videoLikeCounts[item.id] || item.likes;

    return (
      <View style={styles.videoContainer}>
        {/* Vidéo / Thumbnail */}
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.videoThumbnail}
        />

        {/* Overlay avec infos */}
        <View style={styles.videoOverlay}>
          {/* Auteur et description (en bas à gauche) */}
          <View style={styles.videoInfo}>
            <Image
              source={{ uri: item.avatar }}
              style={styles.authorAvatar}
            />
            <View style={styles.authorDetails}>
              <Text style={styles.authorName}>{item.author}</Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </View>

          {/* Boutons d'interaction (en bas à droite) */}
          <View style={styles.interactionButtons}>
            {/* Likes */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleLike(item.id)}
            >
              <Text style={[styles.actionIcon, isLiked && styles.likedIcon]}>
                {isLiked ? '❤️' : '🤍'}
              </Text>
              <Text style={styles.actionCount}>
                {likeCount > 1000 ? `${(likeCount / 1000).toFixed(1)}K` : likeCount}
              </Text>
            </TouchableOpacity>

            {/* Commentaires */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleOpenComments(item.id)}
            >
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionCount}>
                {item.comments > 1000 ? `${(item.comments / 1000).toFixed(1)}K` : item.comments}
              </Text>
            </TouchableOpacity>

            {/* Partages */}
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>➤</Text>
              <Text style={styles.actionCount}>
                {item.shares > 1000 ? `${(item.shares / 1000).toFixed(1)}K` : item.shares}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={MOCK_VIDEOS}
        renderItem={renderVideoItem}
        keyExtractor={item => item.id}
        snapToInterval={screenHeight}
        decelerationRate="fast"
        scrollEventThrottle={16}
        pagingEnabled
      />

      {/* Bottom Sheet pour les commentaires */}
      {selectedVideoId && (
        <CommentsScreen
          videoId={selectedVideoId}
          visible={!!selectedVideoId}
          onClose={() => setSelectedVideoId(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  videoContainer: {
    width: screenWidth,
    height: screenHeight - 60, // Soustraire la hauteur de la tab bar
    backgroundColor: COLORS.black,
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 16,
    // Gradient overlay (approximé avec une couche semi-transparente)
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  videoInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 12,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    color: COLORS.white,
    fontSize: 13,
    lineHeight: 18,
  },
  interactionButtons: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  likedIcon: {
    // Animation de scale peut être ajoutée ici
  },
  actionCount: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default HomeScreen;

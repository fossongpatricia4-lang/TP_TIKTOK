/**
 * TikTok Clone — VideoCard.tsx
 * Version MVP Simplifiée — Dev 3 (Fil de vidéos)
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Video, { ResizeMode, VideoRef } from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { COLORS, FONTS } from '../styles/theme';

type RootStackParamList = {
  Feed: undefined;
  Comments: { videoId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Feed'>;

interface VideoData {
  id: string;
  userId: string;
  videoUrl: string;
  description: string;
  likesCount: number;
}

interface VideoCardProps {
  video: VideoData;
  isActive: boolean; // Si vrai, la vidéo est visible à l'écran
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const VideoCard: React.FC<VideoCardProps> = ({ video, isActive }) => {
  const navigation = useNavigation<NavigationProp>();
  const videoRef = useRef<VideoRef>(null);

  // États locaux
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Réinitialiser l'état de lecture quand la vidéo n'est plus active
  useEffect(() => {
    if (!isActive) {
      setIsPlaying(true); // Reset pour la prochaine fois
    }
  }, [isActive]);

  // Clic sur l'écran pour Play/Pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
      {/* Zone du lecteur vidéo */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={togglePlayPause}
        style={styles.videoWrapper}
      >
        <Video
          ref={videoRef}
          source={{ uri: video.videoUrl }}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          repeat={true}
          paused={!isActive || !isPlaying}
          onBuffer={({ isBuffering }) => {
            setIsLoading(isBuffering);
          }}
        />

        {/* Loader de chargement au centre */}
        {isLoading && (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        )}

        {/* Indicateur visuel si la vidéo est en pause */}
        {!isPlaying && (
          <View style={styles.playOverlay}>
            <Ionicons name="play" size={60} color="rgba(255, 255, 255, 0.8)" />
          </View>
        )}
      </TouchableOpacity>

      {/* Informations en bas à gauche */}
      <View style={styles.bottomInfo}>
        <Text style={styles.username}>@createur_{video.userId.substring(0, 5)}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {video.description}
        </Text>
      </View>

      {/* Boutons d'actions à droite */}
      <View style={styles.sideActions}>
        {/* Bouton Like (Cœur) */}
        <TouchableOpacity style={styles.actionButton} onPress={() => setIsLiked(!isLiked)}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="heart"
              size={30}
              color={isLiked ? COLORS.primary : COLORS.white}
            />
          </View>
          <Text style={styles.actionText}>
            {isLiked ? video.likesCount + 1 : video.likesCount}
          </Text>
        </TouchableOpacity>

        {/* Bouton Commentaires (Bulle) */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Comments', { videoId: video.id })}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="chatbubble-ellipses" size={28} color={COLORS.white} />
          </View>
          <Text style={styles.actionText}>Commenter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT - 60, // Écran entier moins la barre d'onglets du bas (60px)
    backgroundColor: COLORS.black,
  },
  videoWrapper: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    ...StyleSheet.absoluteFill,
  },
  loader: {
    position: 'absolute',
  },
  playOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    width: SCREEN_WIDTH * 0.7,
    zIndex: 10,
  },
  username: {
    color: COLORS.white,
    fontFamily: FONTS.bold,
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    marginBottom: 5,
    textShadowColor: 'black',
    textShadowRadius: 2,
  },
  description: {
    color: COLORS.white,
    fontFamily: FONTS.regular,
    fontSize: FONTS.sizes.md,
    textShadowColor: 'black',
    textShadowRadius: 2,
  },
  sideActions: {
    position: 'absolute',
    bottom: 20,
    right: 15,
    alignItems: 'center',
    zIndex: 10,
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  actionText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    textShadowColor: 'black',
    textShadowRadius: 2,
  },
});

export default VideoCard;

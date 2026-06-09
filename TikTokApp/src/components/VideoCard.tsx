/**
 * TikTok Clone — VideoCard.tsx
 * Lecteur vidéo vertical (branche dave)
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
import { COLORS, FONTS } from '../styles/theme';

export interface VideoData {
  id: string;
  userId: string;
  videoUrl: string;
  description: string;
  likesCount: number;
}

interface VideoCardProps {
  video: VideoData;
  isActive: boolean;
  isLiked?: boolean;
  onLike?: () => void;
  onComment?: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  isActive,
  isLiked = false,
  onLike,
  onComment,
}) => {
  const videoRef = useRef<VideoRef>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isActive) {
      setIsPlaying(true);
    }
  }, [isActive]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.container}>
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
          repeat
          paused={!isActive || !isPlaying}
          onBuffer={({ isBuffering }) => setIsLoading(isBuffering)}
        />

        {isLoading && (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        )}

        {!isPlaying && (
          <View style={styles.playOverlay}>
            <Ionicons name="play" size={60} color="rgba(255, 255, 255, 0.8)" />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.bottomInfo}>
        <Text style={styles.username}>@createur_{video.userId.substring(0, 5)}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {video.description}
        </Text>
      </View>

      <View style={styles.sideActions}>
        <TouchableOpacity style={styles.actionButton} onPress={onLike}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="heart"
              size={30}
              color={isLiked ? COLORS.primary : COLORS.white}
            />
          </View>
          <Text style={styles.actionText}>{video.likesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onComment}>
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
    height: SCREEN_HEIGHT - 60,
    backgroundColor: COLORS.black,
  },
  videoWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
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
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
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
  },
});

export default VideoCard;

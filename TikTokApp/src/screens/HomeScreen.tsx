/**
 * TikTok Clone — HomeScreen.tsx
<<<<<<< Updated upstream
 * Affiche le fil de vidéos avec les interactions (like, commentaires, etc.)
 * Intégration Firebase pour les likes et les commentaires
 */

import React, { useRef, useState, useEffect } from 'react';
=======
 * Ecran principal affichant le fil de videos vertical
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
>>>>>>> Stashed changes
import {
  View,
  Text,
  StyleSheet,
  FlatList,
<<<<<<< Updated upstream
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
=======
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseconfig';
import VideoCard from '../components/VideoCard';
import { COLORS } from '../styles/theme';

interface VideoData {
  id: string;
  userId: string;
  videoUrl: string;
  thumbnailUrl?: string;
  description: string;
  likesCount: number;
  createdAt: any;
}

// Videos de demonstration si Firestore est vide pour le TP
const DEMO_VIDEOS: VideoData[] = [
  {
    id: 'demo1',
    userId: 'demo_user_1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    description: 'Découvrez le projet de clone TikTok en React Native ! #ReactNative #Firebase #SchoolProject 🚀',
    likesCount: 1240,
    createdAt: new Date(),
  },
  {
    id: 'demo2',
    userId: 'demo_user_2',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    description: 'Animation 3D incroyable pour tester la lecture automatique. Partagez et likez ! #3D #Blender #Art 🎨',
    likesCount: 856,
    createdAt: new Date(),
  },
  {
    id: 'demo3',
    userId: 'demo_user_3',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    description: 'Test de chargement ultra-rapide avec Firebase et Cloudinary. #CodingLife #Dev 💻',
    likesCount: 420,
    createdAt: new Date(),
>>>>>>> Stashed changes
  },
];

const HomeScreen = () => {
<<<<<<< Updated upstream
  const bottomSheetRef = useRef<any>(null);
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
    bottomSheetRef.current?.expand?.();
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
        <CommentsScreen ref={bottomSheetRef} videoId={selectedVideoId} />
      )}
=======
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const CARD_HEIGHT = SCREEN_HEIGHT - 60; // Hauteur du composant VideoCard (taille ecran - bottom tab bar)

  // Etats
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  // Charger les videos depuis Firestore
  const fetchVideos = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const q = query(collection(db, 'videos'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const fetchedVideos: VideoData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedVideos.push({
          id: doc.id,
          userId: data.userId,
          videoUrl: data.videoUrl,
          thumbnailUrl: data.thumbnailUrl,
          description: data.description,
          likesCount: data.likesCount || 0,
          createdAt: data.createdAt,
        });
      });

      // Si Firestore a des videos, on les affiche, sinon on charge les demos
      if (fetchedVideos.length > 0) {
        setVideos(fetchedVideos);
      } else {
        console.log("Firestore collection 'videos' est vide, chargement des demos...");
        setVideos(DEMO_VIDEOS);
      }
    } catch (error) {
      console.error("Erreur lors de la recuperation des videos :", error);
      // Failover sur les demos en cas d'erreur de connexion
      setVideos(DEMO_VIDEOS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Action Pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchVideos(false);
  };

  // Configuration de visibilite pour la FlatList (savoir quelle video est centree)
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // L'element doit etre visible a au moins 50% pour etre declare actif
  }).current;

  // Callback de changement d'element visible
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      // Definir la video active a l'index de l'element visible
      const index = viewableItems[0].index;
      if (index !== null && index !== undefined) {
        setActiveVideoIndex(index);
      }
    }
  }).current;

  // Fonction de rendu de chaque carte de video
  const renderItem = useCallback(
    ({ item, index }: { item: VideoData; index: number }) => (
      <VideoCard
        video={item}
        isActive={index === activeVideoIndex}
      />
    ),
    [activeVideoIndex]
  );

  // Clefs uniques pour la FlatList
  const keyExtractor = useCallback((item: VideoData) => item.id, []);

  // Pendant le chargement initial
  if (loading && videos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement du fil d'actualité...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        snapToInterval={CARD_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        pagingEnabled={true}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        removeClippedSubviews={true} // Performance : libere de la memoire pour les elements hors-champ
        initialNumToRender={2}
        maxToRenderPerBatch={3}
        windowSize={5}
      />
>>>>>>> Stashed changes
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
<<<<<<< Updated upstream
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
=======
  },
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.white,
    marginTop: 12,
    fontSize: 14,
>>>>>>> Stashed changes
  },
});

export default HomeScreen;

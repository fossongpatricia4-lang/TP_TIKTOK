/**
 * TikTok Clone — ProfileScreen.tsx
 * Dev 6 — Ecran Profil utilisateur
 *
 * Fonctionnalites :
 *  - Afficher photo de profil, nom, bio, followers/following
 *  - Grille 3 colonnes des videos de l'utilisateur
 *  - Modifier nom, bio (TextInput)
 *  - Sauvegarder avec updateDoc dans Firestore
 *  - Distinguer son propre profil des autres
 *  - Deconnexion
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from './src/config/firebaseconfig';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from './src/styles/theme';

// ─── Types ───────────────────────────────────────────────────────────────────

interface UserProfile {
  uid: string;
  username: string;
  email: string;
  profilePic: string;
  bio: string;
  followers: number;
  following: number;
  createdAt: any;
}

interface VideoItem {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  description: string;
  likesCount: number;
  createdAt: any;
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_ITEM_SIZE = (SCREEN_WIDTH - 4) / 3; // 3 colonnes avec 2px de gap

// ─── Composant principal ─────────────────────────────────────────────────────

const ProfileScreen = () => {
  // Utilisateur Firebase connecte
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Donnees du profil Firestore
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Videos de l'utilisateur
  const [videos, setVideos] = useState<VideoItem[]>([]);

  // Etats de chargement
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  // Modal d'edition du profil
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editProfilePic, setEditProfilePic] = useState('');

  // ── Ecouter l'utilisateur connecte ────────────────────────────────────────

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // ── Charger le profil depuis Firestore ────────────────────────────────────

  const loadProfile = useCallback(async (uid: string) => {
    setLoadingProfile(true);
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setProfile(data);
        setEditUsername(data.username || '');
        setEditBio(data.bio || '');
        setEditProfilePic(data.profilePic || '');
      } else {
        Alert.alert('Erreur', 'Profil introuvable dans Firestore.');
      }
    } catch (error: any) {
      Alert.alert('Erreur', 'Impossible de charger le profil : ' + error.message);
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  // ── Charger les videos de l'utilisateur ──────────────────────────────────

  const loadVideos = useCallback(async (uid: string) => {
    setLoadingVideos(true);
    try {
      const videosRef = collection(db, 'videos');
      const q = query(
        videosRef,
        where('userId', '==', uid),
        orderBy('createdAt', 'desc')
      );
      const querySnap = await getDocs(q);

      const fetchedVideos: VideoItem[] = querySnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<VideoItem, 'id'>),
      }));

      setVideos(fetchedVideos);
    } catch (error: any) {
      // Si index Firestore manquant, charger sans tri
      try {
        const videosRef = collection(db, 'videos');
        const q = query(videosRef, where('userId', '==', uid));
        const querySnap = await getDocs(q);
        const fetchedVideos: VideoItem[] = querySnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<VideoItem, 'id'>),
        }));
        setVideos(fetchedVideos);
      } catch (e: any) {
        Alert.alert('Erreur', 'Impossible de charger les videos : ' + e.message);
      }
    } finally {
      setLoadingVideos(false);
    }
  }, []);

  // ── Declencher le chargement quand l'utilisateur est connu ───────────────

  useEffect(() => {
    if (currentUser?.uid) {
      loadProfile(currentUser.uid);
      loadVideos(currentUser.uid);
    }
  }, [currentUser, loadProfile, loadVideos]);

  // ── Sauvegarder les modifications du profil ───────────────────────────────

  const handleSaveProfile = async () => {
    if (!currentUser?.uid) return;

    if (!editUsername.trim()) {
      Alert.alert('Erreur', 'Le nom d\'utilisateur ne peut pas etre vide.');
      return;
    }

    setSavingProfile(true);
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        username: editUsername.trim(),
        bio: editBio.trim(),
        profilePic: editProfilePic.trim(),
      });

      // Mettre a jour l'etat local
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              username: editUsername.trim(),
              bio: editBio.trim(),
              profilePic: editProfilePic.trim(),
            }
          : prev
      );

      setEditModalVisible(false);
      Alert.alert('✅ Succes', 'Profil mis a jour !');
    } catch (error: any) {
      Alert.alert('Erreur', 'Impossible de sauvegarder : ' + error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Deconnexion ───────────────────────────────────────────────────────────

  const handleLogout = () => {
    Alert.alert(
      'Deconnexion',
      'Voulez-vous vraiment vous deconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Deconnecter',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
            } catch (error: any) {
              Alert.alert('Erreur', error.message);
            }
          },
        },
      ]
    );
  };

  // ── Rendu d'un element de la grille de videos ────────────────────────────

  const renderVideoItem = ({ item }: { item: VideoItem }) => (
    <TouchableOpacity
      style={styles.gridItem}
      activeOpacity={0.8}
      onPress={() => Alert.alert('Video', item.description || 'Pas de description')}
    >
      {item.thumbnailUrl ? (
        <Image
          source={{ uri: item.thumbnailUrl }}
          style={styles.gridImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.gridPlaceholder}>
          <Text style={styles.gridPlaceholderIcon}>🎬</Text>
        </View>
      )}
      {/* Nombre de likes en bas a gauche */}
      <View style={styles.gridLikes}>
        <Text style={styles.gridLikesText}>❤️ {item.likesCount || 0}</Text>
      </View>
    </TouchableOpacity>
  );

  // ── Etat de chargement initial ────────────────────────────────────────────

  if (loadingProfile) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Profil introuvable.</Text>
      </View>
    );
  }

  // ── Rendu principal ───────────────────────────────────────────────────────

  return (
    <View style={styles.container}>

      {/* ── En-tete du profil ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[]} // pas de header collant
      >
        {/* Barre superieure */}
        <View style={styles.topBar}>
          <Text style={styles.topBarUsername}>@{profile.username}</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Deconnexion</Text>
          </TouchableOpacity>
        </View>

        {/* Photo + stats */}
        <View style={styles.profileHeader}>
          {/* Photo de profil */}
          <View style={styles.avatarContainer}>
            {profile.profilePic ? (
              <Image
                source={{ uri: profile.profilePic }}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {profile.username ? profile.username[0].toUpperCase() : '?'}
                </Text>
              </View>
            )}
          </View>

          {/* Stats : videos / followers / following */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{videos.length}</Text>
              <Text style={styles.statLabel}>Videos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.followers}</Text>
              <Text style={styles.statLabel}>Abonnes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{profile.following}</Text>
              <Text style={styles.statLabel}>Abonnements</Text>
            </View>
          </View>
        </View>

        {/* Nom et bio */}
        <View style={styles.bioSection}>
          <Text style={styles.displayName}>{profile.username}</Text>
          {profile.bio ? (
            <Text style={styles.bioText}>{profile.bio}</Text>
          ) : (
            <Text style={styles.bioEmpty}>Pas de bio. Appuie sur Modifier !</Text>
          )}
        </View>

        {/* Bouton Modifier le profil */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => {
            setEditUsername(profile.username);
            setEditBio(profile.bio);
            setEditProfilePic(profile.profilePic);
            setEditModalVisible(true);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.editBtnText}>Modifier le profil</Text>
        </TouchableOpacity>

        {/* Separateur */}
        <View style={styles.separator} />

        {/* Titre de la grille */}
        <View style={styles.gridHeader}>
          <Text style={styles.gridHeaderText}>
            🎬 Mes videos ({videos.length})
          </Text>
        </View>

        {/* Grille des videos */}
        {loadingVideos ? (
          <View style={styles.centered}>
            <ActivityIndicator size="small" color={COLORS.primary} />
          </View>
        ) : videos.length === 0 ? (
          <View style={styles.emptyVideos}>
            <Text style={styles.emptyVideosIcon}>📭</Text>
            <Text style={styles.emptyVideosText}>Aucune video publiee</Text>
            <Text style={styles.emptyVideosSub}>
              Publie ta premiere video depuis l'onglet +
            </Text>
          </View>
        ) : (
          <FlatList
            data={videos}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false} // ScrollView parent gere le scroll
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.gridContainer}
          />
        )}

        {/* Espace en bas */}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Modal de modification du profil ── */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContainer}>
            {/* Titre modal */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setEditModalVisible(false)}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Modifier le profil</Text>
              <TouchableOpacity
                onPress={handleSaveProfile}
                style={styles.modalSaveBtn}
                disabled={savingProfile}
              >
                {savingProfile ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  <Text style={styles.modalSaveText}>Enregistrer</Text>
                )}
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Champ : Nom d'utilisateur */}
              <Text style={styles.inputLabel}>Nom d'utilisateur</Text>
              <TextInput
                style={styles.input}
                value={editUsername}
                onChangeText={setEditUsername}
                placeholder="Ton nom d'utilisateur"
                placeholderTextColor={COLORS.lightGray}
                autoCapitalize="none"
                maxLength={30}
              />

              {/* Champ : Bio */}
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.input, styles.inputMultiline]}
                value={editBio}
                onChangeText={setEditBio}
                placeholder="Parle de toi en quelques mots..."
                placeholderTextColor={COLORS.lightGray}
                multiline
                maxLength={150}
                numberOfLines={4}
              />
              <Text style={styles.charCount}>{editBio.length}/150</Text>

              {/* Champ : URL photo de profil */}
              <Text style={styles.inputLabel}>URL de la photo de profil</Text>
              <TextInput
                style={styles.input}
                value={editProfilePic}
                onChangeText={setEditProfilePic}
                placeholder="https://exemple.com/ma-photo.jpg"
                placeholderTextColor={COLORS.lightGray}
                autoCapitalize="none"
                keyboardType="url"
              />
              {editProfilePic ? (
                <View style={styles.previewContainer}>
                  <Text style={styles.previewLabel}>Apercu :</Text>
                  <Image
                    source={{ uri: editProfilePic }}
                    style={styles.previewImage}
                    resizeMode="cover"
                  />
                </View>
              ) : null}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },

  // ── Etats speciaux
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    padding: SPACING.lg,
  },
  loadingText: {
    color: COLORS.lightGray,
    marginTop: SPACING.sm,
    fontSize: FONTS.sizes.md,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.lg,
  },

  // ── Barre superieure
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  topBarUsername: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
  },
  logoutText: {
    color: COLORS.error,
    fontSize: FONTS.sizes.sm,
  },

  // ── En-tete profil
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  avatarContainer: {
    marginRight: SPACING.lg,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.darkGray,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: 'bold',
  },
  statsRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
  },
  statLabel: {
    color: COLORS.lightGray,
    fontSize: FONTS.sizes.xs,
    marginTop: 2,
  },

  // ── Bio
  bioSection: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  displayName: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bioText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    lineHeight: 20,
  },
  bioEmpty: {
    color: COLORS.lightGray,
    fontSize: FONTS.sizes.md,
    fontStyle: 'italic',
  },

  // ── Bouton modifier
  editBtn: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    backgroundColor: COLORS.darkGray,
  },
  editBtnText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },

  // ── Separateur
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.sm,
  },

  // ── Grille videos
  gridHeader: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  gridHeaderText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  gridContainer: {
    paddingHorizontal: 1,
  },
  gridRow: {
    gap: 2,
    marginBottom: 2,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    backgroundColor: COLORS.darkGray,
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.darkGray,
  },
  gridPlaceholderIcon: {
    fontSize: 28,
  },
  gridLikes: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  gridLikesText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.xs,
  },

  // ── Etat vide videos
  emptyVideos: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  emptyVideosIcon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyVideosText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  emptyVideosSub: {
    color: COLORS.lightGray,
    fontSize: FONTS.sizes.md,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },

  // ── Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.darkGray,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
  },
  modalCancelBtn: {
    padding: SPACING.xs,
  },
  modalCancelText: {
    color: COLORS.lightGray,
    fontSize: FONTS.sizes.md,
  },
  modalSaveBtn: {
    padding: SPACING.xs,
    minWidth: 80,
    alignItems: 'flex-end',
  },
  modalSaveText: {
    color: COLORS.primary,
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: SPACING.md,
  },

  // ── Inputs
  inputLabel: {
    color: COLORS.lightGray,
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
    marginTop: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.black,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  inputMultiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  charCount: {
    color: COLORS.lightGray,
    fontSize: FONTS.sizes.xs,
    textAlign: 'right',
    marginTop: 4,
  },

  // ── Apercu photo
  previewContainer: {
    marginTop: SPACING.sm,
    alignItems: 'center',
  },
  previewLabel: {
    color: COLORS.lightGray,
    fontSize: FONTS.sizes.sm,
    marginBottom: SPACING.xs,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
});

export default ProfileScreen;

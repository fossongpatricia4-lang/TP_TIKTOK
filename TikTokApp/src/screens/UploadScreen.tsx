/**
 * TikTok Clone — UploadScreen.tsx
 * Écran d'upload de vidéos vers Cloudinary et Firestore
 * Développé par Dev 4
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { auth, db } from '../config/firebaseconfig';
import { CLOUDINARY_CONFIG } from '../config/cloudinaryConfig';
import { COLORS } from '../styles/theme';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

interface SelectedVideo {
  uri: string;
  fileName: string;
  type: string;
  size: number;
}

const UploadScreen = () => {
  const [selectedVideo, setSelectedVideo] = useState<SelectedVideo | null>(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  /**
   * Sélectionner une vidéo dans la galerie
   */
  const selectVideo = async () => {
    try {
      if (!launchImageLibrary) {
        throw new Error('Image picker non disponible');
      }

      launchImageLibrary(
        {
          mediaType: 'video',
          quality: 1,
        },
        (response) => {
          try {
            if (response.didCancel) {
              console.log('Sélection annulée');
            } else if (response.errorCode) {
              Alert.alert('Erreur', `Erreur lors de la sélection: ${response.errorMessage}`);
            } else if (response.assets && response.assets[0]) {
              const asset = response.assets[0];
              const uri = asset.uri || asset.path;
              
              if (!uri) {
                Alert.alert('Erreur', 'Impossible de récupérer le chemin du fichier');
                return;
              }

              setSelectedVideo({
                uri,
                fileName: asset.fileName || asset.filename || 'video.mp4',
                type: asset.type || 'video/mp4',
                size: asset.fileSize || 0,
              });
            }
          } catch (err) {
            console.error('Erreur dans le callback:', err);
            Alert.alert('Erreur', 'Erreur lors du traitement du fichier');
          }
        }
      );
    } catch (error) {
      console.error('Erreur selectVideo:', error);
      Alert.alert('Erreur', `Impossible d'ouvrir la galerie: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  /**
   * Uploader la vidéo vers Cloudinary (unsigned upload)
   */
  const uploadToCloudinary = async (): Promise<string | null> => {
    if (!selectedVideo) return null;

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: selectedVideo.uri,
        type: selectedVideo.type,
        name: selectedVideo.fileName,
      } as any);
      formData.append('upload_preset', CLOUDINARY_CONFIG.videoUploadPreset);

      setUploadProgress(30);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/video/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      setUploadProgress(70);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      setUploadProgress(100);

      return data.secure_url; // Retourner l'URL de la vidéo
    } catch (error) {
      console.error('Erreur lors de l\'upload Cloudinary:', error);
      throw error;
    }
  };

  /**
   * Sauvegarder la vidéo dans Firestore
   */
  const saveVideoToFirestore = async (videoUrl: string): Promise<void> => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('Utilisateur non authentifié');
    }

    try {
      await addDoc(collection(db, 'videos'), {
        userId: currentUser.uid,
        description,
        videoUrl,
        thumbnail: '', // Peut être rempli automatiquement par Cloudinary
        likes: 0,
        comments: 0,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde dans Firestore:', error);
      throw error;
    }
  };

  /**
   * Gérer l'upload complet
   */
  const handleUpload = async () => {
    if (!selectedVideo) {
      Alert.alert('Erreur', 'Veuillez sélectionner une vidéo');
      return;
    }

    if (!auth.currentUser) {
      Alert.alert('Erreur', 'Vous devez être connecté pour uploader');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // 1. Upload vers Cloudinary
      const videoUrl = await uploadToCloudinary();
      if (!videoUrl) throw new Error('Échec de l\'upload Cloudinary');

      // 2. Sauvegarder dans Firestore
      await saveVideoToFirestore(videoUrl);

      // Succès
      Alert.alert('Succès', 'Vidéo uploadée avec succès!');
      setSelectedVideo(null);
      setDescription('');
      setUploadProgress(0);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
      Alert.alert('Erreur', `Échec de l'upload: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📤 Publier une vidéo</Text>
      </View>

      {/* Section de sélection */}
      {!selectedVideo ? (
        <TouchableOpacity
          style={styles.selectButton}
          onPress={selectVideo}
          disabled={uploading}
        >
          <Text style={styles.selectButtonText}>Choisir une vidéo</Text>
          <Text style={styles.selectButtonSub}>Appuyez pour sélectionner une vidéo depuis votre galerie</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.selectedContainer}>
          <View style={styles.videoInfo}>
            <Text style={styles.label}>Fichier sélectionné:</Text>
            <Text style={styles.fileName}>{selectedVideo.fileName}</Text>
            <Text style={styles.fileSize}>
              Taille: {(selectedVideo.size / 1024 / 1024).toFixed(2)} MB
            </Text>
          </View>

          {/* Champ de description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Décrivez votre vidéo..."
              placeholderTextColor="#666"
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={150}
              editable={!uploading}
            />
            <Text style={styles.charCount}>{description.length}/150</Text>
          </View>

          {/* Barre de progression */}
          {uploading && uploadProgress > 0 && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>Upload en cours... {uploadProgress}%</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${uploadProgress}%` },
                  ]}
                />
              </View>
            </View>
          )}

          {/* Boutons d'action */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setSelectedVideo(null);
                setDescription('');
              }}
              disabled={uploading}
            >
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.uploadButton, uploading && styles.disabledButton]}
              onPress={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.uploadButtonText}>Publier</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Info utile */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>💡 Conseils</Text>
        <Text style={styles.infoText}>• Vidéos recommandées: moins de 30 secondes</Text>
        <Text style={styles.infoText}>• Format: MP4, MOV</Text>
        <Text style={styles.infoText}>• Taille maximale: 500 MB</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 24,
    paddingTop: 20,
  },
  title: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
  selectButton: {
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#FF3366',
    borderRadius: 12,
    padding: 32,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectButtonText: {
    color: '#FF3366',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  selectButtonSub: {
    color: COLORS.lightGray,
    fontSize: 14,
    textAlign: 'center',
  },
  selectedContainer: {
    marginVertical: 20,
  },
  videoInfo: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF3366',
  },
  label: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  fileName: {
    color: COLORS.white,
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '500',
  },
  fileSize: {
    color: COLORS.lightGray,
    fontSize: 12,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionInput: {
    backgroundColor: '#1a1a1a',
    color: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    color: COLORS.lightGray,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  progressContainer: {
    marginVertical: 20,
  },
  progressText: {
    color: COLORS.white,
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    backgroundColor: '#1a1a1a',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#FF3366',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#333',
  },
  uploadButton: {
    backgroundColor: '#FF3366',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  infoTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoText: {
    color: COLORS.lightGray,
    fontSize: 13,
    marginBottom: 6,
    lineHeight: 18,
  },
});

export default UploadScreen;

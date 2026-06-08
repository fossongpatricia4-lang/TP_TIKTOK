import { db } from '../firebaseConfig'; // Ajustez le chemin vers votre config Firebase
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  increment, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * 1. POST : Ajouter un commentaire sur une vidéo spécifique
 * @param {string} videoId - L'ID de la vidéo commentée
 * @param {object} userData - Données de l'utilisateur qui commente ({ userId, username, profilePic })
 * @param {string} text - Le contenu textuel du commentaire
 */
export const addComment = async (videoId, userData, text) => {
  if (!text.trim()) return;

  try {
    // A. Référence vers la sous-collection "comments" à l'intérieur de la vidéo
    const commentsRef = collection(db, "videos", videoId, "comments");

    // B. Requête POST (Insertion du document)
    const newCommentDoc = await addDoc(commentsRef, {
      userId: userData.userId,
      username: userData.username,
      profilePic: userData.profilePic, // URL provenant de Cloudinary
      text: text,
      createdAt: serverTimestamp(),
      likesCount: 0
    });

    // C. Dénormalisation : On incrémente le compteur global "commentsCount" sur le document de la vidéo
    const videoRef = doc(db, "videos", videoId);
    await updateDoc(videoRef, {
      commentsCount: increment(1) // Fonction native de Firebase très sécurisée pour les compteurs
    });

    console.log("Commentaire ajouté avec succès, ID:", newCommentDoc.id);
    return newCommentDoc.id;
  } catch (error) {
    console.error("Erreur lors de l'ajout du commentaire (POST) :", error);
    throw error;
  }
};

/**
 * 2. GET : Récupérer tous les commentaires d'une vidéo spécifique (Du plus récent au plus ancien)
 * @param {string} videoId - L'ID de la vidéo
 * @returns {Promise<Array>} - Liste des commentaires formatés
 */
export const getCommentsByVideo = async (videoId) => {
  try {
    const commentsRef = collection(db, "videos", videoId, "comments");
    
    // Organisation de la requête GET triée par date de création
    const q = query(commentsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const comments = [];
    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return comments;
  } catch (error) {
    console.error("Erreur lors de la récupération des commentaires (GET) :", error);
    throw error;
  }
};


import { doc, setDoc, deleteDoc } from 'firebase/firestore';

/**
 * 1. POST : Liker une vidéo spécifique
 * @param {string} videoId - L'ID de la vidéo ciblée
 * @param {string} userId - L'ID de l'utilisateur qui clique sur "Like"
 */
export const likeVideo = async (videoId, userId) => {
  try {
    // A. Référence unique basée sur l'ID de l'utilisateur : /videos/{videoId}/likes/{userId}
    const likeRef = doc(db, "videos", videoId, "likes", userId);

    // B. Requête POST (Insertion/Mise à jour forcée)
    await setDoc(likeRef, {
      likedAt: serverTimestamp()
    });

    // C. Incrémentation du compteur global "likesCount" sur la vidéo
    const videoRef = doc(db, "videos", videoId);
    await updateDoc(videoRef, {
      likesCount: increment(1)
    });

    console.log(`La vidéo ${videoId} a été likée par l'utilisateur ${userId}`);
  } catch (error) {
    console.error("Erreur lors de l'ajout du Like (POST) :", error);
    throw error;
  }
};

/**
 * 2. DELETE : Retirer son Like d'une vidéo spécifique (Dislike)
 * @param {string} videoId - L'ID de la vidéo ciblée
 * @param {string} userId - L'ID de l'utilisateur qui retire son Like
 */
export const unlikeVideo = async (videoId, userId) => {
  try {
    // A. Cibler précisément le document du Like
    const likeRef = doc(db, "videos", videoId, "likes", userId);

    // B. Requête DELETE (Suppression pure du document)
    await deleteDoc(likeRef);

    // C. Décrémentation du compteur global "likesCount" sur la vidéo (-1)
    const videoRef = doc(db, "videos", videoId);
    await updateDoc(videoRef, {
      likesCount: increment(-1)
    });

    console.log(`Le Like de l'utilisateur ${userId} a été retiré de la vidéo ${videoId}`);
  } catch (error) {
    console.error("Erreur lors de la suppression du Like (DELETE) :", error);
    throw error;
  }
};
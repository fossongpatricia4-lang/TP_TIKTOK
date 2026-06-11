# Guide de Migration : `expo-av` ➔ `react-native-video`
*Auteur : Charles*

Ce document détaille la migration de notre lecteur vidéo de `expo-av` vers `react-native-video` (v6+) réalisée sur le projet TikTokClone. Il inclut la procédure pour synchroniser vos environnements locaux sans erreurs de build et le prompt à fournir à vos assistants de code respectifs.

---

## 1. Pourquoi cette migration ?
- `expo-av` est plus lourd et parfois instable sur les setups purs React Native CLI (sans Expo complet).
- `react-native-video` est la bibliothèque communautaire standard, optimisée pour React Native CLI, offrant un contrôle déclaratif natif plus performant et plus simple (pas besoin d'appels impératifs pour lire/mettre en pause).

---

## 2. Procédure pour l'Équipe (À faire après avoir récupéré les changements)

> [!IMPORTANT]
> Ne lancez pas l'application directement après avoir fait un `git pull` de ces modifications, sous peine de voir l'application planter suite à un manque de dépendances natives.

Exécutez les commandes suivantes dans votre terminal à la racine du sous-dossier `TikTokApp` :

```bash
# 1. Aller dans le dossier de l'application
cd TikTokApp

# 2. Installer les dépendances (désinstalle expo-av et installe react-native-video)
npm install

# 3. Mettre à jour les pods natifs iOS (requis uniquement si vous êtes sur macOS et testez sur iOS)
cd ios && pod install && cd ..

# 4. Nettoyer le cache Metro et recompiler l'application
npm start -- --reset-cache
npm run android   # Pour Android
# ou
npm run ios       # Pour iOS (macOS uniquement)
```

---

## 3. Détails des modifications apportées

### Dépendances (`package.json`)
**Supprimées :**
- `"expo-av": "~14.0.5"` → remplacé par `react-native-video`
- `"expo": "^56.0.9"` → conflits Gradle autolinking (setup pur React Native CLI)
- `"expo-asset": "^56.0.16"` → dépendance inutilisée

**Ajoutées :**
- `"react-native-video": "^6.0.0"` → nouveau lecteur vidéo
- `"expo-font": "~13.3.1"` → requis par `@expo/vector-icons` (Ionicons)
- `"react-native-gesture-handler": "^2.24.0"` → requis par `@react-navigation/stack`
- `"react-native-screens": "^4.4.0"` → requis par `@react-navigation/native`

### Composant de lecture vidéo (`src/components/VideoCard.tsx`)
1. **Contrôle déclaratif** : Remplacement des appels impératifs `playAsync()` et `pauseAsync()` par l'utilisation de la prop `paused={!isActive || !isPlaying}` directement sur le composant `<Video>`.
2. **Propriétés de lecture** :
   - `isLooping` ➔ `repeat={true}`.
   - `onPlaybackStatusUpdate` ➔ `onBuffer={({ isBuffering }) => setIsLoading(isBuffering)}`.
3. **Optimisation** : Le hook `useEffect` ne synchronise plus l'état de la vidéo mais se contente de réinitialiser l'état local de lecture `isPlaying` lorsque l'utilisateur scrolle vers une autre vidéo.

---

## 4. Prompt de Synchronisation pour vos Assistants de Code (IA)

Si vous utilisez des assistants de code IA pour vos propres fonctionnalités (Auth, Navigation, Profil, Upload, etc.), **donnez-leur ce prompt exact au début de votre session** pour qu'ils soient au courant de la migration sans corrompre le code :

```markdown
Tu es un assistant de code travaillant sur un projet collaboratif de clone TikTok sous React Native CLI. 
Le projet vient d'effectuer une migration de la bibliothèque de lecture vidéo de "expo-av" vers "react-native-video".

⚠️ RÈGLE DE SÉCURITÉ IMPORTANTE (ÉVITER LES CONFLITS GIT) :
- Si la tâche sur laquelle tu travailles ne concerne pas directement le fil de vidéos (c'est-à-dire les fichiers `VideoCard.tsx` et `HomeScreen.tsx`), tu dois IMPÉRATIVEMENT ignorer le code de ces fichiers et ne pas tenter de les éditer pour éviter de créer des conflits de fusion (merge conflicts) avec les autres développeurs.
- En revanche, tu dois TOUJOURS t'assurer que le fichier `package.json` de l'utilisateur contient "react-native-video" et que "expo-av", "expo", et "expo-asset" ont bien été retirés pour rester synchronisé avec les dépendances globales de l'équipe et éviter les conflits d'autolinking natif.

Détails de la migration (pour info uniquement) :
- Le composant <Video> est désormais importé de 'react-native-video'.
- Le contrôle de lecture est déclaratif : <Video paused={!isActive || !isPlaying} ... />
- Les propriétés de boucle et de buffering sont : repeat={true} et onBuffer={({ isBuffering }) => setIsLoading(isBuffering)}.
```

/**
 * TikTok Clone — AppNavigator.tsx
 * Navigation principale (utilisateur connecté)
 * Dev 7 : structure et routes
 * Dev 8 : icônes et styles appliqués depuis theme.ts
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/Ionicons';

// Theme
import { COLORS, DIMENSIONS, SPACING, ICONS } from '../styles/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import UploadScreen from '../screens/UploadScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CommentsScreen from '../screens/CommentsScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="Feed" component={HomeScreen} />
    <HomeStack.Screen name="Comments" component={CommentsScreen} />
  </HomeStack.Navigator>
);

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.black,
          borderTopColor: COLORS.border,
          height: DIMENSIONS.tabBarHeight,
          paddingBottom: SPACING.sm,
        },
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: COLORS.lightGray,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? ICONS.home : ICONS.homeOutline;
          } else if (route.name === 'Upload') {
            iconName = focused ? ICONS.upload : ICONS.uploadOutline;
          } else {
            iconName = focused ? ICONS.profile : ICONS.profileOutline;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ tabBarLabel: 'Accueil' }}
      />
      <Tab.Screen
        name="Upload"
        component={UploadScreen}
        options={{ tabBarLabel: 'Publier' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
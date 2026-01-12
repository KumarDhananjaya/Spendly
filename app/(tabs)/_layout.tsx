import { Tabs } from 'expo-router';
import { Home } from 'lucide-react-native';
import React from 'react';
import { theme } from '../../src/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(18, 18, 18, 0.8)',
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          position: 'absolute',
          borderTopWidth: 1,
          elevation: 0,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

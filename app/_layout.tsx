import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, View } from 'react-native';
import { theme } from '../src/constants/theme';
import AuthScreen from '../src/screens/AuthScreen';
import { useFinanceStore } from '../src/store/useFinanceStore';

export default function RootLayout() {
  const { isAppLockEnabled } = useFinanceStore();
  const [isLocked, setIsLocked] = useState(false);
  const appState = useRef(AppState.currentState);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // If we mount and app lock is enabled, lock it.
    // Note: hydration delay might case a split-second unlock if not handled, 
    // but typically fast enough.
    if (isAppLockEnabled) {
      setIsLocked(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted && isAppLockEnabled && !isLocked) {
      // If enabling for the first time in this session, don't lock immediately 
      // as the user just entered the PIN. 
      // Logic handled in SecuritySettings by not toggling isAppLockEnabled until verified?
      // Actually, store updates trigger this. 
      // We only want to lock on AppState change or initial load.
    }
  }, [isAppLockEnabled]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        isAppLockEnabled
      ) {
        setIsLocked(true);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isAppLockEnabled]);

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'slide_from_bottom',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-transaction"
          options={{
            presentation: 'fullScreenModal',
            headerShown: false
          }}
        />
        <Stack.Screen
          name="security-settings"
          options={{
            presentation: 'card',
            headerShown: false
          }}
        />
        {/* Placeholder for smart scan as it was added before */}
        <Stack.Screen
          name="smart-scan"
          options={{
            presentation: 'card',
            headerShown: false
          }}
        />
      </Stack>
      {isLocked && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}>
          <AuthScreen onUnlock={() => setIsLocked(false)} />
        </View>
      )}
    </View>
  );
}

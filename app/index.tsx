import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Redirect, useRootNavigationState } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

export default function Index() {
  const { user } = useUser();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    checkNavLoaded();
  }, [rootNavigationState]);

  const checkNavLoaded = () => {
    if (!rootNavigationState?.key) {
      return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {user ? <Redirect href="/(tabs)/home" /> : <Redirect href="/login" />}
    </View>
  );
}
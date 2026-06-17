import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { AuthProvider } from '../firebase/authContext';

// Root layout required by expo-router. It must render a Slot (or a navigator)
// on the first render so routing is considered "ready".
export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.container}>
        <Slot />
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

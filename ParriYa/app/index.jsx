import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    async function init() {
      try {
        const activeUser = await AsyncStorage.getItem('activeUser');
        if (activeUser) {
          router.replace('/(tabs)');
        } else {
          router.replace('/login');
        }
      } catch (e) {
        router.replace('/login');
      }
    }
    init();
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#E76F41" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});

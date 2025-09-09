import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Carousel from '../../../components/carousel';

export default function BannerCarousel({ banners, loading, error }) {
  if (loading) return <ActivityIndicator size="large" color="#001950" />;
  if (error) return <Text style={styles.error}>{error}</Text>;
  if (!banners || banners.length === 0) return null;
  return (
    <View style={styles.container}>
      <Carousel banners={banners} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 160,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 8,
  },
});

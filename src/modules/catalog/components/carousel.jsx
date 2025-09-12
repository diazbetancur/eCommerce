import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Carousel({ banners }) {
  return (
    <View style={styles.carousel}>
      {banners.map((banner) => (
        <View key={banner.id} style={styles.banner}>
          <Text>{banner.image}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 160,
  },
  banner: {
    backgroundColor: '#eee',
    margin: 8,
    padding: 16,
    borderRadius: 8,
  },
});

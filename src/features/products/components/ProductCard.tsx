import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

type ProductCardProps = {
  name: string;
  price: number;
  image: string;
  onPress?: () => void;
};

export default function ProductCard({ name, price, image, onPress }: ProductCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>${price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    flex: 1,
    margin: 8,
    maxWidth: '100%'
  },
  image: {
    width: '100%',
    height: 120
  },
  infoContainer: {
    padding: 10
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6
  },
  price: {
    fontSize: 14,
    color: '#555'
  }
});

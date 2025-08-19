import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function ProductCard({ product, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    margin: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  price: {
    color: '#3B82F6',
    marginTop: 4,
  },
});

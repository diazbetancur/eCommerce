import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function ProductList({ products, onSelectProduct }) {
  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id.toString()}
      numColumns={2}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => onSelectProduct(item)}>
          <Image source={{ uri: item.image }} style={styles.img} />
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.desc}>{item.description?.slice(0, 50)}{item.description?.length > 50 ? '...' : ''}</Text>
          <Text style={styles.price}>${item.price}</Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 8,
    padding: 8,
    alignItems: 'center',
    elevation: 2,
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#eee',
    marginBottom: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
    color: '#222',
    textAlign: 'center',
  },
  desc: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
    textAlign: 'center',
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#001950',
    marginBottom: 2,
  },
  list: {
    paddingBottom: 16,
  },
});

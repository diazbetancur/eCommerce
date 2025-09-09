import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CategoryList({ categories, onSelectCategory, selectedCategory, loading, error }) {
  if (loading) return <Text style={styles.loading}>Cargando...</Text>;
  if (error) return <Text style={styles.error}>{error}</Text>;
  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, selectedCategory === item.id && styles.cardActive]} onPress={() => onSelectCategory(item.id)}>
            <Image source={{ uri: item.icon }} style={styles.img} resizeMode="contain" />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 8,
  },
  card: {
    alignItems: 'center',
    marginRight: 12,
    width: 80,
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  cardActive: {
    backgroundColor: '#001950',
  },
  img: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#eee',
    marginBottom: 4,
  },
  name: {
    fontSize: 13,
    textAlign: 'center',
    color: '#222',
  },
  loading: {
    textAlign: 'center',
    color: '#001950',
  },
  error: {
    textAlign: 'center',
    color: 'red',
  },
});

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const categories = [
  { id: 1, name: 'Electrónica' },
  { id: 2, name: 'Ropa' },
  { id: 3, name: 'Hogar' },
];

export default function CategoriesList({ onCategorySelected }) {
  return (
    <View style={styles.container}>
      {categories.map((cat) => (
        <TouchableOpacity key={cat.id} onPress={() => onCategorySelected(cat.id)} style={styles.button}>
          <Text style={styles.text}>{cat.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 8,
  },
  text: {
    fontWeight: 'bold',
  },
});

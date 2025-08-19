import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  name: string;
  image?: string;
  selected?: boolean;
  onPress: () => void;
}

const fallbackImage = require('../../../assets/images/defualt-category.png');

const CategoryItem = ({ name, image, selected, onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image
        source={image ? { uri: image } : fallbackImage}
        style={[styles.image, selected && styles.selectedImage]}
        resizeMode="cover"
      />
      <Text style={[styles.text, selected && styles.selectedText]} numberOfLines={1}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 70
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#ccc'
  },
  selectedImage: {
    borderColor: '#007bff',
    borderWidth: 2
  },
  text: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
    color: '#333'
  },
  selectedText: {
    color: '#007bff',
    fontWeight: 'bold'
  }
});

export default CategoryItem;

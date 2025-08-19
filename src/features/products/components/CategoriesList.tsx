import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import Colors from '../../../assets/Colors';
import { useCategory } from '../hooks/useCategory';
import CategoryItem from './CategoryItem';

interface Props {
  onCategorySelected: (categoryId: string) => void;
}

const CategoriesList = ({ onCategorySelected }: Props) => {
  const { categories, loading } = useCategory();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.BLUE} />;
  }

  if (!categories || categories.length <= 1) {
    return null;
  }

  const handleSelect = (categoryId: string) => {
    if (categoryId === selectedCategoryId) {
      setSelectedCategoryId(null);
      onCategorySelected(null);
    } else {
      setSelectedCategoryId(categoryId);
      onCategorySelected(categoryId);
    }
  };

  return (
    <View style={styles.wrapper}>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CategoryItem
            name={item.name}
            image={item.image}
            selected={item.id === selectedCategoryId}
            onPress={() => handleSelect(item.id)}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10
  }
});

export default CategoriesList;

const MenuScreen = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <View style={styles.container}>
      {/* Filtros de categoría */}
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Lista de productos */}
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <RestaurantProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          />
        )}
        numColumns={2}
      />
    </View>
  );
};

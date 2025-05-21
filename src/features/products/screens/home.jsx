import React, { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import Colors from '../../../assets/Colors';
import Carousel from '../../../components/carousel';
import { useCart } from '../../../context/CartContext';
import useAuth from '../../../hooks/useAuth';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { useBanners } from '../hooks/useBanners';
import { useProducts } from '../hooks/useProducts';

export default function Home() {
  const { auth } = useAuth();
  const { products, loading, error } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { addToCart } = useCart();
  const [search, setSearch] = useState('');
  const { banners, loading: bannersLoading, error: bannerError } = useBanners();

  const handleAddToCart = (product, quantity) => {
    addToCart(product, quantity);
    setModalVisible(false);
  };

  const filteredProducts = products.filter((product) => {
    const term = search.toLowerCase();
    return (
      product.name.toLowerCase().includes(term) ||
      product.description?.toLowerCase().includes(term) ||
      product.category?.toLowerCase().includes(term)
    );
  });

  return (
    <View style={style.container}>
      {bannersLoading && <ActivityIndicator size="large" color={Colors.BLUE} />}
      {banners.length > 0 && (
        <View style={{ height: 160 }}>
          <Carousel banners={banners} />
        </View>
      )}
      <TextInput
        placeholder="Buscar productos..."
        value={search}
        onChangeText={setSearch}
        style={style.searchInput}
      />

      {/* <Carousel style={style.banner} banners={banners} /> */}
      {loading && <ActivityIndicator size="large" color={Colors.BLUE} />}
      {error && <Text style={style.error}>Error: {error}</Text>}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={style.productList}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <ProductCard
            name={item.name}
            price={item.price}
            image={item.imageUrl}
            onPress={() => {
              setSelectedProduct(item);
              setModalVisible(true);
            }}
          />
        )}
      />
      <ProductDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    width: '100%'
  },
  welcome: {
    color: Colors.BLUE,
    fontSize: 25,
    fontWeight: 'bold',
    paddingLeft: 25,
    paddingTop: 15
  },
  points: {
    color: Colors.BLUE,
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'left',
    paddingLeft: 25,
    paddingTop: 5
  },
  banner: {
    marginTop: 20
  },
  productList: {
    paddingHorizontal: 10,
    paddingBottom: 20
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20
  },
  searchInput: {
    height: 40,
    borderColor: Colors.GRAY,
    borderWidth: 1,
    borderRadius: 8,
    margin: 10,
    paddingHorizontal: 10
  }
});

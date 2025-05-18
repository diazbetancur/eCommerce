import { View, StyleSheet, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import Colors from '../../../assets/Colors';
import useAuth from '../../../hooks/useAuth';
import InfinitePoints from '../../../components/InfinitePoints';
import Carousel from '../../../components/carousel';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import { useCart } from '../../../context/CartContext';

export default function Home() {
  const { auth } = useAuth();
  const { products, loading, error } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (product, quantity) => {
    addToCart(product, quantity);
    setModalVisible(false);
  };

  return (
    <View style={style.container}>
      {/* <Carousel style={style.banner} banners={banners} /> */}
      {loading && <ActivityIndicator size="large" color={Colors.BLUE} />}
      {error && <Text style={style.error}>Error: {error}</Text>}
      <FlatList
        data={products}
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
  }
});

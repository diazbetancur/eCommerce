import { useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../../assets/Colors';
import Carousel from '../../../components/carousel';
import { useCart } from '../../../core/context/CartContext';



import ProductDetailModal from '../components/ProductDetailModal';
import { useBanners } from '../hooks/useBanners';
import { useProducts } from '../hooks/useProducts';

// Filtros mock
const brands = ['Nike', 'Adidas', 'Samsung'];
const colors = ['Azul', 'Negro', 'Gris'];
const sizes = ['M', '42', ''];


export default function HomeScreen() {

  const { products, loading, error, filters, setFilters } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const { addToCart } = useCart();
  const { banners, loading: bannersLoading, error: bannerError } = useBanners();

  // Categorías y subcategorías
  const categories = [...new Set(products.map(p => p.category))];
  const subcategories = filters.category ? [...new Set(products.filter(p => p.category === filters.category).map(p => p.subcategory))].filter(Boolean) : [];

  const handleAddToCart = (product, quantity) => {
    addToCart(product, quantity);
    setModalVisible(false);
  };

  return (
    <View style={style.container}>
      {/* Buscador ovalado reducido con icono filtro al final */}
      <View style={style.searchContainerSmall}>
        <MaterialCommunityIcons name="magnify" size={22} color={Colors.GRAY} style={{ marginLeft: 10 }} />
        <TextInput
          placeholder="Buscar productos..."
          value={filters.search}
          onChangeText={text => setFilters(f => ({ ...f, search: text }))}
          style={style.searchInputFull}
          placeholderTextColor={Colors.GRAY}
        />
        <TouchableOpacity onPress={() => setFiltersExpanded(!filtersExpanded)} style={style.filterIconBtnSmall}>
          <MaterialCommunityIcons name="filter-variant" size={24} color="#222" />
        </TouchableOpacity>
      </View>
      {filtersExpanded && (
        <View style={style.filtersPanel}>
          {/* Filtros avanzados */}
          <View style={style.filtersRow}>
            <Text>Categoría:</Text>
            <FlatList
              horizontal
              data={categories}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <Text style={[style.filterBtn, filters.category === item && style.filterBtnActive]} onPress={() => setFilters(f => ({ ...f, category: item, subcategory: '' }))}>{item}</Text>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          {subcategories.length > 1 && (
            <View style={style.filtersRow}>
              <Text>Subcategoría:</Text>
              <FlatList
                horizontal
                data={subcategories}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <Text style={[style.filterBtn, filters.subcategory === item && style.filterBtnActive]} onPress={() => setFilters(f => ({ ...f, subcategory: item }))}>{item}</Text>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}
          <View style={style.filtersRow}>
            <Text>Marca:</Text>
            <FlatList
              horizontal
              data={brands}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <Text style={[style.filterBtn, filters.brand === item && style.filterBtnActive]} onPress={() => setFilters(f => ({ ...f, brand: item }))}>{item}</Text>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View style={style.filtersRow}>
            <Text>Color:</Text>
            <FlatList
              horizontal
              data={colors}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <Text style={[style.filterBtn, filters.color === item && style.filterBtnActive]} onPress={() => setFilters(f => ({ ...f, color: item }))}>{item}</Text>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View style={style.filtersRow}>
            <Text>Talla:</Text>
            <FlatList
              horizontal
              data={sizes}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <Text style={[style.filterBtn, filters.size === item && style.filterBtnActive]} onPress={() => setFilters(f => ({ ...f, size: item }))}>{item}</Text>
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
      )}
      {loading && <ActivityIndicator size="large" color={Colors.BLUE} />}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <TouchableOpacity style={style.productCard} onPress={() => { setSelectedProduct(item); setModalVisible(true); }}>
            <Image source={{ uri: item.image }} style={style.productImg} />
            <Text style={style.productName}>{item.name}</Text>
            <Text style={style.productDesc}>{item.description?.slice(0, 50)}{item.description?.length > 50 ? '...' : ''}</Text>
            <Text style={style.productPrice}>${item.price}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={style.productsList}
        ListHeaderComponent={(
          <>
            <View style={style.categoriesRow}>
              <FlatList
                horizontal
                data={categories}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <View style={style.categoryCard}>
                    <Image source={require('../../../assets/images/defualt-category.png')} style={style.categoryImg} />
                    <Text style={style.categoryName}>{item}</Text>
                  </View>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
            {bannersLoading && <ActivityIndicator size="large" color={Colors.BLUE} />}
            {banners.length > 0 && (
              <View style={style.bannerContainerNoShadow}>
                <Carousel banners={banners} />
              </View>
            )}
            {bannerError && <Text style={style.error}>{bannerError}</Text>}
          </>
        )}
      />
      <ProductDetailModal
        visible={modalVisible}
        product={selectedProduct}
        onClose={() => setModalVisible(false)}
        onAddToCart={handleAddToCart}
      />
      {error && <Text style={style.error}>{error}</Text>}
    </View>
  );
}

const style = StyleSheet.create({
  searchContainerSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 8,
    paddingHorizontal: 8,
    height: 40,
  },
  searchInputFull: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: 'transparent',
    color: Colors.DARK,
  },
  filterIconBtnSmall: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  bannerContainerNoShadow: {
    height: 160,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    marginVertical: 12,
    marginHorizontal: 8,
    paddingHorizontal: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderRadius: 24,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'transparent',
    color: Colors.DARK,
  },
  filterIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginHorizontal: 8,
  },
  filterIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e5e5',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    elevation: 1,
  },
  filterIconText: {
    marginLeft: 8,
    color: Colors.PRIMARY,
    fontWeight: 'bold',
    fontSize: 16,
  },
  filtersPanel: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    marginHorizontal: 8,
    padding: 8,
    marginBottom: 8,
    elevation: 1,
  },
  categoriesRow: {
    marginVertical: 8,
    marginHorizontal: 8,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 12,
    width: 80,
  },
  categoryImg: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#eee',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 13,
    textAlign: 'center',
    color: Colors.DARK,
  },
  bannerContainer: {
    height: 160,
    marginVertical: 8,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 8,
    padding: 8,
    alignItems: 'center',
    elevation: 2,
  },
  productImg: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#eee',
    marginBottom: 8,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
    color: Colors.DARK,
    textAlign: 'center',
  },
  productDesc: {
    fontSize: 13,
    color: Colors.GRAY,
    marginBottom: 4,
    textAlign: 'center',
  },
  productPrice: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.PRIMARY,
    marginBottom: 2,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  filterBtn: {
    marginHorizontal: 4,
    padding: 6,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  filterBtnActive: {
    backgroundColor: Colors.PRIMARY,
    color: '#fff',
  },
  searchInput: {
    marginVertical: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    backgroundColor: '#f9f9f9',
  },
  productsList: {
    paddingBottom: 16,
  },
  error: {
    color: Colors.RED,
    textAlign: 'center',
    marginVertical: 8,
  },
});

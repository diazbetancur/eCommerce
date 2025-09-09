import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { fetchCategories } from '../../../api/categoryService';
import Colors from '../../../assets/Colors';
import { useCart } from '../../../core/context/CartContext';
import BannerCarousel from '../components/BannerCarousel';
import ProductDetailModal from '../components/ProductDetailModal';
import { useBanners } from '../hooks/useBanners';
import { useProducts } from '../hooks/useProducts';

export default function HomeScreen() {
  const { products, loading, error, filters, setFilters } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const { addToCart } = useCart();
  const { banners, loading: bannersLoading, error: bannerError } = useBanners();
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  useEffect(() => {
    setCategoriesLoading(true);
    fetchCategories()
      .then(data => {
        setCategories(data);
        setCategoriesLoading(false);
      })
      .catch(err => {
        console.error(err);
        setCategoriesError('Error al cargar categorías');
        setCategoriesLoading(false);
      });
  }, []);

  // Generar filtros dinámicos
  const filterOptions = {};
  products.forEach(product => {
    Object.keys(product).forEach(key => {
      if (['category', 'subcategory', 'name', 'description', 'id', 'image', 'price'].includes(key)) return;
      if (!filterOptions[key]) filterOptions[key] = new Set();
      if (product[key]) filterOptions[key].add(product[key]);
    });
  });

  // Subcategorías basadas en la categoría seleccionada
  const subcategories = filters.category ? 
    [...new Set(products.filter(p => p.category === filters.category).map(p => p.subcategory))].filter(Boolean) : 
    [];

  const handleAddToCart = (product, quantity) => {
    addToCart(product, quantity);
    setModalVisible(false);
  };

  // Función para limpiar todos los filtros dinámicos
  const clearAllFilters = () => {
    const clearedFilters = { search: '', category: '', subcategory: '' };
    // Limpiar también los filtros dinámicos
    Object.keys(filterOptions).forEach(key => {
      clearedFilters[key] = '';
    });
    setFilters(clearedFilters);
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity 
      style={style.categoryCard} 
      onPress={() => setFilters(f => ({ ...f, category: item.name, subcategory: '' }))}
    >
      <Image source={{ uri: item.icon }} style={style.categoryImg} resizeMode="contain" />
      <Text style={style.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderFilterButton = (item, filterKey) => (
    <TouchableOpacity
      key={item}
      style={[style.filterBtn, filters[filterKey] === item && style.filterBtnActive]}
      onPress={() => setFilters(f => ({ ...f, [filterKey]: item }))}
    >
      <Text style={[style.filterBtnText, filters[filterKey] === item && style.filterBtnActiveText]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={style.productCard} 
      onPress={() => { 
        setSelectedProduct(item); 
        setModalVisible(true); 
      }}
    >
      <Image source={{ uri: item.image }} style={style.productImg} />
      <Text style={style.productName} numberOfLines={2}>{item.name}</Text>
      <Text style={style.productDesc} numberOfLines={2}>
        {item.description?.slice(0, 50)}{item.description?.length > 50 ? '...' : ''}
      </Text>
      <Text style={style.productPrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  const renderListHeader = () => (
    <>
      {/* Categorías */}
      <View style={style.categoriesRow}>
        {categoriesLoading ? (
          <ActivityIndicator size="small" color={Colors.BLUE} />
        ) : categoriesError ? (
          <Text style={style.error}>{categoriesError}</Text>
        ) : (
          <FlatList
            horizontal
            data={categories}
            keyExtractor={item => item.id.toString()}
            renderItem={renderCategoryItem}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>

      {/* Carrusel de banners */}
      {!bannersLoading && (
        <BannerCarousel banners={banners} loading={bannersLoading} error={bannerError} />
      )}
      {bannersLoading && <ActivityIndicator size="large" color={Colors.BLUE} />}
    </>
  );

  return (
    <View style={style.container}>
      {/* Barra de búsqueda */}
      <View style={style.searchContainerSmall}>
        <MaterialCommunityIcons name="magnify" size={22} color={Colors.GRAY} style={{ marginLeft: 10 }} />
        <TextInput
          placeholder="Buscar productos..."
          value={filters.search}
          onChangeText={text => setFilters(f => ({ ...f, search: text }))}
          style={style.searchInputFull}
          placeholderTextColor={Colors.GRAY}
        />
        <TouchableOpacity 
          onPress={() => setFiltersExpanded(!filtersExpanded)} 
          style={style.filterIconBtnSmall}
        >
          <MaterialCommunityIcons 
            name={filtersExpanded ? "filter-minus" : "filter-variant"} 
            size={24} 
            color="#222" 
          />
        </TouchableOpacity>
      </View>

      {/* Panel de filtros expandible */}
      {filtersExpanded && (
        <View style={style.filtersPanel}>
          {/* Filtro de categorías */}
          <View style={style.filtersRow}>
            <Text style={style.filterLabel}>Categoría:</Text>
            <View style={style.filterButtonsContainer}>
              {categoriesLoading ? (
                <ActivityIndicator size="small" color={Colors.BLUE} />
              ) : categoriesError ? (
                <Text style={style.error}>{categoriesError}</Text>
              ) : (
                <FlatList
                  horizontal
                  data={categories}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => renderFilterButton(item.name, 'category')}
                  showsHorizontalScrollIndicator={false}
                />
              )}
            </View>
            <TouchableOpacity 
              style={style.clearBtn} 
              onPress={() => setFilters(f => ({ ...f, category: '', subcategory: '' }))}
            >
              <MaterialCommunityIcons name="close-circle-outline" size={20} color={Colors.RED} />
              <Text style={style.clearBtnText}>Limpiar</Text>
            </TouchableOpacity>
          </View>

          {/* Filtro de subcategorías */}
          {subcategories.length > 1 && (
            <View style={style.filtersRow}>
              <Text style={style.filterLabel}>Subcategoría:</Text>
              <View style={style.filterButtonsContainer}>
                <FlatList
                  horizontal
                  data={subcategories}
                  keyExtractor={item => item}
                  renderItem={({ item }) => renderFilterButton(item, 'subcategory')}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
              <TouchableOpacity 
                style={style.clearBtn} 
                onPress={() => setFilters(f => ({ ...f, subcategory: '' }))}
              >
                <MaterialCommunityIcons name="close-circle-outline" size={20} color={Colors.RED} />
                <Text style={style.clearBtnText}>Limpiar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Filtros dinámicos */}
          {Object.entries(filterOptions)
            .filter(([_, values]) => values.size > 0)
            .map(([key, values]) => (
              <View style={style.filtersRow} key={key}>
                <Text style={style.filterLabel}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </Text>
                <View style={style.filterButtonsContainer}>
                  <FlatList
                    horizontal
                    data={Array.from(values)}
                    keyExtractor={item => item}
                    renderItem={({ item }) => renderFilterButton(item, key)}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
                <TouchableOpacity 
                  style={style.clearBtn} 
                  onPress={() => setFilters(f => ({ ...f, [key]: '' }))}
                >
                  <MaterialCommunityIcons name="close-circle-outline" size={20} color={Colors.RED} />
                  <Text style={style.clearBtnText}>Limpiar</Text>
                </TouchableOpacity>
              </View>
            ))
          }

          {/* Botón para limpiar todos los filtros */}
          {(Object.entries(filterOptions).filter(([_, values]) => values.size > 0).length > 0 || filters.category || filters.search) && (
            <TouchableOpacity style={style.clearAllBtn} onPress={clearAllFilters}>
              <MaterialCommunityIcons name="broom" size={20} color={Colors.BLUE} />
              <Text style={style.clearAllBtnText}>Limpiar todos los filtros</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Lista de productos */}
      {loading ? (
        <View style={style.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.BLUE} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          renderItem={renderProductItem}
          contentContainerStyle={style.productsList}
          ListHeaderComponent={renderListHeader}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal de detalle del producto */}
      <ProductDetailModal
        visible={modalVisible}
        product={selectedProduct}
        onClose={() => setModalVisible(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Mensaje de error */}
      {error && <Text style={style.error}>{error}</Text>}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainerSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 16,
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
  filtersPanel: {
    backgroundColor: '#f9f9f9',
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontWeight: 'bold',
    marginRight: 8,
    color: Colors.DARK,
    minWidth: 80,
  },
  filterButtonsContainer: {
    flex: 1,
  },
  filterBtn: {
    marginHorizontal: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#eee',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterBtnActive: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  filterBtnText: {
    fontSize: 13,
    color: Colors.DARK,
  },
  filterBtnActiveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  clearBtnText: {
    color: Colors.RED,
    fontSize: 12,
    marginLeft: 2,
  },
  clearAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 12,
    backgroundColor: '#e5f0ff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  clearAllBtnText: {
    color: Colors.BLUE,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  categoriesRow: {
    marginVertical: 12,
    marginHorizontal: 16,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  categoryImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eee',
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 12,
    textAlign: 'center',
    color: Colors.DARK,
    fontWeight: '500',
  },
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 8,
    padding: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxWidth: '46%',
  },
  productImg: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#eee',
    marginBottom: 8,
  },
  productName: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    color: Colors.DARK,
    textAlign: 'center',
  },
  productDesc: {
    fontSize: 12,
    color: Colors.GRAY,
    marginBottom: 6,
    textAlign: 'center',
  },
  productPrice: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.PRIMARY,
    marginTop: 4,
  },
  productsList: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: Colors.RED,
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 14,
  },
});
import { useEffect, useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Carousel from '../../../components/carousel';

export default function ProductDetailModal({ visible, product, onClose, onAddToCart }) {
  const [descExpanded, setDescExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const maxDescLines = 2;
  const screenWidth = Dimensions.get('window').width;
  const imageHeight = Math.max(screenWidth * 0.3, Math.min(screenWidth * 0.4, 300));

  useEffect(() => {
    if (visible) {
      setQuantity(1);
    }
  }, [visible, product]);

  if (!product) return null;
  const showExpand = product.description && product.description.split('\n').length > maxDescLines;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.circleBtn} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#222" />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.circleBtn}>
              <MaterialCommunityIcons name="heart-outline" size={24} color="#222" />
            </TouchableOpacity>
          </View>
          <Carousel
            banners={product.productImages && product.productImages.length > 0
              ? product.productImages.map(img => ({ imageUrl: img.imageUrl }))
              : [{ imageUrl: require('../../../assets/images/defualt-category.png') }]
            }
            style={[styles.productImg, { width: screenWidth - 32, height: imageHeight }]}
          />
          {/* Nombre */}
          <Text style={styles.name}>{product.name || 'Sin nombre'}</Text>
          {/* Descripción */}
          <View style={styles.descContainer}>
            <Text style={styles.descText} numberOfLines={descExpanded ? undefined : maxDescLines}>
              {product.description || 'Sin descripción'}
            </Text>
            {showExpand && (
              <TouchableOpacity onPress={() => setDescExpanded(e => !e)}>
                <Text style={styles.seeMore}>{descExpanded ? 'Ver menos' : 'Ver más'}</Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Selector de cantidad y botón adicionar */}
          <View style={styles.bottomRow}>
            <View style={styles.quantityOval}>
              <TouchableOpacity onPress={() => setQuantity(q => Math.max(1, q - 1))}>
                <MaterialCommunityIcons name="minus" size={22} color="#222" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity onPress={() => setQuantity(q => q + 1)}>
                <MaterialCommunityIcons name="plus" size={22} color="#222" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={() => onAddToCart(product, quantity)}>
              <Text style={styles.addBtnText}>Adicionar</Text>
              <Text style={styles.addBtnPrice}>${product.price ? product.price * quantity : 0}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 16,
    width: '92%',
    maxWidth: 480,
    alignSelf: 'center',
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  productImg: {
    alignSelf: 'center',
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
    color: '#222',
  },
  descContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  descText: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 2,
    maxWidth: '98%',
  },
  seeMore: {
    color: '#3B82F6',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  quantityOval: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 90,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 12,
    color: '#222',
  },
  addBtn: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    alignItems: 'center',
    minWidth: 120,
    marginLeft: 12,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addBtnPrice: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
    fontWeight: 'bold',
  },
});

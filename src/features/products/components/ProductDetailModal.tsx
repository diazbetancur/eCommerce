import React, { useState } from 'react';
import { View, Text, Modal, Image, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Colors from '../../../assets/Colors';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../../components/ButtonComponent';

type Props = {
  visible: boolean;
  onClose: () => void;
  product: any;
  onAddToCart: (item: any, quantity: number) => void;
};

export default function ProductDetailModal({ visible, onClose, product, onAddToCart }: Props) {
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  if (!product) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPressOut={onClose} // ✅ toca fuera del modal
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Image source={{ uri: product.imageUrl }} style={styles.image} />
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.description}>{product.description}</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>

            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={decrease}>
                <Ionicons name="remove-circle-outline" size={30} color={Colors.BLUE} />
              </TouchableOpacity>
              <Text style={styles.quantity}>{quantity}</Text>
              <TouchableOpacity onPress={increase}>
                <Ionicons name="add-circle-outline" size={30} color={Colors.BLUE} />
              </TouchableOpacity>
            </View>
            <Button
              onPress={() => {
                onAddToCart(product, quantity);
                onClose();
              }}
              title={'Agregar al carrito'}
            />

            {/* <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              onAddToCart(product, quantity);
              onClose();
            }}
          >
            <Text style={styles.addButtonText}>Agregar al carrito</Text>
          </TouchableOpacity> */}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  modal: {
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    padding: 20,
    width: '90%',
    alignItems: 'center'
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 12,
    marginBottom: 10
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginVertical: 10
  },
  price: {
    fontSize: 18,
    color: Colors.BLUE,
    marginBottom: 10
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  quantity: {
    fontSize: 18,
    marginHorizontal: 15
  },
  addButton: {
    backgroundColor: Colors.BLUE,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20, // 🔁 Asegúrate de que tenga espacio
    alignSelf: 'stretch', // 🔁 Para que se vea en todo el ancho
    alignItems: 'center'
  },
  addButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold'
  }
});

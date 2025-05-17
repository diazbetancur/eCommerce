import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../../context/CartContext';
import Colors from '../../../assets/Colors';
import Button from '../../../components/ButtonComponent';

export default function CartScreen() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();

  const handleQuantityChange = (item, delta) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity <= 0) {
      removeFromCart(item.id);
    } else {
      updateQuantity(item.id, newQuantity);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{item.name}</Text>
          <TouchableOpacity onPress={() => removeFromCart(item.id)}>
            <Ionicons name="trash" size={20} color={Colors.RED} />
          </TouchableOpacity>
        </View>

        <Text style={styles.price}>Precio: ${item.price.toFixed(2)}</Text>

        <View style={styles.quantityRow}>
          <TouchableOpacity onPress={() => handleQuantityChange(item, -1)}>
            <Ionicons name="remove-circle-outline" size={26} color={Colors.BLUE} />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => handleQuantityChange(item, 1)}>
            <Ionicons name="add-circle-outline" size={26} color={Colors.BLUE} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>El carrito está vacío.</Text>}
      />

      {cart.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${getCartTotal()}</Text>
          </View>

          <View style={styles.buttonRow}>
            <Button
              buttonStyle={[styles.buttonBase, styles.clearButton]}
              onPress={clearCart}
              title="Vaciar Carrito"
            />
            <Button
              buttonStyle={[styles.buttonBase, styles.buyButton]}
              onPress={() => alert('Compra realizada')}
              title="Finalizar Compra"
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: Colors.WHITE },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.LIGHT_GRAY,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 0.5, // ✅ borde muy delgado
    borderColor: '#ccc'
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between'
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    flexShrink: 1
  },
  price: {
    fontSize: 14,
    marginTop: 4,
    color: '#555'
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 12
  },
  clearButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.SECONDARY,
    borderRadius: 8,
    alignItems: 'center'
  },
  clearText: {
    color: Colors.WHITE,
    fontWeight: 'bold'
  },
  empty: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16
  },
  footer: {
    marginTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
    paddingTop: 12
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.BLUE
  },
  buyButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  buyText: {
    color: Colors.WHITE,
    fontWeight: 'bold',
    fontSize: 16
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12, // si no funciona en tu versión, usa marginRight manual en buttonBase
    flexWrap: 'wrap'
  },
  buttonBase: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 140,
    alignItems: 'center'
  }
});

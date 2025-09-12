import { useState } from 'react';
import { Button, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart } from '../../../core/context/CartContext';

const paymentMethodsMock = [
  { key: 'tdc', label: 'Tarjeta de Crédito' },
  { key: 'wallet', label: 'Billetera Electrónica' },
  { key: 'cash', label: 'Pago en efectivo' },
];

export default function CartScreen() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethodsMock[0].key);

  const handleCheckout = () => {
    setShowModal(true);
    setTimeout(() => {
      clearCart();
      setShowModal(false);
    }, 2500);
  };

  // Calcular total
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const impuestos = Math.round(subtotal * 0.19); // 19% ejemplo
  const descuentos = 0; // Aquí puedes sumar descuentos si los agregas
  const total = subtotal + impuestos - descuentos;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carrito de compras</Text>
      {cart.length === 0 ? (
        <Text style={styles.empty}>Tu carrito está vacío.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={item => item.product.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.cartRow}>
              <Image source={{ uri: item.product.image }} style={styles.cartImg} />
              <View style={styles.cartInfo}>
                <Text style={styles.cartName}>{item.product.name}</Text>
                <Text style={styles.cartPrice}>${item.product.price} c/u</Text>
                <Text style={styles.cartTotal}>Total: ${item.product.price * item.quantity}</Text>
              </View>
              <View style={styles.cartActions}>
                <TouchableOpacity onPress={() => {
                  if (item.quantity === 1) removeFromCart(item.product.id);
                  else updateQuantity(item.product.id, item.quantity - 1);
                }} style={styles.circleBtnSmall}>
                  <MaterialCommunityIcons name={item.quantity === 1 ? 'trash-can-outline' : 'minus'} size={22} color="#222" />
                </TouchableOpacity>
                <Text style={styles.cartQty}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.product.id, item.quantity + 1)} style={styles.circleBtnSmall}>
                  <MaterialCommunityIcons name="plus" size={22} color="#222" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
      {cart.length > 0 && (
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Selecciona método de pago:</Text>
          <View style={styles.paymentMethodsColumn}>
            {paymentMethodsMock.map(method => (
              <TouchableOpacity
                key={method.key}
                style={styles.radioRow}
                onPress={() => setSelectedPayment(method.key)}
              >
                <View style={[styles.radioOuter, selectedPayment === method.key && styles.radioOuterActive]}>
                  {selectedPayment === method.key && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.radioLabel}>{method.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Resumen */}
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Resumen</Text>
            <View style={styles.summaryRow}><Text>Subtotal:</Text><Text>${subtotal}</Text></View>
            <View style={styles.summaryRow}><Text>Impuestos (19%):</Text><Text>${impuestos}</Text></View>
            <View style={styles.summaryRow}><Text>Descuentos:</Text><Text>-${descuentos}</Text></View>
            <View style={styles.summaryRow}><Text>Método de pago:</Text><Text>{paymentMethodsMock.find(m => m.key === selectedPayment)?.label}</Text></View>
            <View style={styles.summaryRowTotal}><Text style={styles.summaryTotalText}>Total:</Text><Text style={styles.summaryTotalText}>${total}</Text></View>
          </View>
          <Button title="Pagar" onPress={handleCheckout} />
        </View>
      )}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, textAlign: 'center' }}>
              Será redireccionado a la pasarela de pago, prontamente.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 16,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 32,
  },
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 4,
  },
  cartImg: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#eee',
    marginRight: 10,
  },
  cartInfo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cartName: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
    color: '#222',
  },
  cartPrice: {
    fontSize: 13,
    color: '#444',
  },
  cartTotal: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: 'bold',
    marginTop: 2,
  },
  cartActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  circleBtnSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.2,
    borderColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginHorizontal: 2,
  },
  cartQty: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 6,
    color: '#222',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    elevation: 4,
  },
  paymentSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  paymentTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  paymentMethodsColumn: {
    flexDirection: 'column',
    marginBottom: 12,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  radioOuterActive: {
    borderColor: '#2563eb',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563eb',
  },
  radioLabel: {
    fontSize: 15,
    color: '#222',
  },
  summaryBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    marginTop: 8,
  },
  summaryTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#222',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 6,
  },
  summaryTotalText: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#2563eb',
  },
});

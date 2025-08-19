import { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchPurchaseHistory } from '../services/userHistoryService';

export default function PurchaseHistoryScreen() {
  const [history, setHistory] = useState([]);
  const [modal, setModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const userId = 1;

  useEffect(() => {
    fetchPurchaseHistory(userId).then(setHistory);
  }, []);

  const renderPurchaseDetail = (purchase) => (
    <View style={styles.modalContent}>
      <Text style={styles.title}>Detalle de compra</Text>
      <Text>Fecha: {purchase.date}</Text>
      <Text>Valor total: ${purchase.total}</Text>
      <Text>Artículos: {purchase.items}</Text>
      <Text style={{ marginTop: 8, fontWeight: 'bold' }}>Productos:</Text>
      {purchase.products.map((p) => (
        <Text key={p.name + p.qty + p.price}>- {p.name} x{p.qty} (${p.price})</Text>
      ))}
      <TouchableOpacity style={styles.closeBtn} onPress={() => setModal(null)}><Text style={styles.closeText}>Cerrar</Text></TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de compras</Text>
      <FlatList
        data={history}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => { setModal('purchase'); setModalData(item); }}>
            <Text>Fecha: {item.date}</Text>
            <Text>Artículos: {item.items}</Text>
            <Text>Valor: ${item.total}</Text>
          </TouchableOpacity>
        )}
      />
      <Modal visible={modal === 'purchase'} transparent animationType="fade">
        <View style={styles.modalBg}>{modalData && renderPurchaseDetail(modalData)}</View>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    elevation: 2,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    minWidth: 240,
    alignItems: 'center',
  },
  closeBtn: {
    marginTop: 16,
    padding: 8,
  },
  closeText: {
    color: '#2a7',
    fontWeight: 'bold',
  },
});

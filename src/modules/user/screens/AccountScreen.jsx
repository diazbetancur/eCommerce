import { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ClientConfigService } from '../../../core/services/clientConfig.service';
import { fetchAccrualHistory, fetchPurchaseHistory, fetchRedemptionHistory, fetchReferralHistory } from '../services/userHistoryService';
// Header para historial de acumulación
function AccrualHistoryHeader() {
  return (
    <View style={styles.tableRowHeader}>
      <Text style={styles.tableCell}>Fecha</Text>
      <Text style={styles.tableCell}>Valor</Text>
      <Text style={styles.tableCell}>Puntos</Text>
      <Text style={styles.tableCell}>Vencimiento</Text>
    </View>
  );
}

export default function AccountScreen() {


  const [modal, setModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [accrualHistory, setAccrualHistory] = useState([]);
  const [redemptionHistory, setRedemptionHistory] = useState([]);
  const [referralHistory, setReferralHistory] = useState([]);
  const userId = 1; // Simulado

  // Obtener plan y módulos activos
  const clientConfigService = new ClientConfigService();
  const clientConfig = clientConfigService.loadLocalConfig();
  const plan = clientConfig?.settings?.plan || 'basic';
  const activeModules = clientConfig?.modules?.[plan] || [];

  useEffect(() => {
    fetchPurchaseHistory(userId).then(setPurchaseHistory);
    if (activeModules.includes('loyalty')) {
      fetchAccrualHistory(userId).then(setAccrualHistory);
      fetchRedemptionHistory(userId).then(setRedemptionHistory);
      fetchReferralHistory(userId).then(setReferralHistory);
    }
  }, []);

  // Render detalle de compra
  const renderPurchaseDetail = (purchase) => (
    <View style={styles.modalContent}>
      <Text style={styles.sectionTitle}>Detalle de compra</Text>
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

  // Header para historial de acumulación
  const AccrualHistoryHeader = () => (
    <View style={styles.tableRowHeader}>
      <Text style={styles.tableCell}>Fecha</Text>
      <Text style={styles.tableCell}>Valor</Text>
      <Text style={styles.tableCell}>Puntos</Text>
      <Text style={styles.tableCell}>Vencimiento</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Cuenta</Text>
      {/* Datos personales (se construirá después) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos personales</Text>
        <Text>Próximamente...</Text>
      </View>

      {/* Historiales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Historiales</Text>
        {/* Historial de compras */}
        <Text style={styles.subtitle}>Historial de compras</Text>
        <FlatList
          data={purchaseHistory}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => { setModal('purchase'); setModalData(item); }}>
              <Text>Fecha: {item.date}</Text>
              <Text>Artículos: {item.items}</Text>
              <Text>Valor: ${item.total}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Historial de acumulación */}
        {activeModules.includes('loyalty') && (
          <>
            <Text style={styles.subtitle}>Historial de acumulación</Text>
            <FlatList
              data={accrualHistory}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.date}</Text>
                  <Text style={styles.tableCell}>${item.value}</Text>
                  <Text style={styles.tableCell}>{item.points} pts</Text>
                  <Text style={styles.tableCell}>{item.expires}</Text>
                </View>
              )}
              ListHeaderComponent={AccrualHistoryHeader}
            />
          </>
        )}

        {/* Historial de redenciones */}
        {activeModules.includes('loyalty') && (
          <>
            <Text style={styles.subtitle}>Historial de redenciones</Text>
            <FlatList
              data={redemptionHistory}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text>Fecha: {item.date}</Text>
                  <Text>Producto: {item.product}</Text>
                  <Text>Puntos usados: {item.points}</Text>
                </View>
              )}
            />
          </>
        )}

        {/* Referidos */}
        {activeModules.includes('loyalty') && (
          <>
            <Text style={styles.subtitle}>Referidos</Text>
            <FlatList
              data={referralHistory}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text>Usuario: {item.user}</Text>
                  <Text>Recompensa: {item.reward}</Text>
                  <Text>Activado: {item.activated}</Text>
                </View>
              )}
            />
          </>
        )}
      </View>

      {/* Modal para detalle de compra */}
      <Modal visible={modal === 'purchase'} transparent animationType="fade">
        <View style={styles.modalBg}>{modalData && renderPurchaseDetail(modalData)}</View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    elevation: 2,
  },
  subtitle: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    fontSize: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 4,
  },
  tableRowHeader: {
    flexDirection: 'row',
    backgroundColor: '#e5e5e5',
    paddingVertical: 4,
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    textAlign: 'center',
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
  section: {
    marginVertical: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    minWidth: 140,
    backgroundColor: '#fff',
  },
});

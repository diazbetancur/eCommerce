import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { FlatList, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../../assets/Colors';
import { fetchLoyaltyData } from '../services/loyaltyService';

const mockImages = [
  require('../../../assets/images/defualt-category.png'),
  require('../../../assets/images/loging.png'),
  require('../../../assets/images/logo.svg'),
];
const mockHistorial = [
  { fecha: '2025-08-01', valor: 120000, puntos: 120 },
  { fecha: '2025-07-15', valor: 80000, puntos: 80 },
  { fecha: '2025-07-02', valor: 50000, puntos: 50 },
];

export default function LoyaltyScreen() {
  const [loyalty, setLoyalty] = useState(null);
  const [selectedReward, setSelectedReward] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [tab, setTab] = useState('redencion'); // 'redencion' | 'estado' | 'referidos'
  const userId = 1; // Simulado

  useEffect(() => {
    fetchLoyaltyData(userId).then(setLoyalty);
  }, []);

  if (!loyalty) return <View style={styles.container}><Text>Cargando...</Text></View>;

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={styles.tabsRowScroll}>
        <TouchableOpacity style={[styles.tabBtn, tab === 'redencion' ? styles.tabBtnActive : styles.tabBtnInactive]} onPress={() => setTab('redencion')}>
          <Text style={tab === 'redencion' ? styles.tabTextActive : styles.tabTextInactive}>Redención</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, tab === 'estado' ? styles.tabBtnActive : styles.tabBtnInactive]} onPress={() => setTab('estado')}>
          <Text style={tab === 'estado' ? styles.tabTextActive : styles.tabTextInactive}>Puntos disponibles</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabBtn, tab === 'referidos' ? styles.tabBtnActive : styles.tabBtnInactive]} onPress={() => setTab('referidos')}>
          <Text style={tab === 'referidos' ? styles.tabTextActive : styles.tabTextInactive}>Referidos</Text>
        </TouchableOpacity>
      </ScrollView>
      {tab === 'redencion' && (
        <>
          <Text style={styles.title}>Beneficios disponibles</Text>
          <FlatList
            data={loyalty.rewards}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={styles.benefitRow} onPress={() => { setSelectedReward(item); setModalVisible(true); }}>
                <Image source={mockImages[index % mockImages.length]} style={styles.benefitImg} />
                <View style={styles.benefitInfo}>
                  <Text style={styles.benefitName}>{item.name}</Text>
                  <Text style={styles.benefitDesc}>{`Beneficio: ${item.name}. Canjea por puntos.`}</Text>
                </View>
                <View style={styles.benefitPointsBox}>
                  <Text style={styles.benefitPoints}>{item.requiredPoints} pts</Text>
                </View>
              </TouchableOpacity>
            )}
            style={{ marginBottom: 16 }}
          />
          {/* Modal detalle beneficio */}
          <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#222" />
                </TouchableOpacity>
                {selectedReward && (
                  <ScrollView>
                    <Image source={mockImages[selectedReward.id % mockImages.length]} style={styles.modalImg} />
                    <Text style={styles.modalName}>{selectedReward.name}</Text>
                    <Text style={styles.modalPoints}>{selectedReward.requiredPoints} pts</Text>
                    <Text style={styles.modalDesc}>{`Este beneficio te permite obtener ${selectedReward.name} en tu próxima compra. Aplica condiciones y restricciones. Canjea usando tus puntos acumulados.`}</Text>
                  </ScrollView>
                )}
              </View>
            </View>
          </Modal>
        </>
      )}
      {tab === 'estado' && (
        <>
          <View style={styles.estadoRowSimple}>
            <Text style={styles.estadoLabel}>Puntos disponibles</Text>
            <Text style={styles.estadoPuntos}>{loyalty.points} pts</Text>
          </View>
          <Text style={styles.historialTitle}>Historial de acumulaciones</Text>
          <View style={styles.historialTable}>
            <View style={styles.historialHeader}>
              <Text style={styles.historialTh}>Fecha</Text>
              <Text style={styles.historialTh}>Valor compra</Text>
              <Text style={styles.historialTh}>Puntos obtenidos</Text>
            </View>
            {mockHistorial.map((row, idx) => (
              <View style={styles.historialRow} key={`${row.fecha}-${row.valor}-${idx}`}>
                <Text style={styles.historialTd}>{row.fecha}</Text>
                <Text style={styles.historialTd}>${row.valor}</Text>
                <Text style={styles.historialTd}>{row.puntos}</Text>
              </View>
            ))}
          </View>
        </>
      )}
      {tab === 'referidos' && (
        <View style={styles.referidosBox}>
          <Text style={styles.referidosTitle}>Referidos</Text>
          <Text style={styles.referidosCount}>Cantidad de referidos: {loyalty.referrals}</Text>
          {/* Aquí puedes agregar más detalles o historial de referidos si lo deseas */}
        </View>
      )}
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
  points: {
    fontSize: 18,
    color: '#2a7',
    marginBottom: 12,
  },
  subtitle: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  reward: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  product: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 14,
    marginBottom: 10,
    padding: 8,
    elevation: 1,
  },
  benefitImg: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#eee',
    marginRight: 10,
  },
  benefitInfo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  benefitName: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
    color: '#222',
  },
  benefitDesc: {
    fontSize: 13,
    color: '#444',
  },
  benefitPointsBox: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    minWidth: 60,
  },
  benefitPoints: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
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
    maxWidth: 420,
    alignSelf: 'center',
    elevation: 4,
  },
  modalCloseBtn: {
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  modalImg: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    backgroundColor: '#eee',
    marginBottom: 12,
  },
  modalName: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 6,
    textAlign: 'center',
    color: '#222',
  },
  modalPoints: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginBottom: 2,
    maxWidth: '98%',
  },
  tabsScroll: {
    marginBottom: 16,
    marginTop: 8,
    maxHeight: 54,
  },
  tabsRowScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 6,
    backgroundColor: '#fff',
  },
  tabBtnActive: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  tabBtnInactive: {
    backgroundColor: Colors.SECONDARY,
    borderColor: Colors.SECONDARY,
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  tabTextInactive: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    opacity: 0.7,
  },
  estadoRowSimple: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  referidosBox: {
    backgroundColor: '#f9f9f9',
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  referidosTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: Colors.PRIMARY,
  },
  referidosCount: {
    fontSize: 16,
    color: '#222',
  },
  estadoLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
    color: '#222',
  },
  estadoPuntos: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2563eb',
  },
  historialTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#222',
  },
  historialTable: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 8,
  },
  historialHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 4,
    marginBottom: 4,
  },
  historialTh: {
    flex: 1,
    fontWeight: 'bold',
    color: '#2563eb',
    fontSize: 14,
    textAlign: 'center',
  },
  historialRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  historialTd: {
    flex: 1,
    fontSize: 13,
    color: '#222',
    textAlign: 'center',
  },
});

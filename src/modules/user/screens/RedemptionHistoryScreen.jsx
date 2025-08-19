import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { fetchRedemptionHistory } from '../services/userHistoryService';

export default function RedemptionHistoryScreen() {
  const [history, setHistory] = useState([]);
  const userId = 1;

  useEffect(() => {
    fetchRedemptionHistory(userId).then(setHistory);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de redenciones</Text>
      <FlatList
        data={history}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Fecha: {item.date}</Text>
            <Text>Producto: {item.product}</Text>
            <Text>Puntos usados: {item.points}</Text>
          </View>
        )}
      />
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
});

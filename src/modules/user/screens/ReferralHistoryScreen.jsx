import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { fetchReferralHistory } from '../services/userHistoryService';

export default function ReferralHistoryScreen() {
  const [history, setHistory] = useState([]);
  const userId = 1;

  useEffect(() => {
    fetchReferralHistory(userId).then(setHistory);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de referidos</Text>
      <FlatList
        data={history}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Usuario: {item.user}</Text>
            <Text>Recompensa: {item.reward}</Text>
            <Text>Activado: {item.activated}</Text>
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

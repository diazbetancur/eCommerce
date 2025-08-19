import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { fetchAccrualHistory } from '../services/userHistoryService';

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

export default function AccrualHistoryScreen() {
  const [history, setHistory] = useState([]);
  const userId = 1;

  useEffect(() => {
    fetchAccrualHistory(userId).then(setHistory);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de acumulación</Text>
      <FlatList
        data={history}
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
});

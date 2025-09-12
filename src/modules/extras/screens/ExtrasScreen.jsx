import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ExtrasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Extras de Competitividad</Text>
      {/* Aquí va la lógica y componentes de extras */}
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
});

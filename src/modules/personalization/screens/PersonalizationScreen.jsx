import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function PersonalizationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personalización y Marketing</Text>
      {/* Aquí va la lógica y componentes de personalización */}
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

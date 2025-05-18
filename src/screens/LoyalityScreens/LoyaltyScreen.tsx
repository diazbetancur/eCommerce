import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LoyaltyScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Programa de Lealtad</Text>
      <Text>Aquí verás tus puntos, recompensas y beneficios especiales.</Text>
    </View>
  );
};

export default LoyaltyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12
  }
});

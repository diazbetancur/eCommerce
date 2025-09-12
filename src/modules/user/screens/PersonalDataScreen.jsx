import { StyleSheet, Text, View } from 'react-native';

export default function PersonalDataScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datos personales</Text>
      <Text>Próximamente podrás editar tus datos personales aquí.</Text>
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

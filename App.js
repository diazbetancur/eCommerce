import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { I18nextProvider } from 'react-i18next';

import { AuthProvider } from './src/context/AuthContext';
import Start from './src/screens/HomeScreen/Start';
import i18n from './src/assets/i18n';
import 'intl-pluralrules';

export default function App() {
  return (
    <View style={styles.container}>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <Start />
          <StatusBar style="auto" />
        </AuthProvider>
      </I18nextProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

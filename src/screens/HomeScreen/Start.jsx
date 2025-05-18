import { StyleSheet, View } from 'react-native';
import React from 'react';

import useAuth from '../../hooks/useAuth';
import Navigation from '../../navigation/Navigation';
import { NotificationsProvider } from '../../context/notificationContext';
import { CartProvider } from '../../context/CartContext';
import LoginForm from '../../features/auth/screens/LoginFrom';

export default function Start() {
  const { auth } = useAuth();

  return (
    <View style={style.container}>
      {auth ? (
        <NotificationsProvider>
          <CartProvider>
            <Navigation />
          </CartProvider>
        </NotificationsProvider>
      ) : (
        <LoginForm />
      )}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1
  }
});

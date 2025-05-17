import { StyleSheet, View } from 'react-native';
import React from 'react';

import useAuth from '../../hooks/useAuth';
import Navigation from '../../navigation/Navigation';
import { NotificationsProvider } from '../../context/notificationContext';
import LoginForm from '../../features/auth/services/LoginFrom';

export default function Start() {
  const { auth } = useAuth();

  return (
    <View style={style.container}>
      {auth ? (
        <NotificationsProvider>
          <Navigation />
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

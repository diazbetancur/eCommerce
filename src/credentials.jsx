import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDGgwF_qmH-CZMbYAiJMLRoXr5uMJAuqAA',
  authDomain: 'ecommerce-be624.firebaseapp.com',
  projectId: 'ecommerce-be624',
  storageBucket: 'ecommerce-be624.firebasestorage.app',
  messagingSenderId: '922254729614',
  appId: '1:922254729614:web:ebad661237e0af40c744df',
  measurementId: 'G-N518P5BMEG'
};

const appFirebase = initializeApp(firebaseConfig);

const auth = initializeAuth(appFirebase, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { appFirebase, auth };

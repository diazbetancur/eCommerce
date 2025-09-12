import {
  EXPO_PUBLIC_FIREBASE_API_KEY,
  EXPO_PUBLIC_FIREBASE_APP_ID,
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// DEBUG: Verificando variables de entorno
console.log('🔥 Firebase Config Debug:');
console.log('API_KEY:', EXPO_PUBLIC_FIREBASE_API_KEY ? 'SET' : 'MISSING');
console.log('AUTH_DOMAIN:', EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'SET' : 'MISSING');
console.log('PROJECT_ID:', EXPO_PUBLIC_FIREBASE_PROJECT_ID ? 'SET' : 'MISSING');

// Configuración con valores por defecto para prevenir crashes
const firebaseConfig = {
  apiKey: EXPO_PUBLIC_FIREBASE_API_KEY || "dummy-api-key",
  authDomain: EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy-project.firebaseapp.com",
  projectId: EXPO_PUBLIC_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy-project.appspot.com",
  messagingSenderId: EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: EXPO_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:dummy"
};

console.log('🚀 Initializing Firebase...');
let appFirebase, auth, db;

try {
  appFirebase = initializeApp(firebaseConfig);
  db = getFirestore(appFirebase);

  try {
    auth = initializeAuth(appFirebase, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch (authError) {
    if (authError.code === 'auth/already-initialized') {
      console.log('🔄 Firebase Auth already initialized, using existing instance');
      auth = getAuth(appFirebase);
    } else {
      throw authError;
    }
  }
  
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw error;
}

export { appFirebase, auth, db };

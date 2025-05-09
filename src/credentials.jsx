import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyC28eg_W6NZTjoxuguYvYAC7DQVEGQ_y74",
  authDomain: "ampm-e9584.firebaseapp.com",
  projectId: "ampm-e9584",
  storageBucket: "ampm-e9584.firebasestorage.app",
  messagingSenderId: "86678936229",
  appId: "1:86678936229:web:805f5874e4a3c5e76e4b4c",
  measurementId: "G-TXZT834YJS",
};

const appFirebase = initializeApp(firebaseConfig);

const auth = initializeAuth(appFirebase, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { appFirebase, auth };

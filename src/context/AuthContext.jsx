import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useState, createContext, useEffect } from "react";
import { auth } from "../credentials";
import { Alert } from "react-native";

import { useTranslation } from 'react-i18next';

export const AuthContext = createContext({
  auth: undefined,
  login: () => {},
  logout: () => {},
});

export function AuthProvider(props) {
  const { children } = props;
  const [authUser, setAuthUser] = useState(undefined);

  const { t } = useTranslation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });
    return () => unsubscribe();
  }, []);

  const login = (userData) => {
    setAuthUser(userData);
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAuthUser(undefined); 
    } catch (error) {
      Alert.alert("Error", t('errorLogout'),[{ text: "OK" }])
      console.error("Error closing session:", error);
    }
  };

  const valueContext = {
    auth: authUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={valueContext}>{children}</AuthContext.Provider>
  );
}

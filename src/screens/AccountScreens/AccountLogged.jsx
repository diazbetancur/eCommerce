import {
  View,
  StyleSheet,
  Text,
} from "react-native";
import React from "react";
import Button from "../../components/ButtonComponent";
import useAuth from "../../hooks/useAuth";
import { useTranslation } from 'react-i18next';
import Colors from "../../assets/Colors";
import { Icon } from "react-native-elements";

export default function AccountLogged() {

    const { logout } = useAuth();
    const { t } = useTranslation();

  return (
    <View style={style.container}>
        <View style={style.buttonContainer}>
            <Text>
                {t('settings')}
            </Text>
            <Icon  name="settings" size={24} color={Colors.primaryColor} />
        </View>
      <Button onPress={() => {
                logout()
      }} title={t('btnCloseSession')} />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  buttonContainer:{
    margin: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    width: "95%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
    justifyContent: 'space-around'
  }
});

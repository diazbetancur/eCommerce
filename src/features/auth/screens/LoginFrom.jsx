import { View, Image, StyleSheet, Alert, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { Icon, Input } from 'react-native-elements';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useTranslation } from 'react-i18next';
import Colors from '../../../assets/Colors';
import Button from '../../../components/ButtonComponent';
import useAuth from '../../../hooks/useAuth';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../credentials';

const { width } = Dimensions.get('window');

export default function LoginForm() {
  const [showIcon, setShowIcon] = useState(true);
  const { login } = useAuth();
  const { t } = useTranslation();

  const toggleShowPassword = () => {
    setShowIcon(!showIcon);
  };

  const formik = useFormik({
    initialValues: initalValues(),
    validationSchema: Yup.object(validationSchema(t)),
    onSubmit: async (formValues) => {
      const { userName, password } = formValues;
      try {
        console.log(userName, password);
        const userCredential = await signInWithEmailAndPassword(auth, userName, password);
        console.log(userCredential.user);
        login(userCredential.user);
      } catch (error) {
        console.log(error);
        Alert.alert('Error', t('errorLogin'), [{ text: 'OK' }]);
      }
    }
  });

  return (
    <View style={style.container}>
      <Image source={require('../../../assets/images/loging.png')} style={style.image} />
      <View style={style.containerForm}>
        <View style={style.containerInput}>
          <Input
            placeholder={t('user')}
            leftIcon={<Icon name="person" size={24} color={Colors.PRIMARY} />}
            value={formik.values.userName}
            onChangeText={(text) => formik.setFieldValue('userName', text)}
            errorMessage={formik.errors.userName}
            errorStyle={{ color: 'red' }}
            autoCapitalize="none"
          />
          <Input
            placeholder={t('password')}
            secureTextEntry={showIcon}
            autoCapitalize="none"
            rightIcon={
              <Icon
                name={showIcon ? 'visibility' : 'visibility-off'}
                size={24}
                color={Colors.PRIMARY}
                onPress={toggleShowPassword}
              />
            }
            leftIcon={<Icon name="password" size={24} color={Colors.PRIMARY} />}
            value={formik.values.password}
            onChangeText={(text) => formik.setFieldValue('password', text)}
            errorMessage={formik.errors.password}
            errorStyle={{ color: 'red' }}
          />
        </View>

        <Button onPress={formik.handleSubmit} title={t('btnLoggin')} />
      </View>
    </View>
  );
}

function initalValues() {
  return { userName: '', password: '' };
}

function validationSchema(t) {
  return {
    userName: Yup.string().required(t('errorUser')),
    password: Yup.string().required(t('errorPassword'))
  };
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
    flexDirection: 'column'
  },
  containerForm: {
    margin: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 20,
    width: '90%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center'
  },
  containerInput: {
    marginVertical: 30,
    width: '100%'
  },
  image: {
    marginBottom: 15,
    resizeMode: 'contain',
    width: width * 0.6,
    height: width * 0.6
  }
});

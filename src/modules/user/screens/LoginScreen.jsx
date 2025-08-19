import { useFormik } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Dimensions, Image, StyleSheet, View } from 'react-native';
import { Icon, Input } from 'react-native-elements';
import * as Yup from 'yup';
import Colors from '../../../assets/Colors';
import Button from '../../../components/ButtonComponent';
import { AuthService } from '../../../core/services/auth.service';

const { width } = Dimensions.get('window');
const authService = new AuthService();

export default function LoginScreen() {
  const [showIcon, setShowIcon] = useState(true);
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
        const user = await authService.login(userName, password);
        // Aquí puedes guardar el usuario en contexto o navegar
        Alert.alert('Login exitoso', t('welcome'), [{ text: 'OK' }]);
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
                onPress={toggleShowPassword}
                size={24}
                color={Colors.PRIMARY}
              />
            }
            value={formik.values.password}
            onChangeText={(text) => formik.setFieldValue('password', text)}
            errorMessage={formik.errors.password}
            errorStyle={{ color: 'red' }}
          />
        </View>
        <Button title={t('login')} onPress={formik.handleSubmit} />
      </View>
    </View>
  );
}

function initalValues() {
  return {
    userName: '',
    password: ''
  };
}

function validationSchema(t) {
  return {
    userName: Yup.string().required(t('required')),
    password: Yup.string().required(t('required'))
  };
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.5,
    height: width * 0.3,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  containerForm: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  containerInput: {
    marginBottom: 16,
  },
});

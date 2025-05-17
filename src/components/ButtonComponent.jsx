import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Colors from '../assets/Colors';

const { width, height } = Dimensions.get('window');

const Button = ({ onPress, title, buttonStyle = {}, textStyle = {} }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, buttonStyle]}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 10,
    width: width * 0.7
  },
  text: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export default Button;

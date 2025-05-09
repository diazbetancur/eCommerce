import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Colors from '../assets/Colors';

const ButtonAddComponent = ({onPress}) => {
  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.floatingButton} onPress={onPress} >
            <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', 
    alignItems: 'center',
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'absolute',
    bottom: 30, 
    right: 30, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 40,
  },
});

export default ButtonAddComponent;
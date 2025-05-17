import { View, StyleSheet, Text } from 'react-native';
import React from 'react';
import Colors from '../../../assets/Colors';
import useAuth from '../../../hooks/useAuth';
import InfinitePoints from '../../../components/InfinitePoints';
import Carousel from '../../../components/carousel';
import { useProducts } from '../hooks/useProducts';

export default function Home() {
  const { auth } = useAuth();
  const { products, loading, error } = useProducts();

  return (
    <View style={style.container}>
      <Text style={style.welcome}>¡Hola {auth?.displayName || auth?.email}!</Text>
      <InfinitePoints totalPoints={500} />
      <Text style={style.points}>Puntos a vencerse 108</Text>
      {/* <Carousel style={style.banner} banners={banners} /> */}
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    width: '100%'
  },
  welcome: {
    color: Colors.BLUE,
    fontSize: 25,
    fontWeight: 'bold',
    paddingLeft: 25,
    paddingTop: 15
  },
  points: {
    color: Colors.BLUE,
    fontSize: 20,
    fontWeight: 'bold',
    alignItems: 'center',
    textAlign: 'left',
    paddingLeft: 25,
    paddingTop: 5
  },
  banner: {
    marginTop: 20
  }
});

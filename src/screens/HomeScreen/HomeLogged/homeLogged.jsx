import { View, StyleSheet, Text } from "react-native";
import React from "react";
import Colors from "../../../assets/Colors";
import useAuth from "../../../hooks/useAuth";
import InfinitePoints from "../../../components/InfinitePoints";
import Carousel from "../../../components/carousel";

export default function HomeLogged() {
  const { auth } = useAuth();

  const banners = [
    {
      image:
        "https://img1.wsimg.com/isteam/ip/d298a667-0140-48dc-8d3c-21ed1fb0eb2c/452653830_477507281695909_8105742980576519802_.jpg/:/rs=w:984,h:984",
      link: "https://www.example.com/1",
    },
    {
      image:
        "https://img1.wsimg.com/isteam/ip/d298a667-0140-48dc-8d3c-21ed1fb0eb2c/452318202_476278138485490_7889915912121755042_.jpg/:/rs=w:984,h:984",
      link: "https://www.example.com/2",
    },
    {
      image:
        "https://img1.wsimg.com/isteam/ip/d298a667-0140-48dc-8d3c-21ed1fb0eb2c/453971655_482869021159735_6576001756054743248_.jpg/:/rs=w:984,h:984",
      link: "https://www.example.com/3",
    },
    {
      image:
        "https://img1.wsimg.com/isteam/ip/d298a667-0140-48dc-8d3c-21ed1fb0eb2c/455812698_493793146733989_848160395265659037_n.jpg/:/rs=w:984,h:984",
      link: "https://www.example.com/3",
    },
  ];

  return (
    <View style={style.container}>
      <Text style={style.welcome}>
        ¡Hola {auth?.displayName || auth?.email}!
      </Text>
      <InfinitePoints totalPoints={500} />
      <Text style={style.points}>Puntos a vencerse 108</Text>
      <Carousel style={style.banner} banners={banners} />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    width: "100%",
  },
  welcome: {
    color: Colors.BLUE,
    fontSize: 25,
    fontWeight: "bold",
    paddingLeft: 25,
    paddingTop: 15,
  },
  points: {
    color: Colors.BLUE,
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
    textAlign: "left",
    paddingLeft: 25,
    paddingTop: 5,
  },
  banner: {
    marginTop: 20,
  },
});

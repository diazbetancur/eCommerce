import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Colors from "../assets/Colors";

export default function InfinitePoints({ totalPoints }) {
  const [currentPoints, setCurrentPoints] = useState(0);
  const animatedValue = new Animated.Value(currentPoints);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: totalPoints,
      duration: 2000, // Duración de la animación
      useNativeDriver: false,
    }).start();

    animatedValue.addListener(({ value }) => {
      setCurrentPoints(Math.floor(value));
    });

    return () => animatedValue.removeAllListeners();
  }, [totalPoints]);

  return (
    <View style={styles.container}>
      <View style={styles.pointsContainer}>
        <Text style={styles.label}>¡Puntos acumulados!</Text>
        <Text style={styles.points}>{currentPoints}</Text>
      </View>
      <Animated.View style={styles.infiniteBackground}>
        <Text style={styles.infiniteSymbol}>∞</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 100,
  },
  pointsContainer: {
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: Colors.PRIMARY,
    fontSize: 20,
    fontWeight: "bold",
    alignItems: "center",
    textAlign: "center",
  },
  points: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.BLUE,
  },
  infiniteBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.2,
    width: "100%",
    height: "100%",
  },
  infiniteSymbol: {
    fontSize: 100,
    color: Colors.BLUE,
  },
});

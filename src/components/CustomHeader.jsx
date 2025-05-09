import React from "react";
import { Image } from "react-native";

export default function CustomHeader({ imageSource }) {
  return (
    <Image
      source={imageSource}
      style={{
        width: 100,
        height: 50,
        alignSelf: "center",
      }}
    />
  );
}

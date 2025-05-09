import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Image } from "react-native-elements";
import PagerView from "react-native-pager-view";

export default function Carousel({ banners }) {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <PagerView style={styles.container} initialPage={0}>
        {banners.map((banner, index) => (
          <View style={styles.page} key={index}>
            <Image
              source={{ uri: banner.image }}
              style={[styles.image, { width: width - 40 }]}
            />
          </View>
        ))}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 150,
    resizeMode: "cover",
    borderRadius: 20,
    marginHorizontal: 20,
  },
});

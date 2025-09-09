import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Image } from 'react-native-elements';
import PagerView from 'react-native-pager-view';

export default function Carousel({ banners }) {
  const { width } = useWindowDimensions();
  const pagerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPage = (currentPage + 1) % banners.length;
      pagerRef.current?.setPage(nextPage);
      setCurrentPage(nextPage);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentPage, banners.length]);

        const handlePress = () => {
    if (banner.linkUrl) {
      Linking.openURL(banner.linkUrl).catch(err =>
        console.error("No se pudo abrir la URL:", err)
      );
    }
  };

  return (
    <View style={styles.container}>
      <PagerView
        style={styles.pager}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {banners.map((banner, index) => (
          <View style={styles.page} key={index}>
            <TouchableOpacity onPress={handlePress}>
              <Image source={{ uri: banner.imageUrl }} style={[styles.image, { width: width - 40 }]} />
            </TouchableOpacity>
          </View>
        ))}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 160,
    marginTop: 10
  },
  pager: {
    flex: 1
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    height: 150,
    resizeMode: 'cover',
    borderRadius: 20,
    marginHorizontal: 20
  }
});

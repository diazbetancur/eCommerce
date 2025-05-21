import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
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
    }, 3000);

    return () => clearInterval(interval);
  }, [currentPage, banners.length]);

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
            <Image source={{ uri: banner.image }} style={[styles.image, { width: width - 40 }]} />
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

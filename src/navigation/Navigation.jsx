import * as React from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTranslation } from 'react-i18next';

import Colors from '../assets/Colors';
import AccountLogged from '../screens/AccountScreens/AccountLogged';
import OfferLogged from '../screens/OfferScreens/Offer';
import CustomHeader from '../components/CustomHeader';
import { useNotifications } from '../context/notificationContext';
import LoyaltyScreen from '../screens/LoyalityScreens/LoyaltyScreen';
import Home from '../features/products/screens/home';
import { useCart } from '../context/CartContext';
import CartScreen from '../features/cart/screens/CartScreen';

const Tab = createBottomTabNavigator();

export default function Navigation() {
  const { t } = useTranslation();
  const { notificationsCount } = useNotifications();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationContainer ref={navigationRef}>
      <Tab.Navigator
        initialRouteName={t('tabHome')}
        screenOptions={{
          tabBarActiveTintColor: Colors.PRIMARY,
          tabBarInactiveTintColor: Colors.SECUNDARY,
          headerTitleAlign: 'center'
        }}
      >
        <Tab.Screen
          name={t('Offer')}
          component={OfferLogged}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="brightness-percent" color={color} size={size} />
            )
          }}
        />
        <Tab.Screen
          name="Loyalty"
          component={LoyaltyScreen}
          options={{
            tabBarLabel: 'Lealtad',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="star-outline" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen
          name={t('tabHome')}
          component={Home}
          options={{
            headerTitle: () => (
              <CustomHeader imageSource={require('./../assets/images/iconLogo.png')} />
            ),
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
            headerRight: () => (
              <View style={style.notificationContainer}>
                <MaterialCommunityIcons
                  name="cart-variant"
                  size={25}
                  color={Colors.BLUE}
                  onPress={() => navigationRef.navigate('Carrito')}
                />
                {cartCount > 0 && (
                  <View style={style.notificationBadge}>
                    <Text style={style.badgeText}>{cartCount}</Text>
                  </View>
                )}
              </View>
            )
          }}
        />
        <Tab.Screen
          name="Carrito"
          component={CartScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cart" color={color} size={size} />
            )
          }}
        ></Tab.Screen>

        <Tab.Screen
          name={t('Account')}
          component={AccountLogged}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={size} />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  menu: {
    backgroundColor: Colors.PRIMARY
  },
  image: {
    marginBottom: 15
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold'
  }
});

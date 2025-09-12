// Navegador principal desacoplado y dinámico para arquitectura limpia
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

// Importa los módulos dinámicamente según configuración
// Ejemplo de componentes base
import { createStackNavigator } from '@react-navigation/stack';
import CartScreen from '../../modules/cart/screens/CartScreen';
import HomeScreen from '../../modules/catalog/screens/HomeScreen';
import LoyaltyScreen from '../../modules/loyalty/screens/LoyaltyScreen';
import AccountScreen from '../../modules/user/screens/AccountScreen';
import AccrualHistoryScreen from '../../modules/user/screens/AccrualHistoryScreen';
import PersonalDataScreen from '../../modules/user/screens/PersonalDataScreen';
import PurchaseHistoryScreen from '../../modules/user/screens/PurchaseHistoryScreen';
import RedemptionHistoryScreen from '../../modules/user/screens/RedemptionHistoryScreen';
import ReferralHistoryScreen from '../../modules/user/screens/ReferralHistoryScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator({ clientConfig }) {
  // Determina los módulos activos según la config
  const plan = clientConfig?.settings?.plan || 'enterprise';
  let activeModules = clientConfig?.modules?.[plan] || [];

  // Si el plan es enterprise y el array es ['*'], activa todos los módulos
  if (plan === 'enterprise' && Array.isArray(activeModules) && activeModules.includes('*')) {
    activeModules = [
      'products', 'cart', 'loyalty', 'user', 'support', 'personalization',
      'topup', 'integrations', 'analytics', 'extras'
    ];
  }

  const Stack = createStackNavigator();
  const AccountStack = () => (
    <Stack.Navigator>
      <Stack.Screen name="Account" component={AccountScreen} options={{ title: 'Mi Cuenta' }} />
      <Stack.Screen name="PersonalData" component={PersonalDataScreen} options={{ title: 'Datos personales' }} />
      <Stack.Screen name="PurchaseHistory" component={PurchaseHistoryScreen} options={{ title: 'Historial de compras' }} />
      <Stack.Screen name="AccrualHistory" component={AccrualHistoryScreen} options={{ title: 'Historial de acumulación' }} />
      <Stack.Screen name="RedemptionHistory" component={RedemptionHistoryScreen} options={{ title: 'Historial de redenciones' }} />
      <Stack.Screen name="ReferralHistory" component={ReferralHistoryScreen} options={{ title: 'Historial de referidos' }} />
    </Stack.Navigator>
  );

  // Bottom tabs: solo módulos principales
  const MainTabs = () => (
    <Tab.Navigator>
      {activeModules.includes('products') && (
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
      )}
      {activeModules.includes('cart') && (
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="cart" color={color} size={size} />
            ),
          }}
        />
      )}
      {activeModules.includes('loyalty') && (
        <Tab.Screen
          name="Loyalty"
          component={LoyaltyScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="star" color={color} size={size} />
            ),
          }}
        />
      )}
      {activeModules.includes('user') && (
        <Tab.Screen
          name="Account"
          component={AccountStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={size} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );

  // Drawer: solo si hay módulos secundarios activos
  // if (secondaryModules.length > 0) {
  //   return (
  //     <NavigationContainer>
  //       <Drawer.Navigator initialRouteName="Main">
  //         <Drawer.Screen name="Main" component={MainTabs} options={{ drawerLabel: 'Principal' }} />
  //         {secondaryModules.includes('support') && (
  //           <Drawer.Screen name="Support" component={SupportScreen} options={{ drawerLabel: 'Atención al Cliente' }} />
  //         )}
  //         {secondaryModules.includes('personalization') && (
  //           <Drawer.Screen name="Personalization" component={PersonalizationScreen} options={{ drawerLabel: 'Personalización' }} />
  //         )}
  //         {secondaryModules.includes('topup') && (
  //           <Drawer.Screen name="TopUp" component={TopUpScreen} options={{ drawerLabel: 'Recarga de Saldo' }} />
  //         )}
  //         {secondaryModules.includes('integrations') && (
  //           <Drawer.Screen name="Integrations" component={IntegrationsScreen} options={{ drawerLabel: 'Integraciones' }} />
  //         )}
  //         {secondaryModules.includes('analytics') && (
  //           <Drawer.Screen name="Analytics" component={AnalyticsScreen} options={{ drawerLabel: 'Analítica' }} />
  //         )}
  //         {secondaryModules.includes('extras') && (
  //           <Drawer.Screen name="Extras" component={ExtrasScreen} options={{ drawerLabel: 'Extras' }} />
  //         )}
  //       </Drawer.Navigator>
  //     </NavigationContainer>
  //   );
  // }

  // Solo bottom tabs si no hay módulos secundarios
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );

}

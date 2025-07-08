import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useBusinessConfig } from '../context/BusinessContext';

const Tab = createBottomTabNavigator();

export default function BusinessNavigator() {
  const { businessType, config } = useBusinessConfig();

  return (
    <Tab.Navigator>
      {config.navigation.map((screen) => (
        <Tab.Screen
          key={screen}
          name={screen}
          component={getScreenComponent(screen, businessType)}
        />
      ))}
    </Tab.Navigator>
  );
}

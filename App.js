import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import { CartProvider } from './src/context/CartContext';
import SplashBanner from './src/components/SplashBanner';
import { BRAND_NAME } from './src/config';

const Stack = createNativeStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <SafeAreaProvider>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: '#111111' },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: { fontWeight: '900', color: '#FFFFFF' },
              contentStyle: { backgroundColor: '#0A0A0A' },
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false, title: BRAND_NAME }}
            />
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{
                title: 'Tu pedido',
                headerStyle: { backgroundColor: '#0A0A0A' },
                headerTintColor: '#7CB342',
                headerTitleStyle: { fontWeight: '900', color: '#FFFFFF' },
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>

        {/* Splash banner rendered on top of everything */}
        {showSplash && (
          <SplashBanner onFinish={() => setShowSplash(false)} />
        )}
      </CartProvider>
    </SafeAreaProvider>
  );
}

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import OrderTrackingScreen from './src/screens/OrderTrackingScreen';
import { CartProvider } from './src/context/CartContext';
import SplashBanner from './src/components/SplashBanner';

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
              options={{ headerShown: false, title: 'Mora Protein' }}
            />
            <Stack.Screen
              name="Cart"
              component={CartScreen}
              options={{
                title: 'Carrito',
                headerStyle: { backgroundColor: '#0A0A0A' },
                headerTintColor: '#C9A96E',
                headerTitleStyle: { fontWeight: '900', color: '#FFFFFF' },
              }}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetailScreen}
              options={{
                title: 'Detalle del producto',
                headerStyle: { backgroundColor: '#0A0A0A' },
                headerTintColor: '#C9A96E',
              }}
            />
            <Stack.Screen
              name="OrderTracking"
              component={OrderTrackingScreen}
              options={{ headerShown: false }}
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

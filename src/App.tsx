import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StripeTerminalProvider} from '@stripe/stripe-terminal-react-native';
import {colors} from './constants/theme';
import {fetchConnectionToken} from './lib/api';
import {CartProvider} from './context/CartContext';
import {VisitProvider} from './context/VisitContext';
import type {RootStackParamList} from './navigation';
import VisitDetailsScreen from './screens/VisitDetailsScreen';
import BrandSelectScreen from './screens/BrandSelectScreen';
import ProductScreen from './screens/ProductScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import CartScreen from './screens/CartScreen';
import PaymentScreen from './screens/PaymentScreen';
import SuccessScreen from './screens/SuccessScreen';
import ErrorScreen from './screens/ErrorScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <StripeTerminalProvider
        logLevel="verbose"
        tokenProvider={fetchConnectionToken}>
        <VisitProvider>
          <CartProvider>
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{headerShown: false}}
                initialRouteName="VisitDetails">
                <Stack.Screen
                  name="VisitDetails"
                  component={VisitDetailsScreen}
                />
                <Stack.Screen
                  name="BrandSelect"
                  component={BrandSelectScreen}
                />
                <Stack.Screen name="Products" component={ProductScreen} />
                <Stack.Screen
                  name="ProductDetail"
                  component={ProductDetailScreen}
                />
                <Stack.Screen name="Cart" component={CartScreen} />
                <Stack.Screen name="Payment" component={PaymentScreen} />
                <Stack.Screen name="Success" component={SuccessScreen} />
                <Stack.Screen name="Error" component={ErrorScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </CartProvider>
        </VisitProvider>
      </StripeTerminalProvider>
    </SafeAreaProvider>
  );
};

export default App;

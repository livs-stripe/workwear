import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StripeTerminalProvider} from '@stripe/stripe-terminal-react-native';
import {colors} from './constants/theme';
import {fetchConnectionToken} from './lib/api';
import type {RootStackParamList} from './navigation';
import ProductScreen from './screens/ProductScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
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
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName="Products">
            <Stack.Screen name="Products" component={ProductScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
            <Stack.Screen name="Success" component={SuccessScreen} />
            <Stack.Screen name="Error" component={ErrorScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </StripeTerminalProvider>
    </SafeAreaProvider>
  );
};

export default App;

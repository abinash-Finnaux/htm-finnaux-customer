import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';

import SplashScreen from './src/screens/splash/SplashScreen';
import PermissionScreen from './src/screens/permission/PermissionScreen';
import LoginScreen from './src/screens/login/LoginScreen';
import SignUpScreen from './src/screens/signup/SignUpScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import ServiceScreen from './src/screens/ServiceScreen';
import ProfileScreen from './src/screens/sidebar/profile/ProfileScreen';
import AppliedLoansScreen from './src/screens/sidebar/appliedLoan/AppliedLoansScreen';
import MyLoansScreen from './src/screens/sidebar/myLoans/MyLoansScreen';
import PaymentHistoryScreen from './src/screens/sidebar/paymentHistory/PaymentHistoryScreen';
import SettingsScreen from './src/screens/sidebar/settings/SettingsScreen';
import HelpSupportScreen from './src/screens/helpSupport/HelpSupportScreen';
import ApplyLoanScreen from './src/screens/applyLoans/ApplyLoanScreen';
import RepaymentScheduleScreen from './src/screens/repaymentSchedule/RepaymentScheduleScreen';
import EmiDetailsScreen from './src/screens/emiDetails/emiDetailsScreen';
import EmiDepositScreen from './src/screens/emiDeposit/emiDepositScreen';

export type RootStackParamList = {
  Splash: undefined;
  Permission: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  Service: { title: string; icon: string; description: string };
  Profile: undefined;
  AppliedLoans: undefined;
  MyLoans: undefined;
  PaymentHistory: undefined;
  Settings: undefined;
  HelpSupport: undefined;
  ApplyLoan: undefined;
  RepaymentSchedule: undefined;
  EmiDetails: undefined;
  EmiDeposit: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppContent() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Permission" component={PermissionScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Service" component={ServiceScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="AppliedLoans" component={AppliedLoansScreen} />
          <Stack.Screen name="MyLoans" component={MyLoansScreen} />
          <Stack.Screen
            name="PaymentHistory"
            component={PaymentHistoryScreen}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
          <Stack.Screen name="ApplyLoan" component={ApplyLoanScreen} />
          <Stack.Screen
            name="RepaymentSchedule"
            component={RepaymentScheduleScreen}
          />
          <Stack.Screen name="EmiDetails" component={EmiDetailsScreen} />
          <Stack.Screen name="EmiDeposit" component={EmiDepositScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;

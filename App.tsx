import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';

import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/Dashboard';
import LogIn from './src/screens/LogIn'
import SignUp from './src/screens/SignUp';
import ForgotPassword from './src/screens/ForgotPassword';
import Onbording from './src/screens/Onboarding';
import Verification from './src/screens/Verification'
import AllPackages from  './src/screens/AllPackages'
import AllServices from  './src/screens/AllServices'
import AllReviews from  './src/screens/AllReviews'
import Locations from './src/screens/Locations'
import GarageRecommendations from './src/screens/GarageRecommendations'
import GarageHistory from './src/screens/GarageHistory'
import GarageExplore from './src/screens/GarageExplore'
import GarageFavourites from './src/screens/GarageFavourites'
import GarageInfo from './src/screens/GarageInfo'
import GaragePackage from './src/screens/GaragePackages'
import GarageReview from './src/screens/GarageReview'
import GarageServices from './src/screens/GarageServices'
import GarageServiceDetails from './src/screens/GarageServiceDetails'

import Forum from './src/screens/Forum'



export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  LogIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Verification: undefined;
  Home: undefined;
  Locations: undefined;
  GarageRecommendations: undefined;
  GarageHistory: undefined;
  GarageExplore: undefined;
  GarageFavourites: undefined;
  GarageInfo: undefined;
  AllPackages: undefined;
  AllServices: undefined;
  AllReviews: undefined;
  GaragePackage: undefined;
  GarageReview: undefined;
  GarageServices: undefined;
  GarageServiceDetails: undefined;
  Forum: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.ReactElement {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{ 
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        {/* Startup screens */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={Onbording} />

        {/* Auth flow */}
        <Stack.Screen name="LogIn" component={LogIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="Verification" component={Verification} />

        {/* Main App screens */}
        <Stack.Screen name="Home" component={HomeScreen} />

        {/* Garages and Locations */}
        <Stack.Screen name="Locations" component={Locations} />
        <Stack.Screen name="GarageRecommendations" component={GarageRecommendations} />
        <Stack.Screen name="GarageHistory" component={GarageHistory} />
        <Stack.Screen name="GarageExplore" component={GarageExplore} />
        <Stack.Screen name="GarageFavourites" component={GarageFavourites} />
        <Stack.Screen name="AllPackages" component={AllPackages} />
        <Stack.Screen name="AllServices" component={AllServices} />
        <Stack.Screen name="AllReviews" component={AllReviews} />
        <Stack.Screen name="GarageInfo" component={GarageInfo} />
        <Stack.Screen name="GaragePackage" component={GaragePackage} />
        <Stack.Screen name="GarageReview" component={GarageReview} />
        <Stack.Screen name="GarageServices" component={GarageServices} />
        <Stack.Screen name="GarageServiceDetails" component={GarageServiceDetails} />

        {/* Forum */}
        <Stack.Screen name="Forum" component={Forum} />
        

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
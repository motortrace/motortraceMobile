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
import SearchPosts from './src/screens/SearchPost';
import CreatePost from './src/screens/CreatePost';
import ForumDetail from './src/screens/ForumDetail';
import ForumProfile from './src/screens/ForumProfile'
import NotificationForum from './src/screens/ForumNotification'
import ForumNotificationDetails from './src/screens/ForumNotificationDetails'
import ForumViewProfile from './src/screens/ForumViewProfile'

import Profile from './src/screens/Profile'
import EditProfile from './src/screens/EditProfile'
import ResetPassword from './src/screens/ResetPassword';
import PrivacySettings from './src/screens/PrivacySettings';
import Help from './src/screens/Help'
import PrivacyPolicy from './src/screens/PrivacyPolicy'
import DeleteAccount from './src/screens/DeleteAccount';
import LoginActivity from './src/screens/LoginActivity';

import MarketPlace from './src/screens/MarketPlace'
import OrderDetails from './src/screens/OrderDetails';
import ProductDetails from './src/screens/ProductDetails';
import PurchaseHistory from './src/screens/PurchaseHistory';
import RecommendedProduct from './src/screens/RecommendedProduct';
import Carts from './src/screens/Cart'

import Cars from './src/screens/Cars'
import CarDetails from './src/screens/CarDetails';
import EditCarDetails from './src/screens/EditCarDetails';
import CarOnboarding from './src/screens/CarOnboarding';
import PurchaseHistoryScreen from './src/screens/PurchaseHistory';
import MarketplaceRecommendedScreen from './src/screens/RecommendedProduct';
import ResetPasswordScreen from './src/screens/ResetPassword';
import PrivacySettingsScreen from './src/screens/PrivacySettings';

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
  SearchPosts: undefined;
  CreatePost: undefined;
  ForumDetail: undefined;
  ForumProfile: undefined;
  NotificationForum: undefined;
  ForumNotificationDetails: undefined;
  ForumViewProfile: undefined;

  Profile: undefined;
  EditProfile: undefined;
  ResetPassword: undefined;
  PrivacySettings: undefined;
  Help: undefined;
  PrivacyPolicy: undefined;
  DeleteAccount: undefined;
  LoginActivity: undefined;

  Carts: undefined;
  MarketPlace: undefined;
  OrderDetails: undefined;
  ProductDetails: undefined;
  PurchaseHistory: undefined;
  RecommendedProduct: undefined;

  Cars: undefined;
  CarDetails: undefined;
  EditCarDetails: undefined;
  CarOnboarding: undefined;
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
        <Stack.Screen name="SearchPosts" component={SearchPosts} />
        <Stack.Screen name="CreatePost" component={CreatePost} />
        <Stack.Screen name="ForumDetail" component={ForumDetail} />
        <Stack.Screen name="ForumProfile" component={ForumProfile} />
        <Stack.Screen name="NotificationForum" component={NotificationForum} />
        <Stack.Screen name="ForumNotificationDetails" component={ForumNotificationDetails} />
        <Stack.Screen name="ForumViewProfile" component={ForumViewProfile} />

        {/* Profile */}
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="PrivacySettings" component={PrivacySettings} />
        <Stack.Screen name="Help" component={Help} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
        <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
        <Stack.Screen name="LoginActivity" component={LoginActivity} />

        {/* Market Place */}
        <Stack.Screen name="Carts" component={Carts} />
        <Stack.Screen name="MarketPlace" component={MarketPlace} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen name="PurchaseHistory" component={PurchaseHistory} />
        <Stack.Screen name="RecommendedProduct" component={RecommendedProduct} />

        {/* Cars */}
        {/* <Stack.Screen name="Cars" component={Cars} /> */}
        <Stack.Screen name="CarDetails" component={CarDetails} />
        <Stack.Screen name="EditCarDetails" component={EditCarDetails} />
        {/* <Stack.Screen name="CarOnboarding" component={CarOnboarding} /> */}

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
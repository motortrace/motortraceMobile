import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';

import SplashScreen from './src/screens/SplashScreen';
import Home from './src/screens/User/Dashboard';
import LogIn from './src/screens/LogIn'
import SignUp from './src/screens/SignUp';
import ForgotPassword from './src/screens/ForgotPassword';
import Onbording from './src/screens/User/Onboarding';
import Verification from './src/screens/Verification'
import LoadingScreen from './src/screens/LoadingScreen'
import Success from './src/screens/Success';
import Confirm from './src/screens/Confirm';
import RecoverPassword from './src/screens/RecoverPassword';

import AllPackages from  './src/screens/User/AllPackages'
import AllServices from  './src/screens/User/AllServices'
import AllReviews from  './src/screens/User/AllReviews'
import Locations from './src/screens/User/Locations'
import RecommendedServices from './src/screens/User/RecommendedServices'
import GarageHistory from './src/screens/User/GarageHistory'
import GarageExplore from './src/screens/User/GarageExplore'
import GarageFavourites from './src/screens/User/GarageFavourites'
import GarageInfo from './src/screens/User/GarageInfo'
import GaragePackage from './src/screens/User/GaragePackages'
import GarageReview from './src/screens/User/GarageReview'
import GarageServices from './src/screens/User/GarageServices'
import GarageServiceDetails from './src/screens/User/GarageServiceDetails'
import DetailedBill from './src/screens/User/DetailedBill';
import PaidServiceBillSummary from './src/screens/User/PaidServiceBillSummary';
import Appointment from './src/screens/User/Appointment'

// import Forum from './src/screens/User/Forum'
// import SearchPosts from './src/screens/User/SearchPost';
// import CreatePost from './src/screens/User/CreatePost';
// import ForumDetail from './src/screens/User/ForumDetail';
// import ForumProfile from './src/screens/User/ForumProfile'
// import NotificationForum from './src/screens/User/ForumNotification'
// import ForumNotificationDetails from './src/screens/User/ForumNotificationDetails'
// import ForumViewProfile from './src/screens/User/ForumViewProfile'

import Profile from './src/screens/User/Profile'
import EditProfile from './src/screens/User/EditProfile'
import ResetPassword from './src/screens/ResetPassword';
import PrivacySettings from './src/screens/PrivacySettings';
import Help from './src/screens/Help'
import PrivacyPolicy from './src/screens/PrivacyPolicy'
import DeleteAccount from './src/screens/DeleteAccount';
import LoginActivity from './src/screens/LoginActivity';
import ActiveSession from './src/screens/User/ActiveSession';
import SupportChat from './src/screens/User/SupportChat';
import faq from './src/screens/faq'
import FaqAnswer from './src/screens/FaqAnswer';

// import MarketPlace from './src/screens/User/MarketPlace'
// import OrderDetails from './src/screens/User/OrderDetails';
// import ProductDetails from './src/screens/ProductDetails';
// import PurchaseHistory from './src/screens/User/PurchaseHistory';
// import RecommendedProduct from './src/screens/User/RecommendedProduct';
// import Carts from './src/screens/User/Cart'
// import FavouriteProducts from './src/screens/User/FavouriteProducts';
// import TrackOrder from './src/screens/User/TrackOrder';

import Cars from './src/screens/User/Cars'
import CarDetails from './src/screens/User/CarDetails';
import EditCarDetails from './src/screens/User/EditCarDetails';
import CarOnboarding from './src/screens/User/CarOnboarding';
import CarProducts from './src/screens/User/CarProducts';
import CarServices from './src/screens/User/CarServices';
import MileageTracking from './src/screens/User/MilageTracking';

import InspectionResults from './src/screens/User/InspectionResult';
import PartsSelection from './src/screens/User/PartsSelection';
import Reservations from './src/screens/User/Reservations';
import ChatBox from './src/screens/Chatbox'
import InspectionResultSelected from './src/screens/User/InspectionResultSelected';
import SelectedParts from './src/screens/User/SelectedParts'
import ServiceProgress from './src/screens/User/ServiceProgress';

// import Rewards from './src/screens/User/Rewards';
// import RewardHistory from './src/screens/User/RewardHistory';
import InspectionCar from './src/screens/User/InspectionsCar';

import TechnicianHome from './src/screens/Technician/Home';
import AssignedWork from './src/screens/Technician/AssignedWork';
import WorkOrderDetails from './src/screens/Technician/WorkOrderDetails';
import TechnicianInspection from './src/screens/Technician/InspectionResults'
import TechnicianPartsSelection from './src/screens/Technician/PartsSelection'
import Work from './src/screens/Technician/Work';
import Inventory from './src/screens/Technician/Inventory';
import CreatingWroks from './src/screens/Technician/InspectionResults';
import ChangeWorks from './src/screens/Technician/AddParts';
import WorkProgress from './src/screens/Technician/Progress';
import TestDrive from './src/screens/Technician/TestDrive';
import Search from './src/screens/Technician/Search';
import TechnicianPofile from './src/screens/Technician/Profile';
import TechnicianEditPofile from './src/screens/Technician/EditPofile';
import WorkHistory from './src/screens/Technician/WorkHistory';
import SelectedProduct from './src/screens/Technician/SelectedProduct'
import SelectedWork from './src/screens/Technician/SelectedWork';
import CompleteWork from './src/screens/Technician/CompleteWork';

import { UserProvider } from './src/store/UserContext';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  LogIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Verification: undefined;
  LoadingScreen: undefined;
  Success: undefined;
  Confirm: undefined;
  RecoverPassword: undefined;

  Home: undefined;
  Locations: undefined;
  RecommendedServices: undefined;
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
  DetailedBill: undefined;
  PaidServiceBillSummary: undefined
  Appointment: undefined;

  // Forum: undefined;
  // SearchPosts: undefined;
  // CreatePost: undefined;
  // ForumDetail: undefined;
  // ForumProfile: undefined;
  // NotificationForum: undefined;
  // ForumNotificationDetails: undefined;
  // ForumViewProfile: undefined;

  Profile: undefined;
  EditProfile: undefined;
  ResetPassword: undefined;
  PrivacySettings: undefined;
  Help: undefined;
  PrivacyPolicy: undefined;
  DeleteAccount: undefined;
  LoginActivity: undefined;
  ActiveSession: undefined;
  SupportChat: undefined;
  faq: undefined;
  FaqAnswer: undefined;

  // Carts: undefined;
  // MarketPlace: undefined;
  // OrderDetails: undefined;
  // ProductDetails: undefined;
  // PurchaseHistory: undefined;
  // RecommendedProduct: undefined;
  // FavouriteProducts: undefined;
  // TrackOrder: undefined;

  Cars: undefined;
  CarDetails: undefined;
  EditCarDetails: undefined;
  CarOnboarding: undefined;
  CarProducts: undefined;
  CarServices: undefined;
  MileageTracking: undefined;

  Reservations: undefined;
  InspectionResults: undefined;
  PartsSelection: undefined;
  ChatBox: undefined;
  InspectionCar: undefined;
  InspectionResultSelected: undefined;
  SelectedParts: undefined;
  ServiceProgress: undefined;

  // Rewards: undefined;
  // RewardHistory: undefined;

  TechnicianHome: undefined;
  AssignedWork: undefined;
  WorkOrderDetails: undefined;
  TechnicianInspection: undefined;
  TechnicianPartsSelection: undefined;
  Work: undefined;
  Inventory: undefined;
  CreatingWroks: undefined;
  ChangeWorks: undefined;
  WorkProgress: undefined;
  TestDrive: undefined;
  Search: undefined;
  TechnicianPofile: undefined;
  TechnicianEditPofile: undefined;
  WorkHistory: undefined;
  SelectedProduct: undefined;
  SelectedWork: undefined;
  CompleteWork: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.ReactElement {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="SignUp"
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
          <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
          <Stack.Screen name="Success" component={Success} />
          <Stack.Screen name="Confirm" component={Confirm} />
          <Stack.Screen name="RecoverPassword" component={RecoverPassword} />

          {/* User Home */}
          <Stack.Screen name="Home" component={Home} />

          {/* Garages and Locations */}
          <Stack.Screen name="Locations" component={Locations} />
          <Stack.Screen name="RecommendedServices" component={RecommendedServices} />
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
          <Stack.Screen name="DetailedBill" component={DetailedBill} />
          <Stack.Screen name="PaidServiceBillSummary" component={PaidServiceBillSummary} />
          <Stack.Screen name="Appointment" component={Appointment} />

          {/* Forum */}
          {/* <Stack.Screen name="Forum" component={Forum} />
          <Stack.Screen name="SearchPosts" component={SearchPosts} />
          <Stack.Screen name="CreatePost" component={CreatePost} />
          <Stack.Screen name="ForumDetail" component={ForumDetail} />
          <Stack.Screen name="ForumProfile" component={ForumProfile} />
          <Stack.Screen name="NotificationForum" component={NotificationForum} />
          <Stack.Screen name="ForumNotificationDetails" component={ForumNotificationDetails} />
          <Stack.Screen name="ForumViewProfile" component={ForumViewProfile} /> */}

          {/* Profile */}
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="PrivacySettings" component={PrivacySettings} />
          <Stack.Screen name="Help" component={Help} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
          <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
          <Stack.Screen name="LoginActivity" component={LoginActivity} />
          <Stack.Screen name="ActiveSession" component={ActiveSession} />
          <Stack.Screen name="SupportChat" component={SupportChat} />
          <Stack.Screen name="faq" component={faq} />
          <Stack.Screen name="FaqAnswer" component={FaqAnswer} />

          {/* Market Place */}
          {/* <Stack.Screen name="Carts" component={Carts} />
          <Stack.Screen name="MarketPlace" component={MarketPlace} />
          <Stack.Screen name="OrderDetails" component={OrderDetails} />
          <Stack.Screen name="ProductDetails" component={ProductDetails} />
          <Stack.Screen name="PurchaseHistory" component={PurchaseHistory} />
          <Stack.Screen name="RecommendedProduct" component={RecommendedProduct} />
          <Stack.Screen name="FavouriteProducts" component={FavouriteProducts} />
          <Stack.Screen name="TrackOrder" component={TrackOrder} /> */}

          {/* Cars */}
          <Stack.Screen name="Cars" component={Cars} />
          <Stack.Screen name="CarDetails" component={CarDetails} />
          <Stack.Screen name="EditCarDetails" component={EditCarDetails} />
          <Stack.Screen name="CarOnboarding" component={CarOnboarding} />
          <Stack.Screen name="CarProducts" component={CarProducts} />
          <Stack.Screen name="CarServices" component={CarServices} />
          <Stack.Screen name="MileageTracking" component={MileageTracking} />

          {/* Appintments */} 
          <Stack.Screen name="Reservations" component={Reservations} />
          <Stack.Screen name="InspectionResults" component={InspectionResults} />
          <Stack.Screen name="PartsSelection" component={PartsSelection} />
          <Stack.Screen name="ChatBox" component={ChatBox} />
          <Stack.Screen name="InspectionCar" component={InspectionCar} />
          <Stack.Screen name="InspectionResultSelected" component={InspectionResultSelected} />
          <Stack.Screen name="SelectedParts" component={SelectedParts} />
          <Stack.Screen name="ServiceProgress" component={ServiceProgress} />

          {/* Rewards */}
          {/* <Stack.Screen name="Rewards" component={Rewards} />
          <Stack.Screen name="RewardHistory" component={RewardHistory} /> */}

          {/* Technician */}
          <Stack.Screen name="TechnicianHome" component={TechnicianHome}/>
          <Stack.Screen name="AssignedWork" component={AssignedWork}/>
          <Stack.Screen name="WorkOrderDetails" component={WorkOrderDetails}/>
          <Stack.Screen name="TechnicianInspection" component={TechnicianInspection}/>
          <Stack.Screen name="TechnicianPartsSelection" component={TechnicianPartsSelection}/>
          <Stack.Screen name="Work" component={Work}/>
          <Stack.Screen name="Inventory" component={Inventory}/>
          <Stack.Screen name="CreatingWroks" component={CreatingWroks}/>
          <Stack.Screen name="ChangeWorks" component={ChangeWorks}/>
          <Stack.Screen name="WorkProgress" component={WorkProgress}/>
          <Stack.Screen name="TestDrive" component={TestDrive}/>
          <Stack.Screen name="Search" component={Search}/>
          <Stack.Screen name="TechnicianPofile" component={TechnicianPofile}/>
          <Stack.Screen name="TechnicianEditPofile" component={TechnicianEditPofile}/>
          <Stack.Screen name="WorkHistory" component={WorkHistory}/>
          <Stack.Screen name="SelectedProduct" component={SelectedProduct}/>
          <Stack.Screen name="SelectedWork" component={SelectedWork}/>
          <Stack.Screen name="CompleteWork" component={CompleteWork}/>

        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

export default App;
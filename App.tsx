import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider, useAuth } from "./src/context/AuthContext";

// Screens
import TechnicianHome from "./src/screens/Technician/TechnicianHome";
import WorkOrderListScreen from "./src/screens/Technician/WorkOrderList";
import WorkOrderDetailsScreen from "./src/screens/Technician/WorkOrderDetails";
import InspectionListScreen from "./src/screens/Technician/InspectionList";
import InspectionDetailsScreen from "./src/screens/Technician/InspectionReport";
import InspectionReportScreen from "./src/screens/Technician/InspectionReport";
import ProfileScreen from "./src/screens/Technician/Profile";
import LoginScreen from "./src/screens/Technician/Login";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null; // optional: show splash screen

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Home" component={TechnicianHome} />
          <Stack.Screen name="WorkOrderList" component={WorkOrderListScreen} />
          <Stack.Screen name="WorkOrderDetails" component={WorkOrderDetailsScreen} />
          <Stack.Screen name="InspectionList" component={InspectionListScreen} />
          <Stack.Screen name="InspectionDetails" component={InspectionDetailsScreen} />
          <Stack.Screen name="InspectionReport" component={InspectionReportScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

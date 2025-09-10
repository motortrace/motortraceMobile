import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import TechnicianHome from "./src/screens/Technician/TechnicianHome";
import WorkOrderListScreen from "./src/screens/Technician/WorkOrderList";
import WorkOrderDetailsScreen from "./src/screens/Technician/WorkOrderDetails";
import InspectionListScreen from "./src/screens/Technician/InspectionList";
import InspectionDetailsScreen from "./src/screens/Technician/InspectionReport";
import InspectionReportScreen from "./src/screens/Technician/InspectionReport";
import ProfileScreen from "./src/screens/Technician/Profile";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Home */}
        <Stack.Screen
          name="Home"
          component={TechnicianHome}
          options={{ headerShown: false }}
        />

        {/* Work Orders */}
        <Stack.Screen
          name="WorkOrderList"
          component={WorkOrderListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="WorkOrderDetails"
          component={WorkOrderDetailsScreen}
          options={{ headerShown: false }}
        />

        {/* Inspections */}
        <Stack.Screen
          name="InspectionList"
          component={InspectionListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InspectionDetails"
          component={InspectionDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InspectionReport"
          component={InspectionReportScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

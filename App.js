import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainPage from "./pages/Main";
import AddPage from "./components/screens/AddPage";
import ProfilePage from "./pages/ProfilePage";
import {ProfileViewPage} from "./pages/ProfileViewPage";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainPage" component={MainPage} />
        <Stack.Screen name="AddPage" component={AddPage} />
        <Stack.Screen name="ProfileView" component={ProfileViewPage} />
        <Stack.Screen name="ProfileEdit" component={ProfilePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";
import MainPage from "./pages/Main";
import AddPage from "./components/screens/AddPage";
import ProfilePage from "./pages/ProfilePage";
import { ProfileViewPage } from "./pages/ProfileViewPage";
import ChatPage from "./pages/ChatPage";
import SupportPage from "./pages/SupportPage";
import LoginPage from "./pages/LogIn";
import {RootStackParamList} from "./pages/types";
import FlashMessage from "react-native-flash-message";
enableScreens();

const Stack = createNativeStackNavigator<RootStackParamList>();
const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginPage"
        screenOptions={{
          headerShown: false, // Header ishlatilmaydi
        }}
      >
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="MainPage" component={MainPage} />
        <Stack.Screen name="AddPage" component={AddPage} />
        <Stack.Screen name="ProfileView" component={ProfileViewPage} />
        <Stack.Screen name="ProfileEdit" component={ProfilePage} />
        <Stack.Screen name="Chat" component={ChatPage} />
        <Stack.Screen name="Support" component={SupportPage} />
      </Stack.Navigator>
      <FlashMessage
          position="top"
          style={{
            top: 40,
            marginHorizontal: 20,
            borderRadius: 12,
            overflow: "hidden",
          }}
      />
    </NavigationContainer>
  );
};

export default App;

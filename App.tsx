import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";

// Faollashtiramiz, shunda topHeaderHeightChange xatosi yo'qoladi
enableScreens();

// Sahifalarni import qilamiz
import MainPage from "./pages/Main";
import AddPage from "./components/screens/AddPage";
import ProfilePage from "./pages/ProfilePage";
import { ProfileViewPage } from "./pages/ProfileViewPage";
import ChatPage from "./pages/ChatPage";
import SupportPage from "./pages/SupportPage";

// Stack parametrlari (TypeScript uchun)
export type RootStackParamList = {
  MainPage: undefined;
  AddPage: undefined;
  ProfileView: undefined;
  ProfileEdit: undefined;
  Chat: undefined;
  Support: undefined;
};

// Stack yaratamiz
const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainPage"
        screenOptions={{
          headerShown: false, // Header ishlatilmaydi
        }}
      >
        <Stack.Screen name="MainPage" component={MainPage} />
        <Stack.Screen name="AddPage" component={AddPage} />
        <Stack.Screen name="ProfileView" component={ProfileViewPage} />
        <Stack.Screen name="ProfileEdit" component={ProfilePage} />
        <Stack.Screen name="Chat" component={ChatPage} />
        <Stack.Screen name="Support" component={SupportPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

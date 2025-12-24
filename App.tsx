import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";
import {
  Platform,
  StatusBar,
  View,
  StyleSheet,
  AppState,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage from "react-native-flash-message";

import { ThemeProvider, useTheme } from "./theme/ThemeContext";

import MainPage from "./pages/Tasks/Main";
import AddPage from "./components/screens/AddPage";
import ProfilePage from "./pages/Profile/ProfilePage";
import { ProfileViewPage } from "./pages/Profile/ProfileViewPage";
import ChatPage from "./pages/chats/ChatPage";
import SupportPage from "./pages/SupportPage";
import Business from "./pages/Business/Business";
import LoginPage from "./pages/LogIn";
import LoginCodePage from "./pages/LoginCodePage";
import IncomeAndExpenses from "./pages/Business/IncomeAndExpenses";
import DescStyle from "./pages/Tasks/DescStyle";

import { RootStackParamList } from "./pages/types/types";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import ViewTask from "./pages/Tasks/ViewTask";
import HomePage from "./pages/HomePage";
import HabitsPage from "./pages/Habits/HabitsPage";
import {GestureHandlerRootView} from "react-native-gesture-handler";

enableScreens();

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const navigationRef = React.useRef<any>(null);
  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList | null>(null);
  const lastTimeRef = React.useRef<number>(Date.now());
  const { theme } = useTheme();

  const navigationTheme = {
      dark: theme.isDark,
      colors: {
        ...(theme.isDark
          ? NavigationDarkTheme.colors
          : NavigationDefaultTheme.colors),
        background: theme.background,
        card: theme.card,
        text: theme.text,
        border: theme.border,
        primary: theme.primary,
      },
  };

  useEffect(() => {
    let lastState = AppState.currentState;

    const sub = AppState.addEventListener("change", async (nextState) => {
      if (global.filePickerOpen) return;
      if (nextState === "background" || nextState === "inactive") {
        lastTimeRef.current = Date.now();
      }
      if (lastState !== "active" && nextState === "active") {
        const diff = Date.now() - lastTimeRef.current;
        if (diff > 10000) { // 10 sekunddan ko'p background bo'lsa
          const activeUserStr = await AsyncStorage.getItem("activeUser");
          const activeUser = activeUserStr ? JSON.parse(activeUserStr) : null;
          if (activeUser?.passwordCode) {
            navigationRef.current?.navigate("LoginCodePage");
          }
        }
      }
      lastState = nextState;
    });
    return () => sub.remove();
  }, []);
  useEffect(() => {
  (async () => {
    try {
      const activeUsername = await AsyncStorage.getItem("activeUser");
      const usersStr = await AsyncStorage.getItem("users");
      const users = usersStr ? JSON.parse(usersStr) : [];
      const activeUser = users.find((u: any) => u.username === activeUsername);

      if (!activeUser) {
        setInitialRoute("LoginPage");
        return;
      }

      if (activeUser.passwordCode) {
        setInitialRoute("LoginCodePage");
      } else {
        setInitialRoute("MainPage");
      }
    } catch (e) {
      setInitialRoute("LoginPage");
    }
  })();
}, []);
  if (!initialRoute) return null;
  return (
    <>
      <StatusBar
        barStyle={theme.isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <View style={{ flex: 1, backgroundColor: theme.background }}>
          <NavigationContainer ref={navigationRef} theme={navigationTheme}>
            <Stack.Navigator
              initialRouteName={initialRoute}
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="LoginCodePage" component={LoginCodePage} />
              <Stack.Screen name="LoginPage" component={LoginPage} />
              <Stack.Screen name="HomePage" component={HomePage} />
              <Stack.Screen name="MainPage" component={MainPage} />
              <Stack.Screen name="ProfileView" component={ProfileViewPage} />
              <Stack.Screen name="ProfileEdit" component={ProfilePage} />
              <Stack.Screen name="Chat" component={ChatPage} />
              <Stack.Screen name="Support" component={SupportPage} />
              <Stack.Screen name="Habits" component={HabitsPage} />
              <Stack.Screen name="Business" component={Business} />
              <Stack.Screen name="AddPage" component={AddPage} />
              <Stack.Screen name="ViewTask" component={ViewTask} />
              <Stack.Screen name="DescStyle" component={DescStyle} />
              <Stack.Screen name="IncomeAndExpenses" component={IncomeAndExpenses} />
            </Stack.Navigator>

            <View style={styles.flashWrapper}>
              <FlashMessage position="top" style={styles.flashBox} />
            </View>
          </NavigationContainer>
      </View>
    </>
  );
};
const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <AppNavigator/>
        </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;

const styles = StyleSheet.create({
  flashWrapper: {
    position: "absolute",
    top: 37,
    width: "100%",
    zIndex: 9999,
  },
  flashBox: {
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    opacity: 0.95,
  },
});

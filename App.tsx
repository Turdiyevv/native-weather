import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";
import { StatusBar, View, StyleSheet, AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage from "react-native-flash-message";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";

import { ThemeProvider, useTheme } from "./theme/ThemeContext";

import LoginPage from "./pages/LogIn";
import LoginCodePage from "./pages/LoginCodePage";
import MainTabs from "./navigation/MainTabs";

import { RootStackParamList } from "./pages/types/types";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {ProfileViewPage} from "./pages/Profile/ProfileViewPage";
import AddHabit from "./pages/Habits/AddHabit";
import AddPage from "./components/screens/AddPage";
import ViewTask from "./pages/Tasks/ViewTask";
import DescStyle from "./pages/Tasks/DescStyle";
import IncomeAndExpenses from "./pages/Business/IncomeAndExpenses";
import ProfilePage from "./pages/Profile/ProfilePage";
import SupportPage from "./pages/SupportPage";

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

  // const onNavigationStateChange = () => {
  //   const currentRoute = navigationRef.current?.getCurrentRoute();
  //   console.log('Current Route Name:', currentRoute?.name);
  // };

  useEffect(() => {
    (async () => {
      await Notifications.requestPermissionsAsync();
    })();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", async (nextState) => {
      if (global.filePickerOpen || global.ignoreNextAppState) {
        if (nextState === "active") {
          global.ignoreNextAppState = false;
          lastTimeRef.current = Date.now();
        }
        return;
      }

      if (nextState === "background" || nextState === "inactive") {
        lastTimeRef.current = Date.now();
      }

      if (nextState === "active") {
        const diff = Date.now() - lastTimeRef.current;

        if (diff > 10000) {
          try {
            const activeUsername = await AsyncStorage.getItem("activeUser");
            const usersStr = await AsyncStorage.getItem("users");

            if (!activeUsername || !usersStr) return;

            const users = JSON.parse(usersStr);
            const activeUser = users.find(
              (u: any) => u.username === activeUsername
            );

            if (activeUser?.passwordCode) {
              navigationRef.current?.navigate("LoginCodePage");
            }
          } catch (err) {
            console.log("AppState lock error:", err);
          }
        }
      }
    });
    return () => subscription.remove();
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
          setInitialRoute("MainTabs");
        }
      } catch (e) {
        setInitialRoute("LoginPage");
      }
    })();
  }, []);

  if (!initialRoute) return null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
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
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="ProfileView" component={ProfileViewPage} />
            <Stack.Screen name="ProfileEdit" component={ProfilePage} />
            <Stack.Screen name="Support" component={SupportPage} />
            <Stack.Screen name="AddHabit" component={AddHabit} />
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
    </SafeAreaView>
  );
};

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
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
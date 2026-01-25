import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Animated } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeContext";

import MainPage from "../pages/Tasks/Main";
import DoneTask from "../pages/Tasks/doneTask";
import DeleteTask from "../pages/Tasks/deleteTask";
import CustomHeader from "../components/Task/CustomHeader";
import LeftMenu from "../components/global/MenuBar";

const Tab = createMaterialTopTabNavigator();

// --- MAXSUS CUSTOM TAB BAR ---
function MyTabBar({ state, descriptors, navigation, theme }: any) {
  return (
    <View style={[styles.tabContainer, { backgroundColor: theme.background }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            activeOpacity={0.7}
            style={[
              styles.tabItem,
              { borderBottomColor: isFocused ? theme.primary : "transparent" }
            ]}
          >
            <Text
              style={{
                color: isFocused ? theme.primary : theme.text,
                fontWeight: "600",
                fontSize: 15,
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TopTabs({ navigation }: any) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ flex: 1 }}>
        <CustomHeader onProfilePress={() => navigation.navigate("ProfileView")} />

        <Tab.Navigator
          // tabBarLabel ishlamayotgani uchun uni o'zimiz chizamiz
          tabBar={(props) => <MyTabBar {...props} theme={theme} />}
          screenOptions={{
            swipeEnabled: true, // Swipe yumshoqligi saqlanib qoladi
            lazy: true,
          }}
        >
          <Tab.Screen
            name="Tasks"
            component={MainPage}
            options={{ tabBarLabel: "Barchasi" }}
          />
          <Tab.Screen
            name="DoneTask"
            component={DoneTask}
            options={{ tabBarLabel: "Bajarilgan" }}
          />
          <Tab.Screen
            name="DeleteTask"
            component={DeleteTask}
            options={{ tabBarLabel: "O'chirilgan" }}
          />
        </Tab.Navigator>
      </View>

      {/* Pastki menyu */}
      <View style={[styles.footerWrapper, { paddingBottom: insets.bottom + 8 }]}>
        <LeftMenu
          buttons={[
            { icon: "create-outline", onPress: () => navigation.navigate("AddPage"), size: 20, color: theme.primary },
            { icon: "person-outline", onPress: () => navigation.navigate("ProfileView"), size: 20, color: theme.text },
          ]}
          containerStyle={{ width: "100%" }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    height: 50,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 3, // Faol tab chizig'i
  },
  footerWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "transparent",
  },
});

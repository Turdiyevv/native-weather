import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "../theme/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";

import TopTabs from "./TopTabs";
import HabitsPage from "../pages/Habits/HabitsPage";
import Business from "../pages/Business/Business";
import Earnings from "../pages/Earnings/Earnings";
import {ProfileViewPage} from "../pages/Profile/ProfileViewPage";
import ChatPage from "../pages/chats/ChatPage";

const Tab = createMaterialTopTabNavigator();

function MyTabBar({ state, descriptors, navigation, theme }: any) {
  const tabs = [
    { name: "TopTabs", icon: "layers-outline", label: "Tasks" },
    { name: "Habits", icon: "checkmark-circle-outline", label: "Habits" },
    { name: "Business", icon: "briefcase-outline", label: "Business" },
    { name: "Chat", icon: "chatbox-ellipses-outline", label: "Chat" },
    { name: "Earnings", icon: "wallet-outline", label: "Earnings" },
    { name: "Profile", icon: "person-outline", label: "Profile" },
  ];

  return (
    <View style={[styles.tabContainer, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: state.routes[index].key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(tab.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.tabItem}
          >
            <Ionicons
              name={tab.icon as any}
              size={24}
              color={isFocused ? theme.primary : theme.text}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function MainTabs() {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Tab.Navigator
        tabBar={(props) => <MyTabBar {...props} theme={theme} />}
        tabBarPosition="bottom"
        screenOptions={{
          swipeEnabled: false,
          lazy: true,
        }}
      >
        <Tab.Screen name="TopTabs" component={TopTabs} />
        <Tab.Screen name="Habits" component={HabitsPage} />
        <Tab.Screen name="Business" component={Business} />
        <Tab.Screen name="Chat" component={ChatPage} />
        <Tab.Screen name="Earnings" component={Earnings} />
        <Tab.Screen name="Profile" component={ProfileViewPage} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    height: 50,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
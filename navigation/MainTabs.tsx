import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "../theme/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useNavigation } from "@react-navigation/native";
import TopTabs from "./TopTabs";
import HabitsPage from "../pages/Habits/HabitsPage";
import Business from "../pages/Business/Business";
import Earnings from "../pages/Earnings/Earnings";
// import {ProfileViewPage} from "../pages/Profile/ProfileViewPage";
import ChatPage from "../pages/chats/ChatPage";
import CustomHeader from "../components/Task/CustomHeader";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../pages/types/types";

const Tab = createMaterialTopTabNavigator();

function MyTabBar({ state, navigation, theme }: any) {
  const tabs = [
    { name: "TopTabs", icon: "file-tray-full-outline", label: "Tasks" },
    { name: "Habits", icon: "checkbox-outline", label: "Habits" },
    { name: "Business", icon: "podium-outline", label: "Business" },
    { name: "Chat", icon: "chatbox-ellipses-outline", label: "Chat" },
    { name: "Earnings", icon: "wallet-outline", label: "Earnings" },
  ];

  return (
    <View style={[styles.tabContainer, { backgroundColor: theme.card }]}>
        <View
            style={[
              styles.topIndicator,
              {
                backgroundColor: theme.primary,
                left: `${state.index * 20}%`, // 5 ta tab → 20%
              },
            ]}
        />
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
            style={[
                styles.tabItem, { backgroundColor: isFocused ? theme.tabCard : null }
            ]}
          >
            <Ionicons
              name={tab.icon as any}
              size={24}
              color={isFocused ? theme.primary : theme.text}
              style={{
                transform: [{ scale: isFocused ? 1.15 : 1 }]
              }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export default function MainTabs() {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader onProfilePress={() => navigation.navigate("ProfileView")} />
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
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    height: 50,
    shadowColor: "#000",
    position: "relative",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabItem: {
    borderRadius: 7,
    margin: 5,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: 'relative',
  },
  topIndicator: {
    position: 'absolute',
    top: 0,
    width: '20%',
    height: 2,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
});
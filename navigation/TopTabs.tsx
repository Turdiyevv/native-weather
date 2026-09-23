// TopTabs.tsx
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Animated } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "../theme/ThemeContext";

import MainPage from "../pages/Tasks/Main";
import DoneTask from "../pages/Tasks/doneTask";
import DeleteTask from "../pages/Tasks/deleteTask";
import LeftMenu from "../components/global/MenuBar";
import {useScroll} from "../utills/useScroll";
import { ScrollContext } from "../utills/ScrollContext";
import { useLanguage } from "../i18n/LanguageContext";

const Tab = createMaterialTopTabNavigator();

function MyTabBar({ state, descriptors, navigation, theme }: any) {
  return (
    <View style={[styles.tabContainer, { backgroundColor: theme.background }]}>
      <View style={[styles.tabInner, { backgroundColor: theme.card, borderColor: theme.border }]}>
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
              activeOpacity={0.8}
              style={[
                styles.tabItem,
                {
                  backgroundColor: isFocused ? theme.tabCard : "transparent",
                  borderBottomColor: isFocused ? theme.primary : "transparent",
                }
              ]}
            >
              <Text
                style={{
                  color: isFocused ? theme.primary : theme.subText,
                  fontWeight: "700",
                  fontSize: 14,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
export default function TopTabs({ navigation }: any) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { handleScroll, footerTranslateY } = useScroll();

  return (
    <ScrollContext.Provider value={{ handleScroll }}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <Tab.Navigator
          tabBar={(props) => <MyTabBar {...props} theme={theme} />}
          screenOptions={{
            swipeEnabled: true,
            lazy: true,
          }}
        >
          <Tab.Screen
            name="Tasks"
            component={MainPage}
            options={{ tabBarLabel: t("current") }}
          />
          <Tab.Screen
            name="DoneTask"
            component={DoneTask}
            options={{ tabBarLabel: t("completed") }}
          />
          <Tab.Screen
            name="DeleteTask"
            component={DeleteTask}
            options={{ tabBarLabel: t("archive") }}
          />
        </Tab.Navigator>

        <Animated.View
          style={[
            styles.footerWrapper,
            {
              transform: [{ translateY: footerTranslateY }]
            }
          ]}
        >
          <LeftMenu
            buttons={[
              { icon: "add-outline", onPress: () => navigation.navigate("AddPage"), text: t("add"), size: 20, color: theme.primary },
              { icon: "person-outline", onPress: () => navigation.navigate("ProfileView"), size: 20, color: theme.primary },
            ]}
            containerStyle={{ width: "100%" }}
          />
        </Animated.View>
      </View>
    </ScrollContext.Provider>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 6,
  },
  tabInner: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 3,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    height: 42,
  },
  footerWrapper: {
    right: "5%",
    marginHorizontal: 5,
    position: "absolute",
    bottom: 0,
    marginBottom: 5,
    width: "auto",
    backgroundColor: "transparent",
  },
});
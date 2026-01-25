import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "../theme/ThemeContext";

import MainPage from "../pages/Tasks/Main";
import DoneTask from "../pages/Tasks/doneTask";
import DeleteTask from "../pages/Tasks/deleteTask";
import CustomHeader from "../components/Task/CustomHeader";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import {StyleSheet, View} from "react-native";
import LeftMenu from "../components/global/MenuBar";

const Tab = createMaterialTopTabNavigator();

export default function TopTabs({navigation}: any) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <CustomHeader onProfilePress={() => navigation.navigate("ProfileView")} />

        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: theme.primary,
            tabBarInactiveTintColor: theme.text,
            tabBarIndicatorStyle: {
              backgroundColor: theme.primary,
              height: 3,
              borderRadius: 1.5,
            },
            tabBarStyle: {
              backgroundColor: theme.background,
              borderBottomWidth: 1,
              borderBottomColor: theme.card,
              elevation: 0,
              shadowOpacity: 0,
            },
            tabBarLabelStyle: {
              fontSize: 15,
              fontWeight: "600",
              textTransform: "none",
            },
            tabBarItemStyle: {
              paddingVertical: 0,
            },
            swipeEnabled: true,
          }}
        >
          <Tab.Screen
            name="Tasks"
            component={MainPage}
            options={{
              tabBarLabel: "Barchasi",
            }}
          />

          <Tab.Screen
            name="DoneTask"
            component={DoneTask}
            options={{
              tabBarLabel: "Bajarilgan"
            }}
          />

          <Tab.Screen
            name="DeleteTask"
            component={DeleteTask}
            options={{
              tabBarLabel: "O'chirilgan"
            }}
          />
        </Tab.Navigator>
      </View>

      <View style={styles.wrapper}>
        <LeftMenu
          buttons={[
            {
              icon: "create-outline",
              onPress: () => navigation.navigate("AddPage"),
              size: 20,
              marginLeft: "auto",
              color: "transparent"
            },
            {
              icon: "person-outline",
              onPress: () => navigation.navigate("ProfileView"),
              size: 20,
              color: "transparent"
            },
          ]}
          containerStyle={{ width: "100%", paddingBottom: insets.bottom + 8 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 5,
    flexDirection: "row",
    width: "100%",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    backgroundColor: "rgba(18,18,18,0.001)",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "../theme/ThemeContext";

import MainPage from "../pages/Tasks/Main";
import DoneTask from "../pages/Tasks/doneTask";
import DeleteTask from "../pages/Tasks/deleteTask";
import CustomHeader from "../components/Task/CustomHeader";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import {StyleSheet,View, Text} from "react-native";
import LeftMenu from "../components/global/MenuBar";
import {NavigationContainer} from "@react-navigation/native";

const Tab = createMaterialTopTabNavigator();

export default function TopTabs({navigation}: any) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ flex: 1, backgroundColor: theme.background }}>
        <CustomHeader onProfilePress={() => navigation.navigate("ProfileView")} />
          <Tab.Navigator>
            <Tab.Screen
              name="Tasks"
              component={MainPage}
              options={{
                tabBarLabel: ({ focused }) => (
                  <Text
                    style={{
                      color: focused ? theme.primary : theme.text,
                      fontWeight: "600",
                    }}
                  >
                    Barchasi
                  </Text>
                ),
              }}
            />

            <Tab.Screen
              name="DoneTask"
              component={DoneTask}
              options={{ tabBarLabel: "Bajarilgan" }}
            />

            <Tab.Screen
              name="DeleteTask"
              component={DeleteTask}
              options={{ tabBarLabel: "O‘chirilgan" }}
            />
          </Tab.Navigator>
      </View>

        <View style={[styles.wrapper]}>
            <LeftMenu
              buttons={[
                { icon: "create-outline", onPress: () => navigation.navigate("AddPage"), size: 20, marginLeft: "auto", color: "transparent"},
                { icon: "person-outline", onPress: () => navigation.navigate("ProfileView"), size: 20, color: "transparent" },
              ]}
              containerStyle={{ width: "100%", paddingBottom: insets.bottom + 8 }}
            />
        </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  wrapper: {
      marginHorizontal:5,
      flexDirection: "row",
      width: "100%",
    // position: "absolute",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    backgroundColor: "rgba(18,18,18,0.001)",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

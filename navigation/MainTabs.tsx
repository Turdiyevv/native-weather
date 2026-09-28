import { useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Modal, Pressable, BackHandler, Text } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "../theme/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMenuState } from "../utills/MenuStateContext";

import { useNavigation } from "@react-navigation/native";
import TasksScreen from "../pages/Tasks/TasksScreen";
import HabitsPage from "../pages/Habits/HabitsPage";
import Business from "../pages/Business/Business";
import CustomHeader from "../components/Task/CustomHeader";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../pages/types/types";
import { useLanguage } from "../i18n/LanguageContext";

const Tab = createMaterialTopTabNavigator();

function MyTabBar({ state, navigation, theme, onActiveTitleChange }: any) {
  const { t } = useLanguage();
  const tabs = [
    { name: "TopTabs", icon: "file-tray-full-outline", label: t("tasks") },
    { name: "Habits", icon: "checkbox-outline", label: t("habits") },
    { name: "Business", icon: "podium-outline", label: t("business") },
    // { name: "Chat", icon: "chatbox-ellipses-outline", label: t("chat") },
    // { name: "Earnings", icon: "wallet-outline", label: t("earnings") },
  ];

  useEffect(() => {
    onActiveTitleChange(tabs[state.index]?.label);
  }, [onActiveTitleChange, state.index]);

  return (
    <View style={[styles.tabContainer, { backgroundColor: theme.background }]}>
      <View style={[styles.tabShell, { backgroundColor: theme.card, borderColor: theme.border }]}>
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
              activeOpacity={0.85}
              style={[
                  styles.tabItem,
                  { backgroundColor: isFocused ? theme.tabCard : "transparent" }
              ]}
            >
              <Ionicons
                name={tab.icon as any}
                size={24}
                color={isFocused ? theme.primary : theme.subText}
                style={{
                  transform: [{ scale: isFocused ? 1.12 : 1 }]
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export default function MainTabs() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const navigation = useNavigation<NavigationProp>();
  const { setHamburgerMenuOpen, taskMenuOpen } = useMenuState();
  
  const [activeTitle, setActiveTitle] = useState(t("tasks"));
  const [menuVisible, setMenuVisible] = useState(false);

  // Hamburger menu state'ni context'ga pass qilish
  useEffect(() => {
    setHamburgerMenuOpen(menuVisible);
  }, [menuVisible, setHamburgerMenuOpen]);

  // Context menu ochilganda hamburger menu yopilsin
  useEffect(() => {
    if (taskMenuOpen && menuVisible) {
      setMenuVisible(false);
    }
  }, [taskMenuOpen, menuVisible]);

  // Back button behavior - agar hamburger menu ochilgan bo'lsa yopish, yopiq bo'lsa default
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (menuVisible) {
        setMenuVisible(false);
        return true; // Yana back event chiqmasini oldini olish
      }
      return false; // Default behavior - pop/go back
    });

    return () => backHandler.remove();
  }, [menuVisible]);
  return (
    <View style={{ flex: 1 }}>
      <CustomHeader
        title={activeTitle}
        onProfilePress={() => navigation.navigate("ProfileView")}
        onMenuPress={() => setMenuVisible(true)}
      />
      
      {/* Hamburger Menu Modal */}
      <Modal transparent={true} visible={menuVisible} animationType="none">
        <Pressable 
          style={[styles.menuOverlay, { backgroundColor: theme.background }]} 
          onPress={() => setMenuVisible(false)}
        >
          <View 
            style={[styles.menuPanel, { backgroundColor: theme.card, borderColor: theme.border }]}
            onStartShouldSetResponder={() => true}
          >
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate("ProfileView");
                setMenuVisible(false);
              }}
            >
              <Ionicons name="person-outline" size={20} color={theme.text} />
              <Text style={[styles.menuItemText, { color: theme.text }]}>{t("profileEdit")}</Text>
            </TouchableOpacity>
            
            <View style={[styles.menuDivider, { backgroundColor: theme.border }]} />
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                navigation.navigate("SupportPage");
                setMenuVisible(false);
              }}
            >
              <Ionicons name="help-circle-outline" size={20} color={theme.text} />
              <Text style={[styles.menuItemText, { color: theme.text }]}>{t("about")}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Tab.Navigator
        tabBar={(props) => (
          <MyTabBar {...props} theme={theme} onActiveTitleChange={setActiveTitle} />
        )}
        tabBarPosition="bottom"
        screenOptions={{
          swipeEnabled: true,
          lazy: true,
        }}
      >
        <Tab.Screen name="TopTabs" component={TasksScreen} />
        <Tab.Screen name="Habits" component={HabitsPage} />
        <Tab.Screen name="Business" component={Business} />
        {/* <Tab.Screen name="Chat" component={ChatPage} /> */}
        {/* <Tab.Screen name="Earnings" component={Earnings} /> */}
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    paddingHorizontal: 12,
    paddingBottom: 10,
    paddingTop: 8,
  },
  tabShell: {
    flexDirection: "row",
    height: 58,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
  },
  tabItem: {
    borderRadius: 14,
    margin: 5,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: 'relative',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-start",
    paddingTop: 60,
  },
  menuPanel: {
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: "500",
  },
  menuDivider: {
    height: 1,
    marginHorizontal: 16,
  },
});
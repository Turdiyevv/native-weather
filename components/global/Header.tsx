import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {CommonActions, useNavigation} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../pages/types/types";
import { useTheme } from "../../theme/ThemeContext";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface HeaderProps {
  title: string | any;
  onBack?: () => void;
  isBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, isBack }) => {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "MainTabs" }],
          })
        );
      }
    }
  };

  return (
    <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        { isBack && (
          <TouchableOpacity onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
        )}
      <Text style={[styles.headerTitle, { color: theme.text }]}>{title}</Text>
      <View style={{ width: 24 }} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    // borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
});

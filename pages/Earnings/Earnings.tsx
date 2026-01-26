import React, {useEffect} from "react";
import {View, Text, StyleSheet, Image, BackHandler} from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import Header from "../../components/global/Header";
import AdminIcon from "../../assets/admin_icon.png";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import {RootStackParamList} from "../types/types";
import {NativeStackNavigationProp} from "@react-navigation/native-stack"; // placeholder icon

type EarningsNav = NativeStackNavigationProp<RootStackParamList, "Habits">;
const Earnings: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<EarningsNav>();

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Earnings" />
      <View style={styles.empty}>
        <Image source={AdminIcon} style={styles.icon} />
        <Text style={[styles.description, { color: theme.text }]}>
          Ishga tushirilish uchun qayta ishlanmoqda
        </Text>
      </View>
    </View>
  );
};

export default Earnings;

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  icon: { width: 160, height: 160, resizeMode: "contain", marginBottom: 20 },
  description: { fontSize: 16, textAlign: "center" },
});

import React, {useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Image,
    BackHandler,
    KeyboardAvoidingView,
    ScrollView,
    Platform, TouchableOpacity
} from 'react-native';
import AdminIcon from "../../assets/admin_icon.png";
import {RootStackParamList} from "../types/types";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useTheme} from "../../theme/ThemeContext";
import {Ionicons} from "@expo/vector-icons";

type SupportNav = NativeStackNavigationProp<RootStackParamList, "Business">;
export default function IncomeAndExpenses({route}) {
    const { selectedDate } = route.params;
    const date = new Date(selectedDate);
    const { theme } = useTheme();
  const navigation = useNavigation<SupportNav>();

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Business");
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View style={[styles.container, {backgroundColor:theme.background}]}>
        <View style={[styles.content, {backgroundColor:theme.background}]}>
          <Text style={[styles.mainTitle,{color:theme.text}]}>
            {date.toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.exchangeBar}>
            <TouchableOpacity style={[styles.exchangeBtn, { backgroundColor: theme.card}]}>
                <View style={styles.exchangeContent}>
                  <Text style={{ color: theme.text, borderColor: theme.border }}>Kirim</Text>
                  <Ionicons style={styles.scale} name={"trending-down-outline"} size={24} color={"#50C878"}/>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.exchangeBtn, { backgroundColor: theme.card}]}>
                <View style={styles.exchangeContent}>
                  <Text style={{ color: theme.text, borderColor: theme.border }}>Chiqim</Text>
                  <Ionicons name={"trending-up-outline"} size={24} color={"#EB4C42"}/>
                </View>
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    scale:{
        transform: [{ scaleX: -1}],
    },
  container: {
      paddingHorizontal: 20,
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 30,
  },
  mainTitle: {
    fontSize: 16,
    textAlign: "center",
  },
  exchangeBar: {
    flexDirection: "row",
    height: 56,
    bottom: 20
  },
  exchangeBtn: {
    flex: 1,
    fontSize: 16,
    borderRadius:10,
    marginHorizontal:2,
    alignItems: "center",
    justifyContent: "center",
  },
  exchangeContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
  },
});


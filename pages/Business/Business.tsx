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
    Platform
} from 'react-native';
import AdminIcon from "../../assets/admin_icon.png";
import {RootStackParamList} from "../types/types";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useTheme} from "../../theme/ThemeContext";
import Calendar from "../../components/global/Calendar";
import Header from "../../components/global/Header";
import {SafeAreaView} from "react-native-safe-area-context";

type SupportNav = NativeStackNavigationProp<RootStackParamList, "Business">;
export default function BackdropFilterExample() {
    const { theme } = useTheme();
  const navigation = useNavigation<SupportNav>();

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
      <SafeAreaView style={{flex: 1}}>
        <KeyboardAvoidingView
          style={[styles.container, {backgroundColor:theme.background}]}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <Header title={"Beznis"}/>
          {/*<ScrollView*/}
          {/*  contentContainerStyle={styles.scrollContainer}*/}
          {/*  keyboardShouldPersistTaps="handled"*/}
          {/*>*/}
            <View style={styles.header}>
              <Image source={AdminIcon} style={styles.icon} />
              <Text style={[styles.description, {color: theme.text}]}>
                Bu yerda biznesingiz bo'yicha qulay hisobotlar yig'ishingiz mumkin.
              </Text>
            </View>
          {/*</ScrollView>*/}
            <View style={{marginHorizontal:20, marginBottom: 50}}>
                <Calendar/>
            </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 15,
  },
  icon: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    color: "#555",
  }
});

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
import AdminIcon from "../assets/admin_icon.png";
import {RootStackParamList} from "./types/types";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

type SupportNav = NativeStackNavigationProp<RootStackParamList, "Bussiness">;
export default function BackdropFilterExample() {
  const navigation = useNavigation<SupportNav>();

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("ProfileView");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Image source={AdminIcon} style={styles.icon} />
          <Text style={styles.description}>
            Bu yerda biznesingiz bo'yicha qulay hisobotlar yig'ishingiz mumkin.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
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

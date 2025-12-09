import React, {useEffect, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
  BackHandler,
} from "react-native";
import AdminIcon from "../assets/admin_icon.png";

import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {RootStackParamList} from "./types";

type SupportNav = NativeStackNavigationProp<RootStackParamList, "Support">;

const SupportPage: React.FC = () => {
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image source={AdminIcon} style={styles.icon} />
          <Text style={styles.description}>
            Bu ilova sizning kundalik vazifalaringizni boshqarish va eslatmalarni kuzatishda yordam beradi.
          </Text>
          <Text style={styles.description}>Bog'lanmoqchi bo'lsangiz xabar qoldiring!</Text>

          <TouchableOpacity onPress={() => Linking.openURL("https://t.me/Anonim_life_msgbot")}>
            <Text style={[styles.link, { textDecorationLine: "underline" }]}>
              Telegram orqali
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SupportPage;

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
  },
  link: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 15,
    color: "orange",
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  textArea: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: "top",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButton: {
    width: "100%",
    backgroundColor: "#121",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

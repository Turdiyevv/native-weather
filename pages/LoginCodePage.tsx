import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, Alert } from "react-native";
import PasswordCodeInput from "../components/PasswordCodeInput";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import ConfirmModal from "../components/ConfirmModal";

export default function LoginCodePage({ navigation }: any) {
  const [statusTitle, setStatusTitle] = useState("");
  const [statusColor, setStatusColor] = useState("");
  const [resetCode, setResetCode] = useState(false);
  const [borderStyle, setBorderStyle] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  // === BACK BUTTON HANDLER WITH EXIT DIALOG ===
  useFocusEffect(
    useCallback(() => {
    const backAction = () => {
      setModalVisible(true);
      return true;
    };
      const handler = BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => handler.remove();
    }, [])
  );
  // === CODE CHECK ===
  const handleCode = async (code: string) => {

    const usersStr = await AsyncStorage.getItem("users");
    const users = usersStr ? JSON.parse(usersStr) : [];

    const matchedUser = users.find((u: any) => u.passwordCode === code);

    if (matchedUser) {
      await AsyncStorage.setItem("activeUser", JSON.stringify(matchedUser));
      setStatusTitle("✔ Tasdiqlandi");
      setStatusColor("green");
      setBorderStyle({ borderColor: "green" });
      setResetCode(false);

      setTimeout(() => {
        setBorderStyle({});
        setResetCode(true);
        setStatusTitle("");
        setStatusColor("");
        navigation.replace("MainPage");
      }, 600);
    } else {
      setStatusTitle("✖ Tasdiqlanmadi");
      setBorderStyle({ borderColor: "#ff5353" });
      setStatusColor("#ff5353");
      setResetCode(false);

      setTimeout(() => {
        setBorderStyle({});
        setResetCode(true);
        setStatusTitle("");
        setStatusColor("");
      }, 600);
    }
  };

  return (
    <View style={styles.container}>
      <PasswordCodeInput
        onComplete={handleCode}
        title={statusTitle}
        color={statusColor}
        status={resetCode}
        autoSubmit={true}
        borderStyle={borderStyle}
      />

      <TouchableOpacity
        style={styles.closeBox}
        onPress={() => navigation.replace("LoginPage")}
      >
        <Text style={styles.closeBoxText}>Username orqali kirish (Registratsiya)</Text>
      </TouchableOpacity>
        <ConfirmModal
          visible={modalVisible}
          message="Ilovadan chiqmoqchimisiz?"
          onConfirm={() => {
            setModalVisible(false);
            BackHandler.exitApp();
          }}
          onCancel={() => setModalVisible(false)}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
  closeBox: {
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 7,
    borderColor: "orange",
    fontSize: 17,
    marginTop: 16,
    justifyContent: "center",
    alignSelf: "center",
  },
  closeBoxText: {
    color: "orange",
    fontSize: 17,
    fontWeight: "500",
  },
});

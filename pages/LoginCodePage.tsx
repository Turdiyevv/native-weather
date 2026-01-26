import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from "react-native";
import PasswordCodeInput from "../components/global/PasswordCodeInput";
import { useFocusEffect } from "@react-navigation/native";
import ConfirmModal from "../components/global/ConfirmModal";
import { loadUsers, setActiveUser } from "../service/storage";
import { User } from "./types/userTypes";
import {useTheme} from "../theme/ThemeContext";

export default function LoginCodePage({ navigation }: any) {
  const { theme } = useTheme();
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
    try {
      const users: User[] = await loadUsers();
      const matchedUser = users.find((u) => u.passwordCode === code);

      if (matchedUser) {
        // activeUser ni storage ga qo'yish
        await setActiveUser(matchedUser.username);

        setStatusTitle("✔ Tasdiqlandi");
        setStatusColor("green");
        setBorderStyle({ borderColor: "green" });
        setResetCode(false);

        setTimeout(() => {
          setBorderStyle({});
          setResetCode(true);
          setStatusTitle("");
          setStatusColor("");
          navigation.replace("MainTabs");
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
    } catch (err) {
      console.log("handleCode error:", err);
      setStatusTitle("Xatolik yuz berdi");
      setStatusColor("red");
      setBorderStyle({ borderColor: "red" });
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
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <PasswordCodeInput
        onComplete={handleCode}
        title={statusTitle}
        color={statusColor}
        status={resetCode}
        autoSubmit={true}
        borderStyle={borderStyle}
        secureTextEntry={true}
      />

      <TouchableOpacity
        style={styles.closeBox}
        onPress={() => navigation.replace("LoginPage")}
      >
        <Text style={styles.closeBoxText}>Username orqali kirish</Text>
        <Text style={styles.closeBoxText}>(Registratsiya)</Text>
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
    paddingVertical: 3,
    paddingHorizontal: 35,
    borderRadius: 7,
    fontSize: 17,
    marginTop: 16,
  },
  closeBoxText: {
    color: "orange",
    fontSize: 17,
    fontWeight: "500",
  },
});

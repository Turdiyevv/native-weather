import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, BackHandler, Image } from "react-native";
import PasswordCodeInput from "../components/global/PasswordCodeInput";
import { useFocusEffect } from "@react-navigation/native";
import ConfirmModal from "../components/global/ConfirmModal";
import { loadUsers, setActiveUser } from "../service/storage";
import { User } from "./types/userTypes";
import { useTheme } from "../theme/ThemeContext";
import AdminIcon from "../assets/admin_icon.png";

export default function LoginCodePage({ navigation }: any) {
  const { theme } = useTheme();
  const [statusTitle, setStatusTitle] = useState("");
  const [statusColor, setStatusColor] = useState("");
  const [resetCode, setResetCode] = useState(false);
  const [borderStyle, setBorderStyle] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleCode = async (code: string) => {
    try {
      const users: User[] = await loadUsers();
      const matchedUser = users.find((u) => u.passwordCode === code);

      if (matchedUser) {
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
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Image source={AdminIcon} style={styles.logo} />
        <Text style={[styles.title, { color: theme.text }]}>Xavfsizlik kodi</Text>
        <Text style={[styles.subtitle, { color: theme.subText }]}>Kodni kiriting</Text>

        <PasswordCodeInput
          onComplete={handleCode}
          title={statusTitle}
          color={statusColor}
          status={resetCode}
          autoSubmit={true}
          borderStyle={borderStyle}
          secureTextEntry={true}
        />
      </View>

      <TouchableOpacity style={styles.closeBox} onPress={() => navigation.replace("LoginPage")}>
        <Text style={[styles.closeBoxText, { color: theme.primary }]}>Username orqali kirish</Text>
        <Text style={[styles.closeBoxText, { color: theme.primary }]}>(Registratsiya)</Text>
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
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 20, paddingVertical: 24 },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 6,
  },
  logo: { width: 90, height: 90, alignSelf: "center", marginBottom: 14 },
  title: { fontSize: 28, fontWeight: "800", textAlign: "center" },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 20 },
  closeBox: { alignItems: "center", marginTop: 20 },
  closeBoxText: { fontSize: 16, fontWeight: "600", marginTop: 2, textAlign: "center" },
});

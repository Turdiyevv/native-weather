import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PasswordCodeInput from "../components/PasswordCodeInput";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginCodePage({ navigation }: any) {
  const [statusTitle, setStatusTitle] = useState("");
  const [statusColor, setStatusColor] = useState("");
  const [resetCode, setResetCode] = useState(false);

  const handleCode = async (code: string) => {
    const usersStr = await AsyncStorage.getItem("users");
    const users = usersStr ? JSON.parse(usersStr) : [];

    const matchedUser = users.find((u: any) => u.passwordCode === code);

    if (matchedUser) {
      await AsyncStorage.setItem("activeUser", JSON.stringify(matchedUser));
      setStatusTitle("✔ Tasdiqlandi");
      setStatusColor("green");
      setResetCode(false);
      setTimeout(() => {
        setResetCode(true);
        setStatusTitle("");
        setStatusColor("");
        navigation.replace("MainPage");
      }, 800);
    } else {
      setStatusTitle("✖ Tasdiqlanmadi");
      setStatusColor("red");
      setResetCode(false);
      setTimeout(() => {
        setResetCode(true);
        setStatusTitle("");
        setStatusColor("");
      }, 800);
    }
  };

  return (
    <View style={styles.container}>
      <PasswordCodeInput
        onComplete={handleCode}
        title={statusTitle}
        color={statusColor}
        status={resetCode}
      />
      <TouchableOpacity onPress={() => navigation.replace("LoginPage")}>
        <Text style={styles.closeBox}>Username orqali kirish</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 20 },
  closeBox: {
    color: "orange",
    fontSize: 17,
    marginTop: 8,
    justifyContent: "center",
    marginHorizontal: "auto",
  },
});

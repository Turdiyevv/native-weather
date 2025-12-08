import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView, BackHandler
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import TextField from "../components/TextField";
import ConfirmModal from "../components/ConfirmModal";
import {maskPassword} from "../utills/utill";

export default function LoginPage({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCode, setPasswordCode] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [pass, setPass] = useState("");

  useEffect(() => {
    const loadCount = async () => {
      const storedUsers = await AsyncStorage.getItem("users");
      setUserCount(storedUsers ? JSON.parse(storedUsers).length : 0);
    };
    loadCount();
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      navigation.replace("LoginCodePage");
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );
    return () => backHandler.remove();
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      return;
    }
    if (username.trim().length < 6 || password.trim().length < 6) {
      return;
    }
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      let users = storedUsers ? JSON.parse(storedUsers) : [];
      const existingUser = users.find((u: any) => u.username === username);
      if (!existingUser && users.length >= 3) {
        showMessage({
          message: "User topilmadi. Yangi user yaratish imkoni ham yo'q!",
          type: "warning",
          icon: "warning",
        });
        return;
      }
      if (!existingUser && users.length < 3) {
        setModalVisible(true);
        return;
      }
      if (existingUser && existingUser.password !== password) {
        setPass(maskPassword(existingUser.password));
        setTimeout(() => {setPass("")}, 3000);
        showMessage({
          message: "Password noto‘g‘ri!",
          type: "danger",
          icon: "danger",
        });
        return;
      }
      const userToSet = existingUser || null;
      if (userToSet) {
        await AsyncStorage.setItem("activeUser", JSON.stringify(userToSet));
        navigation.replace("MainPage");
        showMessage({
          message: "Muvaffaqiyatli kirish!",
          type: "success",
          icon: "success",
        });
      }
    } catch (error) {
      showMessage({
        message: String(error),
        type: "danger",
        icon: "danger",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Xush kelibsiz!</Text>
          <View style={styles.countBox}>
            <Text style={styles.count}>Hisoblar: {userCount} / 3</Text>
            <Text style={styles.pass}> {pass}</Text>
          </View>
          <TextField
            label="username"
            value={username}
            onChangeText={setUsername}
            required
            minLength={6}
          />
          <TextField
            label={"password"}
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            required
            minLength={6}
          />
          <TouchableOpacity style={styles.btn} onPress={handleLogin}>
            <Text style={styles.btnText}>Kirish</Text>
          </TouchableOpacity>
        </View>
        <ConfirmModal
          visible={modalVisible}
          message="Yangi hisob yaratilsinmi?"
          onConfirm={async () => {
            setModalVisible(false);
            const storedUsers = await AsyncStorage.getItem("users");
            let users = storedUsers ? JSON.parse(storedUsers) : [];

            const newUser = {
              username,
              password,
              passwordCode,
              userinfo: {
                firstName: "",
                lastName: "",
                avatar: "",
                phone: "",
                job: "",
                description: "",
              },
              usertasks: [],
            };
            users.push(newUser);
            await AsyncStorage.setItem("users", JSON.stringify(users));
            await AsyncStorage.setItem("activeUser", JSON.stringify(newUser));
            setUserCount(users.length);
            navigation.replace("MainPage");
            showMessage({
              message: "Yangi user yaratildi!",
              type: "success",
              icon: "success",
            });
          }}
          onCancel={() => setModalVisible(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 30 },
  title: { fontSize: 32, fontWeight: "700", marginBottom: 10, textAlign: "center" },
  countBox: { flexDirection: "row", alignItems:"center", justifyContent: "center", marginBottom: 20 },
  pass:{color: "orange", fontSize: 11, marginLeft: 2},
  count: { color: "#555", fontSize: 16 },
  btn: { backgroundColor: "#121", paddingVertical: 12, borderRadius: 10, marginTop: 20 },
  btnText: { color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "600" },
});

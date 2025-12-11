import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  BackHandler
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showMessage } from "react-native-flash-message";
import TextField from "../components/TextField";
import ConfirmModal from "../components/ConfirmModal";
import { maskPassword } from "../utills/utill";

export default function LoginPage({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCode, setPasswordCode] = useState("");
  const [userCount, setUserCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [pass, setPass] = useState("");

  // 🔹 Userlar sonini yuklash
  useEffect(() => {
    const loadCount = async () => {
      const users = await AsyncStorage.getItem("users");
      setUserCount(users ? JSON.parse(users).length : 0);
    };
    loadCount();
  }, []);

  // 🔹 Back handler
  useEffect(() => {
    const onBackPress = () => {
      navigation.replace("LoginCodePage");
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => backHandler.remove();
  }, []);

  const handleLogin = async () => {
    const cleanUsername = username.trim().replace(/\s+/g, "");
    const cleanPassword = password.trim().replace(/\s+/g, "");

    if (!cleanUsername || !cleanPassword) return;
    if (cleanUsername.length < 6 || cleanPassword.length < 6) return;

    try {
      const storedUsers = await AsyncStorage.getItem("users");
      let users = storedUsers ? JSON.parse(storedUsers) : [];

      // 🔹 MUHIM TUZATISH: cleanUsername bilan izlash
      const existingUser = users.find((u: any) => u.username === cleanUsername);

      // 🔹 Topilmasa va limit to‘la
      if (!existingUser && users.length >= 3) {
        showMessage({
          message: "User topilmadi. Yangi user yaratish imkoni yo'q!",
          type: "warning",
        });
        return;
      }

      // 🔹 Topilmasa lekin yaratish mumkin
      if (!existingUser && users.length < 3) {
        setModalVisible(true);
        return;
      }

      // 🔹 Parol noto‘g‘ri
      if (existingUser.password !== cleanPassword) {
        setPass(maskPassword(existingUser.password));
        setTimeout(() => setPass(""), 3000);

        showMessage({
          message: "Password noto‘g‘ri!",
          type: "danger",
        });
        return;
      }

      // 🔹 Muvaffaqiyatli kirish
      await AsyncStorage.setItem("activeUser", JSON.stringify(existingUser));
      navigation.replace("MainPage");

      showMessage({
        message: "Muvaffaqiyatli kirish!",
        type: "success",
      });

    } catch (e) {
      showMessage({ message: String(e), type: "danger", icon: "danger" });
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
            <Text style={styles.pass}>{pass}</Text>
          </View>

          <TextField
            label="Username"
            placeholder="Bo'sh joylarsiz kiriting !"
            value={username}
            onChangeText={setUsername}
            minLength={6}
            required
          />

          <TextField
            placeholder="Bo'sh joylarsiz kiriting !"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            minLength={6}
            required
          />

          <TouchableOpacity style={styles.btn} onPress={handleLogin}>
            <Text style={styles.btnText}>Kirish</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.closeBox}
            onPress={() => navigation.replace("LoginCodePage")}
          >
            <Text style={styles.closeBoxText}>Parol orqali kirish</Text>
          </TouchableOpacity>
        </View>

        {/* Yangi user yaratish MODAL */}
        <ConfirmModal
          visible={modalVisible}
          message="Yangi hisob yaratilsinmi?"
          onConfirm={async () => {
            setModalVisible(false);

            const storedUsers = await AsyncStorage.getItem("users");
            let users = storedUsers ? JSON.parse(storedUsers) : [];

            const newUser = {
              username: username.trim(),
              password: password.trim(),
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

            // 🔹 count-ni yangilash
            setUserCount(users.length);

            navigation.replace("MainPage");

            showMessage({
              message: "Yangi user yaratildi!",
              type: "success",
            });
          }}
          onCancel={() => setModalVisible(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  closeBox: {
    borderWidth: 1,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 7,
    borderColor: "orange",
    marginTop: 16,
  },
  closeBoxText: {
    color: "orange",
    fontSize: 17,
  },
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 30 },
  title: { fontSize: 32, fontWeight: "700", marginBottom: 10, textAlign: "center" },
  countBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  pass: { color: "orange", fontSize: 11, marginLeft: 2 },
  count: { color: "#555", fontSize: 16 },
  btn: {
    backgroundColor: "#121",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  btnText: { color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "600" },
});

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
import { showMessage } from "react-native-flash-message";
import TextField from "../components/TextField";
import ConfirmModal from "../components/ConfirmModal";
import { User, UserInfo } from "./types/userTypes";
import {
  loadUsers,
  saveUsers,
  setActiveUser,
  addUser,
  getActiveUser
} from "../service/storage";
import {useTheme} from "../theme/ThemeContext";

export default function LoginPage({ navigation }: any) {
  const { theme } = useTheme();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userCount, setUserCount] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [pass, setPass] = useState<string>("");

  // 🔹 Load users count
  useEffect(() => {
    const loadCount = async () => {
      const users = await loadUsers();
      setUserCount(users.length);
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

    if (!cleanUsername || !cleanPassword) {
      showMessage({ message: "Username va Password kiriting!", type: "warning" });
      return;
    }
    if (cleanUsername.length < 6 || cleanPassword.length < 6) {
      showMessage({ message: "Minimum 6 ta belgi bo'lishi kerak!", type: "warning" });
      return;
    }

    const users = await loadUsers();
    const existingUser = users.find((u) => u.username === cleanUsername);

    // 🔹 Topilmasa va limit to'la
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
    if (existingUser!.password !== cleanPassword) {
      setPass(existingUser!.password.replace(/./g, "•"));
      setTimeout(() => setPass(""), 3000);

      showMessage({
        message: "Password noto‘g‘ri!",
        type: "danger",
      });
      return;
    }

    // 🔹 Muvaffaqiyatli kirish
    await setActiveUser(existingUser!.username);
    navigation.replace("MainPage");

    showMessage({
      message: "Muvaffaqiyatli kirish!",
      type: "success",
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[styles.container]}>
          <Text style={[styles.title, {color: theme.text}]}>Xush kelibsiz!</Text>

          <View style={styles.countBox}>
            <Text style={[styles.count, {color: theme.text}]}>Hisoblar: {userCount} / 3</Text>
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
            secureTextEntry={true}
            minLength={6}
            required
          />

          <TouchableOpacity style={[styles.btn, {backgroundColor: theme.card}]} onPress={handleLogin}>
            <Text style={[styles.btnText, {color: theme.text}]}>Kirish</Text>
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

            const users = await loadUsers();

            const newUser: User = {
              username: username.trim(),
              password: password.trim(),
              passwordCode: "",
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

            await addUser(newUser);
            await setActiveUser(newUser.username);

            setUserCount(users.length + 1);

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
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 7,
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
  count: {fontSize: 16 },
  btn: {
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  btnText: { textAlign: "center", fontSize: 18, fontWeight: "600" },
});

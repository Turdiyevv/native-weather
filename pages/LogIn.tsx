import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  BackHandler,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import TextField from "../components/global/TextField";
import ConfirmModal from "../components/global/ConfirmModal";
import { User } from "./types/userTypes";
import {
  loadUsers,
  setActiveUser,
  addUser,
} from "../service/storage";
import { useTheme } from "../theme/ThemeContext";
import { useLanguage } from "../i18n/LanguageContext";
import LanguageSelector from "../components/global/LanguageSelector";

export default function LoginPage({ navigation }: any) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userCount, setUserCount] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [pass, setPass] = useState<string>("");

  useEffect(() => {
    const loadCount = async () => {
      const users = await loadUsers();
      setUserCount(users.length);
    };
    loadCount();
  }, []);

  useEffect(() => {
    const onBackPress = () => {
      navigation.replace("LoginCodePage");
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => backHandler.remove();
  }, [navigation]);

  const handleLogin = async () => {
    const cleanUsername = username.trim().replace(/\s+/g, "");
    const cleanPassword = password.trim().replace(/\s+/g, "");

    if (!cleanUsername || !cleanPassword) {
      showMessage({ message: `${t("username")} va ${t("password")} kiriting!`, type: "warning" });
      return;
    }
    if (cleanUsername.length < 6 || cleanPassword.length < 6) {
      showMessage({ message: "Minimum 6 ta belgi bo'lishi kerak!", type: "warning" });
      return;
    }

    const users = await loadUsers();
    const existingUser = users.find((u) => u.username === cleanUsername);

    if (!existingUser && users.length >= 3) {
      showMessage({
        message: "User topilmadi. Yangi user yaratish imkoni yo'q!",
        type: "warning",
      });
      return;
    }

    if (!existingUser && users.length < 3) {
      setModalVisible(true);
      return;
    }

    if (existingUser!.password !== cleanPassword) {
      setPass(existingUser!.password.replace(/./g, "•"));
      setTimeout(() => setPass(""), 3000);

      showMessage({ message: `${t("password")} noto‘g‘ri!`, type: "danger" });
      return;
    }

    await setActiveUser(existingUser!.username);
    navigation.replace("MainTabs");
    showMessage({ message: "Muvaffaqiyatli kirish!", type: "success" });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.languagePosition}><LanguageSelector /></View>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>{t("welcome")}</Text>
          <Text style={[styles.subtitle, { color: theme.subText }]}>{t("loginSubtitle")}</Text>

          <View style={[styles.countBox, { backgroundColor: theme.tabCard, borderColor: theme.border }]}> 
            <Text style={[styles.count, { color: theme.text }]}>{t("accounts")}: {userCount} / 3</Text>
            <Text style={[styles.pass, { color: theme.primary }]}>{pass}</Text>
          </View>

          <View style={styles.formWrapper}>
            <TextField
              label={t("username")}
              placeholder={t("noSpaces")}
              value={username}
              onChangeText={setUsername}
              minLength={6}
              required
            />

            <TextField
              placeholder={t("noSpaces")}
              label={t("password")}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              minLength={6}
              required
            />
          </View>

          <TouchableOpacity style={[styles.btn, { backgroundColor: theme.primary }]} onPress={handleLogin}>
            <Text style={styles.btnText}>{t("login")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeBox} onPress={() => navigation.replace("LoginCodePage")}>
            <Text style={[styles.closeBoxText, { color: theme.primary }]}>{t("passwordLogin")}</Text>
          </TouchableOpacity>
        </View>

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
            navigation.replace("MainTabs");
            showMessage({ message: "Yangi user yaratildi!", type: "success" });
          }}
          onCancel={() => setModalVisible(false)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  languagePosition: { position: "absolute", top: 18, right: 18, zIndex: 2 },
  screen: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 22 },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  title: { fontSize: 30, fontWeight: "800", textAlign: "center" },
  subtitle: { marginTop: 6, textAlign: "center", fontSize: 14 },
  countBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 20,
    marginBottom: 16,
  },
  count: { fontSize: 15, fontWeight: "600" },
  pass: { fontSize: 11, fontWeight: "700" },
  formWrapper: { width: "100%" },
  btn: {
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 18,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 5,
  },
  btnText: { textAlign: "center", color: "#fff", fontSize: 18, fontWeight: "700" },
  closeBox: { alignItems: "center", marginTop: 18 },
  closeBoxText: { fontSize: 16, fontWeight: "600" },
});

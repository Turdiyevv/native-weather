import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  BackHandler,
  Image,
  Modal,
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/types";
import { logout } from "../../utills/LogOut";
import { Ionicons } from "@expo/vector-icons";
import ConfirmModal from "../../components/global/ConfirmModal";
import { showMessage } from "react-native-flash-message";
import PasswordCodeInput from "../../components/global/PasswordCodeInput";
import {
  getActiveUser,
  deleteUser,
  loadUsers,
  saveUsers,
  setActiveUser,
} from "../../service/storage";
import { useTheme } from "../../theme/ThemeContext";
import { exportTasksAsTxt } from "../../service/exportTasks";
import Header from "../../components/global/Header";
import ImageViewing from "react-native-image-viewing";
import { useLanguage } from "../../i18n/LanguageContext";
import LanguageSelector from "../../components/global/LanguageSelector";

type ProfileViewNavProp = NativeStackNavigationProp<RootStackParamList, "ProfileView">;

export function ProfileViewPage() {
  const { theme, setTheme, themeName } = useTheme();
  const { t } = useLanguage();
  const navigation = useNavigation<ProfileViewNavProp>();
  const [user, setUser] = useState<any>(null);
  const avatarAnim = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [, setPasswordCode] = useState("");
  const [statusTitle, setStatusTitle] = useState("");
  const [statusColor, setStatusColor] = useState("");
  const [passwordBoxVisible, setPasswordBoxVisible] = useState(false);
  const [borderStyle, setBorderStyle] = useState({});

  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const images = user?.avatar
    ? [{ uri: user.avatar }]
    : [];

  const loadAllUsers = async () => {
    const allUsers = await loadUsers();
    setUsers(allUsers || []);
  };

  const loadActiveUser = async () => {
    try {
      const active = await getActiveUser();
      if (!active) return;
      const profile = active.userinfo || {};
      setUser({
        username: active.username,
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        avatar: profile.avatar || "",
        phone: profile.phone || "",
        job: profile.job || "",
        description: profile.description || "",
      });
    } catch (e) {
      showMessage({ message: "Foydalanuvchini yuklashda xatolik", type: "danger" });
    }
  };

  useEffect(() => {
    loadAllUsers();
    loadActiveUser();

    const unsubscribe = navigation.addListener("focus", () => {
      loadAllUsers();
      loadActiveUser();
    });

    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        })
      );
      return true;
    });

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, [navigation]);

  useEffect(() => {
    Animated.timing(avatarAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [avatarAnim]);

  const switchActiveUser = async (username: string) => {
    const selectedUser = users.find((u) => u.username === username);
    if (!selectedUser) return;
    const activeUser = await getActiveUser();
    if (activeUser && activeUser.username === selectedUser.username) return;
    await setActiveUser(selectedUser.username);
    await loadActiveUser();
    showMessage({ message: `${username} foydalanuvchi aktiv qilindi`, type: "success" });
  };

  const deleteAccount = async () => {
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user) return;
    await deleteUser(user.username);
    setDeleteModalVisible(false);
    showMessage({ message: "Hisob muvaffaqiyatli o‘chirildi!", type: "success" });
    navigation.replace("LoginPage");
  };

  const openPasswordBox = () => {
    setPasswordBoxVisible(!passwordBoxVisible);
  };

  const removePasswordCode = async () => {
    const activeUser = await getActiveUser();
    if (!activeUser) return;
    const users = await loadUsers();
    const currentUser = users.find((u) => u.username === activeUser.username);
    if (!currentUser) return;
    if (!currentUser.passwordCode) {
      showMessage({ message: "Tezkor kod mavjud emas!", type: "warning" });
      return;
    }
    const updatedUsers = users.map((u) =>
      u.username === activeUser.username ? { ...u, passwordCode: null } : u
    );
    await saveUsers(updatedUsers);
    showMessage({ message: "Tezkor kod o‘chirildi!", type: "success" });
  };

  const openPreview = (uri: string) => {
    const index = images.findIndex((img) => img.uri === uri);
    if (index >= 0) {
      setPreviewIndex(index);
      setViewerVisible(true);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}> 
      <Header
        title={t("profileInfo")}
        isBack={true}
        onBack={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "MainTabs" }] }))}
      />

      <View style={styles.languagePosition}>
        <LanguageSelector />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.heroCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Animated.View style={{ opacity: avatarAnim, transform: [{ scale: avatarAnim }] }}>
            {user?.avatar ? (
              <TouchableOpacity onPress={() => openPreview(user.avatar)}>
                <Image style={styles.avatar} source={{ uri: user.avatar }} />
              </TouchableOpacity>
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person-circle-outline" size={110} color={theme.placeholder} />
              </View>
            )}
          </Animated.View>

          <Text style={[styles.name, { color: theme.text }]}>{user?.firstName || "User"} {user?.lastName || ""}</Text>
          <Text style={[styles.username, { color: theme.subText }]}>@{user?.username}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.primaryAction, { backgroundColor: theme.primary }]}
              onPress={() => navigation.navigate("ProfileEdit")}
            >
              <Ionicons name="pencil" size={16} color="#fff" />
              <Text style={styles.primaryActionText}>{t("profileEdit")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.secondaryAction, { backgroundColor: theme.tabCard, borderColor: theme.border }]}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="log-out" size={16} color={theme.danger} />
              <Text style={[styles.secondaryActionText, { color: theme.danger }]}>{t("logout")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t("profileInfo")}</Text>
          <InfoRow label={t("phone")} value={user?.phone || "-"} theme={theme} />
          <InfoRow label={t("job")} value={user?.job || "-"} theme={theme} />
          <InfoRow label={t("note")} value={user?.description || "-"} theme={theme} />
        </View>

        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t("users")}</Text>
          <View style={styles.userWrap}>
            {users.map((u) => (
              <TouchableOpacity
                key={u.username}
                style={[
                  styles.userChip,
                  {
                    backgroundColor: user?.username === u.username ? theme.primary : theme.tabCard,
                    borderColor: user?.username === u.username ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => switchActiveUser(u.username)}
              >
                <Text style={{ color: user?.username === u.username ? "#fff" : theme.text }}>@{u.username}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t("settings")}</Text>

          <TouchableOpacity style={styles.settingRow} onPress={openPasswordBox}>
            <Text style={[styles.settingText, { color: theme.text }]}>{t("quickCode")}</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.subText} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate("Support")}>
            <Text style={[styles.settingText, { color: theme.text }]}>{t("about")}</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.subText} />
          </TouchableOpacity>

          <View style={styles.settingRow}>
            <Text style={[styles.settingText, { color: theme.text }]}>{t("deleteCode")}</Text>
            <TouchableOpacity onPress={removePasswordCode}>
              <Text style={[styles.actionLink, { color: theme.danger }]}>{t("delete")}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.themeBox}>
            {[
              { key: "dark", label: t("dark") },
              { key: "light", label: t("light") },
              { key: "blue", label: t("blue") },
              { key: "orange", label: t("orange") },
            ].map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.themeBtn,
                  {
                    backgroundColor: themeName === item.key ? theme.primary : theme.tabCard,
                    borderColor: themeName === item.key ? theme.primary : theme.border,
                  },
                ]}
                onPress={() => setTheme(item.key as any)}
              >
                <Text style={{ color: themeName === item.key ? "#fff" : theme.text }}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={exportTasksAsTxt} style={[styles.downloadButton, { borderColor: theme.primary }]}>
            <Text style={{ color: theme.primary, fontWeight: "700" }}>{t("exportTasks")}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={deleteAccount} style={styles.deleteButton}>
            <Text style={{ color: theme.danger, fontWeight: "700" }}>{t("deleteAccount")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ImageViewing
        images={images}
        imageIndex={previewIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
      />

      <Modal
        visible={passwordBoxVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPasswordBoxVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <PasswordCodeInput
              onComplete={async (code: string) => {
                setPasswordCode(code);
                const activeUser = await getActiveUser();
                if (!activeUser) return;
                const allUsers = await loadUsers();
                const isTaken = allUsers.some((u) => u.username !== activeUser.username && u.passwordCode === code);
                if (isTaken) {
                  setStatusTitle("⚠ Allaqachon egallangan");
                  setBorderStyle({ borderColor: "orange" });
                  setStatusColor("orange");
                  setTimeout(() => {
                    setBorderStyle({});
                    setStatusTitle("");
                    setStatusColor("");
                  }, 1000);
                  return;
                }
                const updatedUsers = allUsers.map((u) =>
                  u.username === activeUser.username ? { ...u, passwordCode: code } : u
                );
                await saveUsers(updatedUsers);
                setStatusTitle("✔ Tasdiqlandi");
                setBorderStyle({ borderColor: "green" });
                setStatusColor("green");
                setTimeout(() => {
                  setBorderStyle({});
                  setStatusTitle("");
                  setStatusColor("");
                  setPasswordBoxVisible(false);
                }, 1000);
              }}
              title={statusTitle}
              color={statusColor}
              autoSubmit={false}
              borderStyle={borderStyle}
            />
            <TouchableOpacity style={styles.modalClose} onPress={() => setPasswordBoxVisible(false)}>
              <Text style={[styles.modalCloseText, { color: theme.danger }]}>Yopish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ConfirmModal
        visible={modalVisible}
        message="Ishonchingiz komilmi?"
        onConfirm={() => {
          logout();
          setModalVisible(false);
        }}
        onCancel={() => setModalVisible(false)}
      />

      <ConfirmModal
        visible={deleteModalVisible}
        message="Hisobni butunlay o‘chirmoqchimisiz?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </View>
  );
}

function InfoRow({ label, value, theme }: { label: string; value: string; theme: any }) {
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: theme.subText }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  languagePosition: { alignItems: "flex-end", paddingHorizontal: 16, paddingTop: 4 },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 28, paddingTop: 8 },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: "#fff" },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "rgba(148, 163, 184, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  name: { marginTop: 12, fontSize: 26, fontWeight: "800" },
  username: { fontSize: 14, marginTop: 4 },
  actionRow: { flexDirection: "row", marginTop: 18, width: "100%", gap: 10 },
  primaryAction: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius: 14, paddingVertical: 12 },
  primaryActionText: { color: "#fff", fontWeight: "700", marginLeft: 8 },
  secondaryAction: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", borderRadius: 14, borderWidth: 1, paddingVertical: 12 },
  secondaryActionText: { fontWeight: "700", marginLeft: 8 },
  section: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 14,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
  infoRow: { paddingVertical: 8 },
  infoLabel: { fontSize: 12, fontWeight: "600", marginBottom: 3 },
  infoValue: { fontSize: 15, fontWeight: "600" },
  userWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  userChip: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148,163,184,0.18)",
  },
  settingText: { fontSize: 15, fontWeight: "600" },
  actionLink: { fontWeight: "700" },
  themeBox: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 12 },
  themeBtn: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  downloadButton: {
    borderWidth: 1,
    borderRadius: 14,
    marginTop: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  deleteButton: { marginTop: 14, alignItems: "center", paddingVertical: 12 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
  },
  modalClose: { marginTop: 18, alignItems: "center" },
  modalCloseText: { fontSize: 16, fontWeight: "700" },
});

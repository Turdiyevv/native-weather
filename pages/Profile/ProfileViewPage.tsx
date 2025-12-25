import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  BackHandler,
  Image
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
  saveUsers, setActiveUser
} from "../../service/storage";
import { useTheme } from "../../theme/ThemeContext";
import { exportTasksAsTxt } from "../../service/exportTasks";
import Header from "../../components/global/Header";
import ImageViewing from "react-native-image-viewing";

const screenWidth = Dimensions.get("window").width;

type ProfileViewNavProp = NativeStackNavigationProp<RootStackParamList, "ProfileView">;

export function ProfileViewPage() {
  const { theme } = useTheme();
  const navigation = useNavigation<ProfileViewNavProp>();
  const [user, setUser] = useState<any>(null);
  const avatarAnim = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [passwordCode, setPasswordCode] = useState("");
  const [statusTitle, setStatusTitle] = useState("");
  const [statusColor, setStatusColor] = useState("");
  const [passwordBoxVisible, setPasswordBoxVisible] = useState(false);
  const [borderStyle, setBorderStyle] = useState({});
  const { setTheme } = useTheme();

  const [files, setFiles] = useState<any[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [viewerVisible, setViewerVisible] = useState(false);

  const images = user?.avatar ? [{ uri: user.avatar }, ...files.filter(f => f.type?.includes("image")).map(f => ({ uri: f.uri }))] : files.filter(f => f.type?.includes("image")).map(f => ({ uri: f.uri }));

  const [users, setUsers] = useState<any[]>([]); // Barcha users
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
      passwordCode: active.passwordCode || ""
    });
  } catch (e) {
    showMessage({
      message: "Foydalanuvchini yuklashda xatolik",
      type: "danger",
    });
  }
};

// Page load va focus
    useEffect(() => {
      loadAllUsers();
      loadActiveUser();

      const unsubscribe = navigation.addListener("focus", () => {
        loadAllUsers();
        loadActiveUser();
      });
      // Hardware Back button ishlashi
      const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "MainPage" }],
          })
        );
        return true; // eventni boshqa komponentga yubormaslik
      });

      return () => {
        unsubscribe();
        backHandler.remove();
      };
    }, []);

    const switchActiveUser = async (username: string) => {
      const selectedUser = users.find(u => u.username === username);
      if (!selectedUser) return;
      const activeUser = await getActiveUser();
      if (activeUser.username == selectedUser.username) {return}
      await setActiveUser(selectedUser.username);
      await loadActiveUser();
      showMessage({
        message: `${username} foydalanuvchi aktiv qilindi`,
        type: "success",
      });
    };

  useEffect(() => {
    loadActiveUser();
    const unsubscribe = navigation.addListener("focus", loadActiveUser);

    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "MainPage" }],
        })
      );
      return true;
    });

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, []);

  const deleteAccount = async () => {
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!user) return;
    await deleteUser(user.username);
    setDeleteModalVisible(false);
    showMessage({
      message: "Hisob muvaffaqiyatli o‘chirildi!",
      type: "success",
    });
    navigation.replace("LoginPage");
  };

  const openPasswordBox = async () => {
    setPasswordBoxVisible(!passwordBoxVisible);
  }

  const removePasswordCode = async () => {
    const activeUser = await getActiveUser();
    if (!activeUser) return;
    const users = await loadUsers();
    const updatedUsers = users.map(u =>
      u.username === activeUser.username
        ? { ...u, passwordCode: null }
        : u
    );
    await saveUsers(updatedUsers);
    showMessage({
      message: "Tezkor kod o‘chirildi!",
      type: "success",
    });
  };

  const openPreview = (uri: string) => {
    const index = images.findIndex(img => img.uri === uri);
    if (index >= 0) {
      setPreviewIndex(index);
      setViewerVisible(true);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.bar} />
      <Header
        title={"Profil"}
        onBack={() => navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: "MainPage" }] }))}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 20, marginHorizontal: 10, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View>
            {user?.avatar ? (
              <TouchableOpacity onPress={() => openPreview(user.avatar)}>
                <Image style={styles.avatarBase} source={{ uri: user.avatar }} />
              </TouchableOpacity>
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={150}
                color={theme.placeholder}
              />
            )}
          </View>
          <View style={styles.container2}>
            <Text style={[styles.title, { color: theme.text }]}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.username}>@{user?.username}</Text>
          </View>
        </View>
        <View style={[styles.infoBox, { backgroundColor: theme.card }]}>
          <View style={styles.btns}>
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: theme.success }]}
              onPress={() => navigation.navigate("ProfileEdit")}
            >
              <Text style={[styles.editText, { color: theme.border }]}>Tahrirlash</Text>
              <Ionicons name="pencil" size={16} color={theme.border} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.outButton, { backgroundColor: theme.danger }]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={[styles.outText, { color: theme.border }]}>Chiqish</Text>
              <Ionicons name="log-out" size={20} color={theme.border} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.label, { color: theme.text }]}>Telefon:</Text>
          <Text style={[styles.value, { color: theme.text }]}>{user?.phone}</Text>

          <Text style={[styles.label, { color: theme.text }]}>Faoliyat:</Text>
          <Text style={[styles.value, { color: theme.text }]}>{user?.job}</Text>

          <Text style={[styles.label, { color: theme.text }]}>Izoh:</Text>
          <Text style={[styles.value, { color: theme.text }]}>{user?.description}</Text>
        </View>

        <View style={[styles.infoBox, { backgroundColor: theme.card }]}>
          <Text style={[styles.label, { color: theme.text, marginBottom: 10 }]}>Foydalanuvchilar:</Text>
            <View style={styles.themeBox}>
              {users.map((u) => (
                <TouchableOpacity
                  key={u.username}
                  style={[styles.themeBtn, { backgroundColor: user?.username === u.username ? theme.success : theme.placeholder }]}
                  onPress={() => switchActiveUser(u.username)}
                >
                  <Text style={{ color: theme.text }}>
                    {u.firstName} {u.lastName} @{u.username}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
        </View>


        <View style={[styles.infoBox, { backgroundColor: theme.card }]}>
          <View style={styles.settingsText}>
            <Ionicons name="settings" size={20} color={theme.text} />
            <Text style={[styles.settingsTitle, { color: theme.text }]}>Sozlamalar</Text>
          </View>
          <View style={styles.themeBox}>
            <TouchableOpacity style={[styles.themeBtn, { backgroundColor: theme.placeholder }]} onPress={() => setTheme("dark")}>
              <Text style={{ color: theme.text }}>Tungi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.themeBtn, { backgroundColor: theme.placeholder }]} onPress={() => setTheme("light")}>
              <Text style={{ color: theme.text }}>Kunduzgi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.themeBtn, { backgroundColor: theme.placeholder }]} onPress={() => setTheme("blue")}>
              <Text style={{ color: theme.text }}>Ko'k</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.themeBtn, { backgroundColor: theme.placeholder }]} onPress={() => setTheme("orange")}>
              <Text style={{ color: theme.text }}>Mandarin</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={exportTasksAsTxt} style={{ padding: 10, marginTop: 10, backgroundColor: theme.primary, borderRadius: 8 }}>
            <Text style={{ color: "#fff" }}>Vazifalarni yuklab olish</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openPasswordBox}>
            <Text style={[styles.loginCode, { color: theme.text }]}>• Oson kirish kodi</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Support")}>
            <Text style={[styles.loginCode, { color: theme.text }]}>• Biz haqimizda.</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
            <Text style={[styles.loginCode, { color: theme.text }]}>• Chat bo'limi</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Business")}>
            <Text style={[styles.loginCode, { color: theme.text }]}>• Beznis bo'limi</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Habits")}>
            <Text style={[styles.loginCode, { color: theme.text }]}>• Odatlar bo'limi</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Habits")}>
            <Text style={[styles.loginCode, { color: theme.text }]}>• Daromad</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={deleteAccount}>
            <Text style={[styles.deleteText, { color: theme.danger }]}>Hisobni butunlay o'chirish</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={removePasswordCode}>
          <Text style={styles.deleteCode}>🗑 Kodni o‘chirish</Text>
        </TouchableOpacity>
        {passwordBoxVisible && (
          <View style={styles.infoBox}>
            <PasswordCodeInput
              onComplete={async (code) => {
                setPasswordCode(code);
                const activeUser = await getActiveUser();
                if (!activeUser) return;
                const users = await loadUsers();
                const isTaken = users.some(
                  u => u.username !== activeUser.username && u.passwordCode === code
                );
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
                const updatedUsers = users.map(u =>
                  u.username === activeUser.username
                    ? { ...u, passwordCode: code }
                    : u
                );
                await saveUsers(updatedUsers);
                setStatusTitle("✔ Tasdiqlandi");
                setBorderStyle({ borderColor: "green" });
                setStatusColor("green");
                setTimeout(() => {
                  setBorderStyle({});
                  setStatusTitle("");
                  setStatusColor("");
                  openPasswordBox();
                }, 1000);
              }}
              title={statusTitle}
              color={statusColor}
              autoSubmit={false}
              borderStyle={borderStyle}
            />
            <TouchableOpacity onPress={openPasswordBox}>
              <Text style={styles.closeBox}>Yopish ⛔️</Text>
            </TouchableOpacity>
          </View>
        )}
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
      </ScrollView>
      <ImageViewing
        images={images}
        imageIndex={previewIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
        swipeToCloseEnabled
        doubleTapToZoomEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { height: 35, width: "100%" },
  container: { flexDirection: "row", marginBottom: 10, },
  avatarBase: { backgroundColor: "white", height: 120, width: 120, borderRadius: 12, borderWidth: 2, borderColor: "gray" },
  container2: { alignItems: "flex-start", flex: 1, justifyContent: "flex-end", paddingLeft: 10 },

  deleteCode: {
    marginTop: 10,
    color: "red",
    textAlign: "center",
    fontWeight: "600",
  },
  title: { fontSize: 20, fontWeight: "bold" },
  username: { fontSize: 14, color: "#666" },
  themeBox: {
    flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", gap: 10,
  },
  themeBtn: {
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  infoBox: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    marginBottom: 30
  },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  value: { fontSize: 16, color: "#333" },
  btns: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center"
  },
  outButton: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center"
  },
  editText: { fontSize: 14 },
  outText: { fontSize: 14 },
  settings: { marginTop: 20 },
  settingsText: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginBottom: 8 },
  settingsTitle: { fontSize: 18, marginLeft: 3 },
  loginCode: { color: "blue", fontSize: 17, marginTop: 10 },
  deleteText: { fontSize: 17, textDecorationLine: "underline", marginTop: 10 },
  closeBox: { color: "red", fontSize: 16, marginTop: 6, justifyContent: "center", marginHorizontal: "auto" },
});

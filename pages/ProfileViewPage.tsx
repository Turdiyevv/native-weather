import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
  BackHandler
} from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/types";
import { logout } from "../utills/LogOut";
import { Ionicons } from "@expo/vector-icons";
import ConfirmModal from "../components/ConfirmModal";
import {showMessage} from "react-native-flash-message";
import PasswordCodeInput from "../components/PasswordCodeInput";
import {
  getActiveUser,
  deleteUser,
  loadUsers,
  saveUsers
} from "../service/storage";
import {useTheme} from "../theme/ThemeContext";


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
  const { setTheme, themeName } = useTheme();


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

  const animatedSize = avatarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [150, screenWidth - 40],
  });

  const animatedRadius = avatarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [75, 10],
  });

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

  return (
    <ScrollView
      onScroll={(e) => {
        const y = e.nativeEvent.contentOffset.y;
        Animated.timing(avatarAnim, {
          toValue: y > 50 ? 0 : 1,
          duration: 250,
          useNativeDriver: false,
        }).start();
      }}
      scrollEventThrottle={16}
      contentContainerStyle={[styles.scrollContainer, {backgroundColor: theme.background}]}
    >
      <View style={styles.container}>
        {user?.avatar ? (
          <Animated.Image
            source={{ uri: user.avatar }}
            style={[
              styles.avatarBase, {backgroundColor: theme.card},
              {
                width: animatedSize,
                height: animatedSize,
                borderRadius: animatedRadius,
              },
            ]}
          />
        ) : (
          <Ionicons
            name="person-circle-outline"
            size={150}
            color={theme.card}
          />
        )}
      </View>

      <View style={styles.container}>
        <Text style={[styles.title, {color: theme.text}]}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.username}>@{user?.username}</Text>
      </View>

      <View style={[styles.infoBox, {backgroundColor: theme.card}]}>
        <View style={styles.btns}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("ProfileEdit")}
          >
            <Text style={styles.editText}>Tahrirlash</Text>
            <Ionicons name="pencil" size={16} color="#121" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.outButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.outText}>Chiqish</Text>
            <Ionicons name="log-out" size={20} color="red" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.label, {color: theme.text}]}>Telefon:</Text>
        <Text style={[styles.value, {color: theme.text}]}>{user?.phone}</Text>

        <Text style={[styles.label, {color: theme.text}]}>Faoliyat:</Text>
        <Text style={[styles.value, {color: theme.text}]}>{user?.job}</Text>

        <Text style={[styles.label, {color: theme.text}]}>Izoh:</Text>
        <Text style={[styles.value, {color: theme.text}]}>{user?.description}</Text>
      </View>

      <View style={[styles.infoBox, {backgroundColor: theme.card}]}>
        <View style={styles.settingsText}>
          <Ionicons name="settings" size={20} color={theme.text}/>
          <Text style={[styles.settingsTitle, {color: theme.text}]}>Sozlamalar</Text>
        </View>

        <View style={styles.themeBox}>
            <TouchableOpacity style={[styles.themeBtn, {backgroundColor: theme.placeholder}]} onPress={() => setTheme("dark")}>
              <Text style={{color: theme.text}}>Tungi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.themeBtn, {backgroundColor: theme.placeholder}]} onPress={() => setTheme("light")}>
              <Text style={{color: theme.text}}>Kunduzgi</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.themeBtn, {backgroundColor: theme.placeholder}]} onPress={() => setTheme("blue")}>
              <Text style={{color: theme.text}}>Ko'k</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.themeBtn, {backgroundColor: theme.placeholder}]} onPress={() => setTheme("orange")}>
              <Text style={{color: theme.text}}>Mandarin</Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={openPasswordBox}>
          <Text style={[styles.loginCode, {color: theme.text}]}>Oson kirish kodi</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Support")}>
          <Text style={[styles.loginCode, {color: theme.text}]}>Biz haqimizda.</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
          <Text style={[styles.loginCode, {color: theme.text}]}>Chat bo'limi</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Bussiness")}>
          <Text style={[styles.loginCode, {color: theme.text}]}>Beznis bo'limi</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteAccount}>
          <Text style={styles.deleteText}>Hisobni butunlay o'chirish</Text>
        </TouchableOpacity>
      </View>


      {passwordBoxVisible && (
        <View style={styles.infoBox}>
          <PasswordCodeInput
              onComplete={async (code) => {
                setPasswordCode(code);

                const activeUser = await getActiveUser();
                if (!activeUser) return;

                const users = await loadUsers();

                // Kod boshqa userlarda bor-yo‘qligini tekshirish
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
          logout(navigation);
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
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    alignItems: "center",
    paddingBottom: 50
  },
  container: {
    alignItems: "center",
    flex: 1,
    marginBottom: 10,
  },
  avatarBase: {
    marginTop: 10,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  username: { fontSize: 18, color: "#666" },
    themeBox:{
      flexDirection: "row",flexWrap: "wrap", justifyContent: "space-between", gap: 10,
    },
    themeBtn:{
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
  btns:{
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#bcddbc",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center"
  },
  outButton: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fbd1d1",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center"
  },
  editText: { color: "#121", fontSize: 14 },
  outText: { color: "red", fontSize: 14 },
  settings: { marginTop: 20 },
  settingsText: { flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginBottom: 8 },
  settingsTitle: { fontSize: 18, marginLeft: 3 },
  loginCode: { color: "blue", fontSize: 17, textDecorationLine: "underline", marginTop: 10 },
  deleteText: { color: "red", fontSize: 17, textDecorationLine: "underline",marginTop:10 },
  closeBox: { color: "red", fontSize: 16, marginTop: 6, justifyContent: "center", marginHorizontal: "auto" },
});

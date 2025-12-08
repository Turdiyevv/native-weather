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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import { logout } from "../utills/LogOut";
import { Ionicons } from "@expo/vector-icons";
import ConfirmModal from "../components/ConfirmModal";
import {showMessage} from "react-native-flash-message";
import PasswordCodeInput from "../components/PasswordCodeInput";

const screenWidth = Dimensions.get("window").width;

type ProfileViewNavProp = NativeStackNavigationProp<RootStackParamList, "ProfileView">;

export function ProfileViewPage() {
  const navigation = useNavigation<ProfileViewNavProp>();
  const [user, setUser] = useState<any>(null);
  const avatarAnim = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [passwordCode, setPasswordCode] = useState("");
  const [statusTitle, setStatusTitle] = useState("");
  const [statusColor, setStatusColor] = useState("");
  const [passwordBoxVisible, setPasswordBoxVisible] = useState(false);

  const loadActiveUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("activeUser");
      if (!userData) return;
      const activeUser = JSON.parse(userData);
      const profile = activeUser.userinfo || {};
      setUser({
        username: activeUser.username,
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        avatar: profile.avatar || "",
        phone: profile.phone || "",
        job: profile.job || "",
        description: profile.description || ""
      });
    } catch (e) {
      showMessage({
        message: e,
        type: "danger",
        icon: "danger",
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
    const storedUsers = await AsyncStorage.getItem("users");
    let users = storedUsers ? JSON.parse(storedUsers) : [];
    users = users.filter((u: any) => u.username !== user.username);
    await AsyncStorage.setItem("users", JSON.stringify(users));
    await AsyncStorage.removeItem("activeUser");
    setDeleteModalVisible(false);
    showMessage({
      message: "Hisob muvaffaqiyatli o‘chirildi!",
      type: "success",
      icon: "success",
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
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.container}>
        {user?.avatar ? (
          <Animated.Image
            source={{ uri: user.avatar }}
            style={[
              styles.avatarBase,
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
            color="#555"
          />
        )}
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.username}>@{user?.username}</Text>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.btns}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("ProfileEdit")}
          >
            <Text style={styles.editText}>Tahrirlash</Text>
            <Ionicons name="pencil" size={14} color="#121" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.outButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.outText}>Chiqish</Text>
            <Ionicons name="log-out" size={14} color="red" />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Telefon:</Text>
        <Text style={styles.value}>{user?.phone}</Text>

        <Text style={styles.label}>Faoliyat:</Text>
        <Text style={styles.value}>{user?.job}</Text>

        <Text style={styles.label}>Izoh:</Text>
        <Text style={styles.value}>{user?.description}</Text>
      </View>

      <View style={styles.infoBox}>
        <View style={styles.settingsText}>
          <Ionicons name="settings" size={20} color="#555"/>
          <Text style={styles.settingsTitle}>Sozlamalar</Text>
        </View>
        <TouchableOpacity onPress={openPasswordBox}>
          <Text style={styles.loginCode}>Oson kirish kodi</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteAccount}>
          <Text style={styles.deleteText}>Hisobni butunlay o'chirish</Text>
        </TouchableOpacity>
        {/*<TouchableOpacity onPress={() => navigation.navigate("Bussiness")}>*/}
        {/*  <Text style={styles.deleteText}>Blur</Text>*/}
        {/*</TouchableOpacity>*/}
      </View>


      {passwordBoxVisible && (
        <View style={styles.infoBox}>
          <PasswordCodeInput
            onComplete={async (code) => {
              setPasswordCode(code);

              const activeUserStr = await AsyncStorage.getItem("activeUser");
              const activeUser = activeUserStr ? JSON.parse(activeUserStr) : null;
              if (!activeUser) return;

              const usersStr = await AsyncStorage.getItem("users");
              let users = usersStr ? JSON.parse(usersStr) : [];

              // Kod boshqa userlarda mavjudligini tekshirish
              const isCodeTaken = users.some(
                (u: any) => u.username !== activeUser.username && u.passwordCode === code
              );

              if (isCodeTaken) {
                setStatusTitle("⚠ Allaqachon egallangan");
                setStatusColor("orange");
                setTimeout(() => {
                  setStatusTitle("");
                  setStatusColor("");
                }, 2000);
                return;
              }

              // Agar kod erkin bo‘lsa, activeUser ga qo‘shish
              activeUser.passwordCode = code;
              const updatedUsers = users.map((u: any) =>
                u.username === activeUser.username ? activeUser : u
              );

              await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
              await AsyncStorage.setItem("activeUser", JSON.stringify(activeUser));

              setStatusTitle("✔ Tasdiqlandi");
              setStatusColor("green");
              setTimeout(() => {
                setStatusTitle("");
                setStatusColor("");
                openPasswordBox();
              }, 2000);
            }}
            title={statusTitle}
            color={statusColor}
          />
          <TouchableOpacity onPress={openPasswordBox}>
            <Text style={styles.closeBox}>Yopish</Text>
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
    backgroundColor: "#f5f5f5",
    paddingBottom: 50
  },
  container: {
    alignItems: "center",
    flex: 1,
    marginBottom: 10,
  },
  avatarBase: {
    backgroundColor: "#ddd",
    marginTop: 10,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  username: { fontSize: 18, color: "#666" },
  infoBox: {
    width: "100%",
    backgroundColor: "#fff",
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
  loginCode: { color: "blue", fontSize: 17, textDecorationLine: "underline" },
  deleteText: { color: "red", fontSize: 17, textDecorationLine: "underline",marginTop:10 },
  closeBox: { color: "red", fontSize: 16, marginTop: 6, justifyContent: "center", marginHorizontal: "auto" },
});

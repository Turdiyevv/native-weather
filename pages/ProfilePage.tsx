import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    BackHandler,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import TextField from "../components/TextField";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/types";
import { showMessage } from "react-native-flash-message";
import { Ionicons } from "@expo/vector-icons";

// ⚡ Storage services
import { getActiveUser, loadUsers, saveUsers } from "../service/storage";

type NavProp = NativeStackNavigationProp<RootStackParamList, "ProfileEdit">;

export default function ProfilePage() {
  const navigation = useNavigation<NavProp>();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [job, setJob] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState("");

  const placeholderImage = "https://via.placeholder.com/150";

  // 🔙 Telefon ortga tugmasi
  useEffect(() => {
    const backAction = () => {
      navigation.navigate("ProfileView");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  // 📌 Profilni yuklash — **storage.ts** orqali
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const active = await getActiveUser();
        if (!active) return;

        const info = active.userinfo || {};

        setFirstName(info.firstName || "");
        setLastName(info.lastName || "");
        setPhone(info.phone || "");
        setJob(info.job || "");
        setDescription(info.description || "");
        setAvatar(info.avatar || "");
      } catch (e) {
        showMessage({
          message: "Profilni yuklab bo‘lmadi",
          type: "danger",
        });
      }
    };

    loadProfile();
  }, []);

  const chooseAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Rasm galereyasiga ruxsat berish kerak");
      return;
    }
    try {
      global.filePickerOpen = true;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } finally {
      global.filePickerOpen = false;
    }
  };

  const deleteAvatar = () => {
    setAvatar("");
    showMessage({
      message: "Rasm o‘chirildi",
      type: "info",
    });
  };

  // 💾 Profilni saqlash — faqat storage xizmatlari orqali
  const saveProfile = async () => {
    try {
      const active = await getActiveUser();
      if (!active) return;

      const users = await loadUsers();

      // yangi userinfo
      const updatedUser = {
        ...active,
        userinfo: {
          firstName,
          lastName,
          avatar,
          phone,
          job,
          description,
        },
      };

      const updatedUsers = users.map((u) =>
        u.username === active.username ? updatedUser : u
      );

      await saveUsers(updatedUsers);

      showMessage({
        message: "Ma'lumot saqlandi!",
        type: "success",
      });

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "ProfileView" }],
        })
      );
    } catch (e) {
      showMessage({
        message: "Saqlashda xatolik",
        type: "danger",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.picBox}>
          <TouchableOpacity onPress={chooseAvatar} style={styles.picBoxCH}>
            <Image
              source={{ uri: avatar || placeholderImage }}
              style={styles.avatar}
            />
            <Text style={styles.changeText}>Rasmni o‘zgartirish</Text>

            {avatar ? (
              <TouchableOpacity onPress={deleteAvatar} style={styles.trash}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            ) : null}
          </TouchableOpacity>
        </View>

        <View style={styles.containerInputs}>
          <TextField
            label="Ism"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Ism"
          />
          <TextField
            label="Familiya"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Familiya"
          />
          <TextField
            label="Telefon raqam"
            value={phone}
            onChangeText={setPhone}
            placeholder="+998..."
            keyboardType="phone-pad"
          />
          <TextField
            label="Faoliyat turi"
            value={job}
            onChangeText={setJob}
            placeholder="Faoliyat turi"
          />
          <TextField
            label="Izoh"
            value={description}
            minHeight={100}
            onChangeText={setDescription}
            placeholder="Izoh..."
            multiline
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.saveText}>Saqlash</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  picBox: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  picBoxCH: {
    position: "relative",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  trash: {
    position: "absolute",
    right: -40,
    backgroundColor: "#fbd1d1",
    borderRadius: 8,
    padding: 4,
    marginBottom: 11,
  },
  container: {
    flexGrow: 1,
    justifyContent: "flex-end",
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  containerInputs: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginVertical: 10,
    backgroundColor: "#ccc",
  },
  changeText: { textAlign: "center", marginBottom: 10, color: "#007AFF" },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#121",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  saveText: { color: "white", fontSize: 18 },
});

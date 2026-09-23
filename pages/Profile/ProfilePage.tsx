import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import TextField from "../../components/global/TextField";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/types";
import { showMessage } from "react-native-flash-message";
import { Ionicons } from "@expo/vector-icons";
import { getActiveUser, loadUsers, saveUsers } from "../../service/storage";
import { useTheme } from "../../theme/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "../../components/global/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { appStateFlags } from "../../utills/appStateFlags";

type NavProp = NativeStackNavigationProp<RootStackParamList, "ProfileEdit">;

export default function ProfilePage() {
  const navigation = useNavigation<NavProp>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [job, setJob] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const placeholderImage = "https://via.placeholder.com/150";

  useEffect(() => {
      const showSub = Keyboard.addListener("keyboardDidShow", e => {
        setKeyboardHeight(e.endCoordinates.height);
      });
      const hideSub = Keyboard.addListener("keyboardDidHide", () => {
        setKeyboardHeight(0);
      });
      return () => {
        showSub.remove();
        hideSub.remove();
      };
  }, []);

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
        showMessage({ message: "Profilni yuklab bo‘lmadi", type: "danger" });
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
      appStateFlags.filePickerOpen = true;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } finally {
      appStateFlags.filePickerOpen = false;
    }
  };

  const deleteAvatar = () => {
    setAvatar("");
    showMessage({ message: "Rasm o‘chirildi", type: "info" });
  };

  const saveProfile = async () => {
    try {
      const active = await getActiveUser();
      if (!active) return;
      const users = await loadUsers();
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
      showMessage({ message: "Ma'lumot saqlandi!", type: "success" });
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        })
      );
    } catch (e) {
      showMessage({ message: "Saqlashda xatolik", type: "danger" });
    }
  };

  return (
      <View style={[styles.screen, { backgroundColor: theme.background }]}>
          <Header title={"Tahrirlash"} isBack={true} />
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 28,
          }}
          enableOnAndroid={true}
          extraScrollHeight={keyboardHeight + 160 + insets.bottom}
          keyboardShouldPersistTaps="handled"
        >
            <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <TouchableOpacity onPress={chooseAvatar} style={styles.picBoxCH}>
                <Image
                  source={{ uri: avatar || placeholderImage }}
                  style={styles.avatar}
                />
                <Text style={[styles.changeText, { color: theme.primary }]}>Rasmni o‘zgartirish</Text>

                {avatar ? (
                  <TouchableOpacity onPress={deleteAvatar} style={[styles.trash, { backgroundColor: theme.card }]}>
                    <Ionicons name="trash-outline" size={20} color={theme.danger} />
                  </TouchableOpacity>
                ) : null}
              </TouchableOpacity>
            </View>

            <View style={[styles.containerInputs, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Shaxsiy ma’lumotlar</Text>
              <TextField label="Ism" value={firstName} onChangeText={setFirstName} placeholder="Ism" />
              <TextField label="Familiya" value={lastName} onChangeText={setLastName} placeholder="Familiya" />
              <TextField label="Telefon raqam" value={phone} onChangeText={setPhone} placeholder="+998..." keyboardType="phone-pad" />
              <TextField label="Faoliyat turi" value={job} onChangeText={setJob} placeholder="Faoliyat turi" />
              <TextField label="Izoh" value={description} minHeight={100} onChangeText={setDescription} placeholder="Izoh..." multiline />
            </View>

            <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.primary }]} onPress={saveProfile}>
              <Text style={styles.saveText}>Saqlash</Text>
            </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  picBoxCH: {
    position: "relative",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 142,
    height: 142,
    borderRadius: 71,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.7)",
    marginBottom: 12,
  },
  changeText: { textAlign: "center", fontSize: 15, fontWeight: "700" },
  trash: {
    position: "absolute",
    right: 16,
    top: 12,
    borderRadius: 12,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  containerInputs: {
    marginTop: 18,
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: "800", marginBottom: 10 },
  saveButton: {
    marginTop: 18,
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 5,
  },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});

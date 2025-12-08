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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import TextField from "../components/TextField";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import {showMessage} from "react-native-flash-message";
import {Ionicons} from "@expo/vector-icons";

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

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const activeUserStr = await AsyncStorage.getItem("activeUser");
        if (activeUserStr) {
          const user = JSON.parse(activeUserStr);
          setFirstName(user.userinfo?.firstName || "");
          setLastName(user.userinfo?.lastName || "");
          setPhone(user.userinfo?.phone || "");
          setJob(user.userinfo?.job || "");
          setDescription(user.userinfo?.description || "");
          setAvatar(user.userinfo?.avatar || "");
        }
      } catch (e) {
        showMessage({
          message: e,
          type: "danger",
          icon: "danger",
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
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const deleteAvatar = () => {
    setAvatar("");
    showMessage({
      message: "Rasm o'chirildi",
      type: "info",
      icon: "info",
    });
  };
  const saveProfile = async () => {
    try {
      const activeUserStr = await AsyncStorage.getItem("activeUser");
      if (!activeUserStr) return;
      const activeUser = JSON.parse(activeUserStr);
      activeUser.userinfo = { firstName, lastName, avatar, phone, job, description };
      await AsyncStorage.setItem("activeUser", JSON.stringify(activeUser));
      const usersStr = await AsyncStorage.getItem("users");
      let users = usersStr ? JSON.parse(usersStr) : [];
      const updatedUsers = users.map((u: any) =>
        u.username === activeUser.username ? activeUser : u
      );
      await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
      showMessage({
        message: "Ma'lumot to'ldirildi!",
        type: "success",
        icon: "success",
      });
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "ProfileView" }],
        })
      );
    } catch (e) {
      showMessage({
        message: e,
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
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.picBox}>
          <TouchableOpacity onPress={chooseAvatar} style={styles.picBoxCH}>
            <Image source={{ uri: avatar || placeholderImage }} style={styles.avatar} />
            <Text style={styles.changeText}>Rasmni o'zgartirish</Text>
            {avatar ? (
              <TouchableOpacity onPress={deleteAvatar} style={styles.trash}>
                <Ionicons name="trash-outline" size={24} color="red"/>
              </TouchableOpacity>
            ) : null}
          </TouchableOpacity>
        </View>
        <View style={styles.containerInputs}>
          <TextField label="Ism" value={firstName} onChangeText={setFirstName} placeholder="Ism" />
          <TextField label="Familiya" value={lastName} onChangeText={setLastName} placeholder="Familiya" />
          <TextField label="Telefon raqam" value={phone} onChangeText={setPhone} placeholder="+998..." keyboardType="phone-pad" />
          <TextField label="Faoliyat turi" value={job} onChangeText={setJob} placeholder="Faoliyat turi" />
          <TextField label="Izoh" value={description} minHeight={100} onChangeText={setDescription} placeholder="Izoh uchun..." multiline/>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.saveText}>Saqlash</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  picBox:{
    // borderWidth: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  picBoxCH:{
    position: "relative",
    borderRadius:12,
    // borderWidth: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  trash:{
    position: "absolute",
    right:-40,
    backgroundColor:'#fbd1d1',
    borderRadius: 8,
    padding: 4,
    marginBottom: 11
  },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    padding: 10, backgroundColor: "#f5f5f5",
  },
  containerInputs: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10
  },
  avatar: { width: 150, height: 150, borderRadius: 75, marginVertical: 10, backgroundColor: "#ccc" },
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

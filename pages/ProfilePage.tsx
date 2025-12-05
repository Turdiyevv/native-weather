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

type NavProp = NativeStackNavigationProp<RootStackParamList, "ProfileEdit">;
export default function ProfilePage() {
  const navigation = useNavigation<NavProp>();

  const [username, setUsername] = useState("");
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
        const json = await AsyncStorage.getItem("profile");
        if (json) {
          const data = JSON.parse(json);
          setUsername(data.username || "");
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setPhone(data.phone || "");
          setJob(data.job || "");
          setDescription(data.description || "");
          setAvatar(data.avatar || "");
        }
      } catch (e) {
        console.log("Error loading profile", e);
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

  // --- Saqlash ---
  const saveProfile = async () => {
    const profile = { username, firstName, lastName, phone, job, description, avatar };
    try {
      await AsyncStorage.setItem("profile", JSON.stringify(profile));
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "ProfileView" }],
        })
      );
    } catch (e) {
      console.log("Error saving profile", e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={chooseAvatar}>
          <Image source={{ uri: avatar || placeholderImage }} style={styles.avatar} />
          <Text style={styles.changeText}>Rasmni o'zgartirish</Text>
        </TouchableOpacity>

        <TextField label="Username" value={username} onChangeText={setUsername} placeholder="Username" />
        <TextField label="Ism" value={firstName} onChangeText={setFirstName} placeholder="Ism" />
        <TextField label="Familiya" value={lastName} onChangeText={setLastName} placeholder="Familiya" />
        <TextField label="Telefon raqam" value={phone} onChangeText={setPhone} placeholder="+998..." keyboardType="phone-pad" />
        <TextField label="Faoliyat turi" value={job} onChangeText={setJob} placeholder="Faoliyat turi" />
        <TextField label="Description" value={description} onChangeText={setDescription} placeholder="O‘zingiz haqingizda" multiline height={100} />

        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.saveText}>Saqlash</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f5f5f5", alignItems: "center" },
  avatar: { width: 150, height: 150, borderRadius: 75, marginBottom: 10, backgroundColor: "#ccc" },
  changeText: { textAlign: "center", marginBottom: 20, color: "#007AFF" },
  saveButton: {
    marginTop: 20,
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  saveText: { color: "white", fontSize: 18 },
});

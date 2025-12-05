import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import TextField from "../components/TextField";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [job, setJob] = useState("");
  const [description, setDescription] = useState("");

  const placeholderImage = "https://via.placeholder.com/150";

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Profil</Text>
        <Image source={{ uri: placeholderImage }} style={styles.avatar} />

        <TextField label="Username" value={username} onChangeText={setUsername} placeholder="Username" />
        <TextField label="Ism" value={firstName} onChangeText={setFirstName} placeholder="Ism" />
        <TextField label="Familiya" value={lastName} onChangeText={setLastName} placeholder="Familiya" />
        <TextField label="Telefon raqam" value={phone} onChangeText={setPhone} placeholder="+998..." keyboardType="phone-pad" />
        <TextField label="Faoliyat turi" value={job} onChangeText={setJob} placeholder="Faoliyat turi" />
        <TextField label="Description" value={description} onChangeText={setDescription} placeholder="O‘zingiz haqingizda" multiline height={100} />

        <TouchableOpacity style={styles.saveButton} onPress={() => console.log("Saqlash")}>
          <Text style={styles.saveText}>Saqlash</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f5f5f5", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  avatar: { width: 150, height: 150, borderRadius: 75, marginBottom: 20, backgroundColor: "#ccc" },
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

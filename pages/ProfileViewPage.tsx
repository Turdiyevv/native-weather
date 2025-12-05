import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function ProfileViewPage({ navigation }) {
  // Hozircha static — keyin AsyncStorage / API’dan olamiz
  const user = {
    username: "",
    firstName: "",
    lastName: "",
    phone: "",
    job: "",
    description: "",
    avatar: "",
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: user?.avatar }} style={styles.avatar} />

      <Text style={styles.title}>{user?.firstName} {user?.lastName}</Text>
      <Text style={styles.username}>@{user?.username}</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Telefon:</Text>
        <Text style={styles.value}>{user?.phone}</Text>

        <Text style={styles.label}>Faoliyat:</Text>
        <Text style={styles.value}>{user?.job}</Text>

        <Text style={styles.label}>Izoh:</Text>
        <Text style={styles.value}>{user?.description}</Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("ProfileEdit")}
      >
        <Text style={styles.editText}>Tahrirlash</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 20, backgroundColor: "#f5f5f5" },

  avatar: { width: 150, height: 150, borderRadius: 75, backgroundColor: "#ddd", marginBottom: 20 },

  title: { fontSize: 24, fontWeight: "bold" },
  username: { fontSize: 18, color: "#666", marginBottom: 20 },

  infoBox: { width: "100%", backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 30 },

  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  value: { fontSize: 16, color: "#333" },

  editButton: { backgroundColor: "black", padding: 15, borderRadius: 10, width: "100%", alignItems: "center" },
  editText: { color: "white", fontSize: 18 },
});

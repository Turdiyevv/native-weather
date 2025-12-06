import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginPage({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userCount, setUserCount] = useState(0);

  const loadUserCount = async () => {
    const storedUsers = await AsyncStorage.getItem("users");
    const users = storedUsers ? JSON.parse(storedUsers) : [];
    setUserCount(users.length);
  };

  useEffect(() => {
    loadUserCount();
  }, []);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert("Error", "Username va passwordni kiriting!");
      return;
    }

    try {
      const storedUsers = await AsyncStorage.getItem("users");
      let users = storedUsers ? JSON.parse(storedUsers) : [];

      // Maksimal 3 user cheklovi
      if (!users.find((u: any) => u.username === username) && users.length >= 3) {
        Alert.alert("Limit", "Faqat 3 ta user yaratilishi mumkin!");
        return;
      }

      let user = users.find((u: any) => u.username === username);

      if (!user) {
        // Yangi user yaratish
        user = {
          username,
          password,
          userinfo: {
            firstName: "",
            lastName: "",
            avatar: "",
            phone: "",
            job: "",
            description: "",
          },
          usertasks: [],
        };
        users.push(user);
        await AsyncStorage.setItem("users", JSON.stringify(users));
        setUserCount(users.length);
      } else {
        if (user.password !== password) {
          Alert.alert("Xato", "Password noto‘g‘ri!");
          return;
        }
      }
      await AsyncStorage.setItem("activeUser", JSON.stringify(user));
      navigation.replace("MainPage");
        console.log(users)
    } catch (error) {
      console.log("Login error:", error);
      Alert.alert("Error", "Login paytida xatolik yuz berdi!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xush kelibsiz!</Text>

      <Text style={{ textAlign: "center", marginBottom: 20, color: "#555", fontSize: 16 }}>
        Ro‘yxatdagi userlar: {userCount} / 3
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Kirish</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", paddingHorizontal: 30 },
  title: { fontSize: 32, fontWeight: "700", marginBottom: 40, textAlign: "center" },
  input: { height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, paddingHorizontal: 15, marginBottom: 20, fontSize: 18 },
  btn: { backgroundColor: "#121", paddingVertical: 15, borderRadius: 10 },
  btnText: { color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "600" },
});

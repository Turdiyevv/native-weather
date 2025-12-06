import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginPage({ navigation }) {
  const [username, setUsername] = useState("");

  const handleLogin = async () => {
    if (!username.trim()) return;

    try {
      const storedUsers = await AsyncStorage.getItem("users");
      let users = storedUsers ? JSON.parse(storedUsers) : [];

      let user = users.find(u => u.username === username);

      if (!user) {
        // yangi user yaratamiz
        user = {
          id: Date.now(),
          username: username,
          tasks: []
        };

        users.push(user);
        await AsyncStorage.setItem("users", JSON.stringify(users));
      }

      // active userni saqlaymiz
      await AsyncStorage.setItem("activeUser", JSON.stringify(user));

      navigation.replace("MainPage");

    } catch (error) {
      console.log("Login error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xush kelibsiz !</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter username"
        placeholderTextColor="#aaa"
        value={username}
        onChangeText={setUsername}
      />

      <TouchableOpacity style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Kirish</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
  },
  btn: {
    backgroundColor: "#121",
    paddingVertical: 15,
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});

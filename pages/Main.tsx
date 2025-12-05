import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TodoItem from "../components/TodoItem";
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../assets/empty_avatar.png';

export default function MainPage({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [avatar, setAvatar] = useState<string>("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const json = await AsyncStorage.getItem("profile");
        if (json) {
          const data = JSON.parse(json);
          setFirstName(data.firstName || "");
          setAvatar(data.avatar || "");
        }
      } catch (e) {
        console.log("Error loading profile", e);
      }
    };
    loadProfile();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTasks();
    });
    return unsubscribe;
  }, [navigation]);

  const loadTasks = async () => {
    try {
      const data = await AsyncStorage.getItem("tasks");
      if (data) setTasks(JSON.parse(data));
    } catch (e) {
      console.log("Error loading tasks", e);
    }
  };

  const markDone = async (item) => {
    const newTasks = tasks.map(t => t.id === item.id ? { ...t, done: true } : t);
    setTasks(newTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  const editTask = (item) => {
    navigation.navigate("AddPage", { task: item });
  };

  const deleteTask = async (id) => {
    const newTasks = tasks.filter(t => t.id !== id);
    setTasks(newTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.username}>{firstName || "Noma'lum"}</Text>
        <Image source={avatar ? { uri: avatar } : Avatar} style={styles.avatar}/>
      </View>

      {/* Task List */}
      <FlatList
        data={tasks.slice().reverse()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            onToggle={() => {}}
            onDone={markDone}
            onEdit={editTask}
            onDelete={deleteTask}
          />
        )}
      />

      {/* Bottom Buttons */}
      <View style={styles.leftButtons}>
        <TouchableOpacity style={styles.sideButton} onPress={() => navigation.navigate("ProfileView")}>
          <Ionicons name="person-circle-outline" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideButton} onPress={() => console.log("Chat")}>
          <Ionicons name="chatbubble-outline" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideButton} onPress={() => console.log("Support")}>
          <Ionicons name="help-circle-outline" size={32} color="black" />
        </TouchableOpacity>
      </View>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddPage")}>
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: "#f5f5f5" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  username: { fontSize: 22, fontWeight: "bold" },
  avatar: { backgroundColor: "#121", width: 40, height: 40, borderRadius: 20 },
  addButton: { backgroundColor: "#121", width: 50, height: 50, borderRadius: 30, justifyContent: "center",
      alignItems: "center", position: "absolute", bottom: 30, right: 30,
      shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  addText: { color: "white", fontSize: 32 },
  leftButtons: { position: "absolute", bottom: 30, left: 20, flexDirection: "row", gap: 15 },
  sideButton: { backgroundColor: "#fff", width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center",
      shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
});

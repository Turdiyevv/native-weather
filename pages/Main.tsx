import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TodoItem from "../components/TodoItem";
import { Ionicons } from '@expo/vector-icons';

export default function MainPage({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [avatar, setAvatar] = useState<string>("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const placeholderImage = "https://via.placeholder.com/150";

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

  const toggleTask = async (id) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setTasks(newTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  const deleteTask = async (id) => {
    const newTasks = tasks.filter(t => t.id !== id);
    setTasks(newTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
    setMenuVisible(false);
  };

  const onItemPress = (item) => {
    setSelectedTask(item);
    setMenuVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.username}>{firstName}</Text>
        <Image source={{ uri: avatar || placeholderImage }} style={styles.avatar} />
      </View>

      {/* Task List */}
      <FlatList
          data={tasks.slice().reverse()} // oxirgi qo'shilgan tepada
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onItemPress(item)}>
              <TodoItem item={item} onToggle={toggleTask} />
            </TouchableOpacity>
          )}
      />

      {/* Menu Modal */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                navigation.navigate("ProfileView", { task: selectedTask });
                setMenuVisible(false);
              }}
            >
              <Text style={styles.menuText}>View</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                navigation.navigate("AddPage", { task: selectedTask });
                setMenuVisible(false);
              }}
            >
              <Text style={styles.menuText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => deleteTask(selectedTask.id)}
            >
              <Text style={[styles.menuText, { color: "red" }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

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
  avatar: { width: 40, height: 40, borderRadius: 20 },
  addButton: { backgroundColor: "black", width: 50, height: 50, borderRadius: 30, justifyContent: "center",
      alignItems: "center", position: "absolute", bottom: 30, right: 30,
      shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  addText: { color: "white", fontSize: 32 },
  leftButtons: { position: "absolute", bottom: 30, left: 20, flexDirection: "row", gap: 15 },
  sideButton: { backgroundColor: "#fff", width: 50, height: 50, borderRadius: 25, justifyContent: "center", alignItems: "center",
      shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  modalOverlay: { flex:1, backgroundColor:"rgba(0,0,0,0.2)", justifyContent:"center", alignItems:"center" },
  menu: { backgroundColor:"#fff", width:200, borderRadius:10, paddingVertical:10, shadowColor:"#000", shadowOpacity:0.2, shadowRadius:4, elevation:5 },
  menuButton: { paddingVertical:12, paddingHorizontal:20 },
  menuText: { fontSize:16 },
});

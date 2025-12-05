import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  SectionList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TodoItem from "../components/TodoItem";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../assets/empty_avatar.png";

export default function MainPage({ navigation }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [firstName, setFirstName] = useState("");
  const [avatar, setAvatar] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

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
    const unsubscribe = navigation.addListener("focus", () => {
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
    const newTasks = tasks.map((t) =>
      t.id === item.id ? { ...t, done: true } : t
    );
    setTasks(newTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
    setSelectedTaskId(null);
  };

  const editTask = (item) => {
    navigation.navigate("AddPage", { task: item });
    setSelectedTaskId(null);
  };

  const deleteTask = async (id) => {
    const newTasks = tasks.filter((t) => t.id !== id);
    setTasks(newTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
    setSelectedTaskId(null);
  };

  const openMenu = (itemId, y) => {
    setSelectedTaskId(itemId);
    setMenuPosition({ x: 20, y });
  };

  // Tasksni sanaga qarab guruhlash
  const groupedTasks = tasks
    .slice()
    .reverse()
    .reduce((acc, task) => {
      const dateStr = new Date(task.time).toLocaleDateString();
      const group = acc.find((g) => g.title === dateStr);
      if (group) {
        group.data.push(task);
      } else {
        acc.push({ title: dateStr, data: [task] });
      }
      return acc;
    }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.username}>{firstName || "Noma'lum"}</Text>
        <Image source={avatar ? { uri: avatar } : Avatar} style={styles.avatar} />
      </View>

      {/* SectionList bilan tasklar */}
      <SectionList
        sections={groupedTasks}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            onToggle={() => {}}
            onLongPress={(y) => openMenu(item.id, y)}
          />
        )}
      />

      {/* Menu */}
      {selectedTaskId && (
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setSelectedTaskId(null)}
        >
          <View style={[styles.menu, { top: menuPosition.y }]}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => markDone(tasks.find((t) => t.id === selectedTaskId))}
            >
              <Text>Bajarildi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => editTask(tasks.find((t) => t.id === selectedTaskId))}
            >
              <Text>Tahrirlash</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => deleteTask(selectedTaskId)}
            >
              <Text style={{ color: "red" }}>O'chirish</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {/* Bottom Buttons */}
      <View style={styles.leftButtons}>
        <TouchableOpacity
          style={styles.sideButton}
          onPress={() => navigation.navigate("ProfileView")}
        >
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
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddPage")}
      >
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
  addButton: {
    backgroundColor: "#121",
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 30,
    right: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addText: { color: "white", fontSize: 32 },
  leftButtons: { position: "absolute", bottom: 30, left: 20, flexDirection: "row", gap: 15 },
  sideButton: {
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menu: {
    position: "absolute",
    right: 20,
    width: 200,
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 999,
  },
  menuButton: { paddingVertical: 5, paddingHorizontal: 10 },
  menuOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginVertical: 5,
  },
});

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Vibration
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

  const menuAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const activeUserStr = await AsyncStorage.getItem("activeUser");
        if (activeUserStr) {
          const user = JSON.parse(activeUserStr);
          setFirstName(user.userinfo?.firstName || "");
          setAvatar(user.userinfo?.avatar || "");
        }
      } catch (e) {
        console.log("Error loading profile", e);
      }
    };
    const unsubscribe = navigation.addListener("focus", () => {
      loadProfile();
    });
    loadProfile();
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadTasks();
    });
    return unsubscribe;
  }, [navigation]);


  const loadTasks = async () => {
    try {
      const activeUserStr = await AsyncStorage.getItem("activeUser");
      if (!activeUserStr) return;
      const activeUser = JSON.parse(activeUserStr);
      setTasks(activeUser.usertasks || []);
    } catch (e) {
      console.log("Error loading tasks", e);
    }
  };
  const markDone = async (item) => {
    try {
      const activeUserStr = await AsyncStorage.getItem("activeUser");
      if (!activeUserStr) return;
      const activeUser = JSON.parse(activeUserStr);

      const newTasks = activeUser.usertasks.map((t) => {
        if (t.id === item.id) {
          const isReturning = t.done;
          const updatedTask = { ...t, done: !t.done };
          if (isReturning) updatedTask.isReturning = (t.isReturning || 0) + 1;
          return updatedTask;
        }
        return t;
      });

      activeUser.usertasks = newTasks;
      setTasks(newTasks);

      // users array yangilash
      const storedUsers = await AsyncStorage.getItem("users");
      let users = storedUsers ? JSON.parse(storedUsers) : [];
      users = users.map((u) => (u.username === activeUser.username ? activeUser : u));

      await AsyncStorage.setItem("users", JSON.stringify(users));
      await AsyncStorage.setItem("activeUser", JSON.stringify(activeUser));
      closeMenu();
    } catch (e) {
      console.log("Error marking task done", e);
    }
  };

  const editTask = (item) => {
    navigation.navigate("AddPage", { task: item });
    closeMenu();
  };

  const deleteTask = async (id) => {
    try {
      const activeUserStr = await AsyncStorage.getItem("activeUser");
      if (!activeUserStr) return;
      const activeUser = JSON.parse(activeUserStr);

      const newTasks = activeUser.usertasks.filter((t) => t.id !== id);
      activeUser.usertasks = newTasks;
      setTasks(newTasks);

      const storedUsers = await AsyncStorage.getItem("users");
      let users = storedUsers ? JSON.parse(storedUsers) : [];
      users = users.map((u) => (u.username === activeUser.username ? activeUser : u));

      await AsyncStorage.setItem("users", JSON.stringify(users));
      await AsyncStorage.setItem("activeUser", JSON.stringify(activeUser));
      closeMenu();
    } catch (e) {
      console.log("Error deleting task", e);
    }
  };


  const openMenu = (itemId, y) => {
    setSelectedTaskId(itemId);
    setMenuPosition({ x: 20, y });
    Vibration.vibrate(20);
    menuAnim.setValue(0);
    Animated.timing(menuAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start(() => setSelectedTaskId(null));
  };

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
        <Text style={styles.username}>{firstName || "-"}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ProfileView")}>
          {avatar ? (
            <Image
              source={{ uri: avatar }}
              style={styles.avatar}
            />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={50}
              color="#555"
            />
          )}
        </TouchableOpacity>
      </View>
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
      {selectedTaskId && (() => {
        const task = tasks.find((t) => t.id === selectedTaskId);
        if (!task) return null;

        const menuStyle: Animated.AnimatedProps<any> = {
          position: "absolute",
          right: 20,
          top: menuPosition.y,
          width: menuAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 200] }),
          opacity: menuAnim,
          transform: [{ scale: menuAnim }],
          backgroundColor: "#fff",
          borderRadius: 10,
          paddingVertical: 10,
          overflow: "hidden",
        };
        return (
          <TouchableOpacity
            style={styles.menuOverlay}
            activeOpacity={1}
            onPress={closeMenu}
          >
            <Animated.View style={menuStyle}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => markDone(task)}
              >
                <Text style={styles.menuText}>
                  {task.done ? "Qaytarish" : "Bajarildi"}
                </Text>
                <Ionicons
                  name={task.done ? "arrow-undo-outline" : "checkmark-circle-outline"}
                  size={20}
                  color={task.done ? "orange" : "green"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => editTask(task)}
              >
                <Text style={styles.menuText}>Tahrirlash</Text>
                <Ionicons name="create-outline" size={20} color="blue" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuButtonDel}
                onPress={() => deleteTask(task.id)}
              >
                <Text style={[styles.menuText, { color: "red" }]}>O'chirish</Text>
                <Ionicons name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        );
      })()}

      {/* Bottom Buttons */}
      <View style={styles.leftButtons}>
        <TouchableOpacity style={styles.sideButton} onPress={() => navigation.navigate("Chat")}>
          <Ionicons name="chatbubble-outline" size={32} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sideButton} onPress={() => navigation.navigate("Support")}>
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
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 10, backgroundColor: "#f5f5f5" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  username: { fontSize: 22, fontWeight: "bold" },
  avatar: {borderColor: "#121", borderWidth: 1, backgroundColor: "#121", width: 50, height: 50, borderRadius: 25 },
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
  sectionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginVertical: 5,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  menuButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuButtonDel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 16,
  },
});

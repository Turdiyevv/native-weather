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
import {showMessage} from "react-native-flash-message";
import ConfirmModal from "../components/ConfirmModal";
import AdminIcon from "../assets/admin_icon.png";
import LeftMenu from "../components/MenuBar";

export default function DeletedTasks({ navigation }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [menuDirection, setMenuDirection] = useState<"top" | "bottom">("bottom");
  const [modalVisible, setModalVisible] = React.useState(false);

  const menuAnim = useRef(new Animated.Value(0)).current;
  const MENU_HEIGHT = 200;
  const BOTTOM_AREA = 100;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const activeUserStr = await AsyncStorage.getItem("activeUser");
        if (activeUserStr) {
          const user = JSON.parse(activeUserStr);
          setFirstName(user.userinfo?.firstName || "");
          setAvatar(user.userinfo?.avatar || "");
          setUsername(user.username || "@");
        }
      } catch (e) {
        showMessage({
          message: e,
          type: "danger",
          icon: "danger",
        });
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
      showMessage({
        message: e,
        type: "danger",
        icon: "danger",
      });
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
      const storedUsers = await AsyncStorage.getItem("users");
      let users = storedUsers ? JSON.parse(storedUsers) : [];
      users = users.map((u) => (u.username === activeUser.username ? activeUser : u));
      await AsyncStorage.setItem("users", JSON.stringify(users));
      await AsyncStorage.setItem("activeUser", JSON.stringify(activeUser));
      showMessage({
        message: "Vazifa almashtirildi!",
        type: "success",
        icon: "success",
      });
      closeMenu();
    } catch (e) {
      showMessage({
        message: e,
        type: "danger",
        icon: "danger",
      });
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
      // 🔥 1. Taskni filter qilmasdan, ichidan topamiz
      const updatedTasks = activeUser.usertasks.map((t) =>
        t.id === id ? { ...t, isDeleted: true } : t
      );
      // 🔥 2. Yangilangan tasklar massivini yozamiz
      activeUser.usertasks = updatedTasks;
      setTasks(updatedTasks);
      // 🔥 3. Users massivini yangilaymiz
      const storedUsers = await AsyncStorage.getItem("users");
      let users = storedUsers ? JSON.parse(storedUsers) : [];
      users = users.map((u) =>
        u.username === activeUser.username ? activeUser : u
      );
      // 🔥 4. Hammasini qayta saqlaymiz
      await AsyncStorage.setItem("users", JSON.stringify(users));
      await AsyncStorage.setItem("activeUser", JSON.stringify(activeUser));
      showMessage({
        message: "Vazifa o'chirildi! (soft-delete)",
        type: "success",
        icon: "success",
      });

      closeMenu();
    } catch (e) {
      showMessage({
        message: String(e),
        type: "danger",
        icon: "danger",
      });
    }
  };


  const openMenu = (itemId, y) => {
    setSelectedTaskId(itemId);
    const screenHeight = globalThis.window?.innerHeight || 800;
    const spaceBelow = screenHeight - y;
    if (spaceBelow < MENU_HEIGHT + BOTTOM_AREA) {
      setMenuDirection("top");
      setMenuPosition({ x: 20, y: y - MENU_HEIGHT });
    } else {
      setMenuDirection("bottom");
      setMenuPosition({ x: 20, y });
    }
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
    .filter(t => t?.isDeleted)
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
      <View style={styles.bar}></View>
      <View style={styles.containerLittle}>
        <View style={styles.header}>
          <View>
            <Text style={styles.username}>{firstName || "-"}</Text>
            <Text style={styles.keyUsername}>@{username || "-"}</Text>
          </View>
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
        <SectionList style={{marginBottom: 65}}
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
          ListEmptyComponent={() => (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Image source={AdminIcon} style={styles.icon} />
              <Text style={{ fontSize: 16, color: "#555" }}>
                O'chirilgan vazifalaringiz ro'yxati chiqadi.
              </Text>
            </View>
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
          const displayTitle = task.title.length > 16 ? task.title.slice(0, 16) + "..." : task.title;
          return (
            <TouchableOpacity
              style={styles.menuOverlay}
              activeOpacity={1}
              onPress={closeMenu}
            >
              <Animated.View style={menuStyle}>
                <View style={styles.menuButtonTitle}>
                  <Text style={styles.taskTitle}>{displayTitle}</Text>
                  <Ionicons name="document-outline" size={20} color="gray" />
                </View>
                <TouchableOpacity style={[styles.menuButton, !!task?.isDeleted && { opacity: 0.4 }]}
                                  onPress={() => markDone(task)}
                                  disabled={!!task?.isDeleted}
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
                <TouchableOpacity style={[styles.menuButton, !!task?.isDeleted && { opacity: 0.4 }]}
                                  onPress={() => editTask(task)}
                                  disabled={!!task?.isDeleted}
                >
                  <Text style={styles.menuText}>Tahrirlash</Text>
                  <Ionicons name="create-outline" size={20} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuButtonDel, !!task?.isDeleted && { opacity: 0.4 }]}
                                  onPress={() => setModalVisible(true)}
                                  disabled={!!task?.isDeleted}
                >
                    <Text style={[styles.menuText, { color: "red" }]}>O'chirish</Text>
                    <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
              </Animated.View>

              <ConfirmModal
                visible={modalVisible}
                message="Ishonchingiz komilmi?"
                onConfirm={() => {
                  deleteTask(task.id);
                  setModalVisible(false);
                }}
                onCancel={() => {
                  setModalVisible(false);
                }}
              />
            </TouchableOpacity>
          );
        })()}
        <LeftMenu
          buttons={[
            { icon: "home-outline", onPress: () => navigation.navigate("MainPage"),size: 26 },
            { icon: "checkbox-outline", onPress: () => navigation.navigate("DoneTasks"),size: 24 },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  containerLittle: { flex: 1, justifyContent: "flex-end", paddingHorizontal: 10, backgroundColor: "#f5f5f5" },
  bar:{height: 35, width: "100%"},
  header: { borderColor: "#121", borderBottomWidth: 1, borderRightWidth: 1, borderBottomEndRadius: 25, borderTopEndRadius: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  username: { fontSize: 22, fontWeight: "bold" },
  keyUsername: { fontSize: 12, color: 'gray' },
  avatar: {borderColor: "#121", borderWidth: 2, backgroundColor: "#121", width: 50, height: 50, margin:1, borderRadius: 25 },
  icon: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#b3b3b3",
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
  taskTitle:{
    fontSize: 16,
    color:"#007AFF",
  },
  menuButtonTitle: {
    paddingTop: 3,
    paddingBottom: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

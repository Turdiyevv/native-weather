import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Vibration
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { showMessage } from "react-native-flash-message";
import ConfirmModal from "../components/ConfirmModal";
import LeftMenu from "../components/MenuBar";
import CustomHeader from "../components/CustomHeader";
import { UserTask, User } from "./types/userTypes";
import { getActiveUser, updateTask, softDeleteTask, loadUsers, saveUsers } from "../service/storage";
import TodoItem from "../components/TodoItem";
import TaskContextMenu from "../components/TaskContextMenu";
import {useTheme} from "../theme/ThemeContext";

export default function MainPage({ navigation }: any) {
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const { theme } = useTheme();
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [menuDirection, setMenuDirection] = useState<"top" | "bottom">("bottom");
  const [modalVisible, setModalVisible] = useState(false);

  const menuAnim = useRef(new Animated.Value(0)).current;
  const MENU_HEIGHT = 200;
  const BOTTOM_AREA = 100;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const activeUser = await getActiveUser();
        if (!activeUser) {
          navigation.reset({ index: 0, routes: [{ name: "LoginCodePage" }] });
          return;
        }
        setFirstName(activeUser.userinfo?.firstName || "");
        setAvatar(activeUser.userinfo?.avatar || "");
        setUsername(activeUser.username || "@");
        setTasks(activeUser.usertasks || []);
      } catch (e) {
        showMessage({ message: String(e), type: "danger" });
      }
    };

    const unsubscribe = navigation.addListener("focus", () => loadProfile());
    loadProfile();
    return unsubscribe;
  }, [navigation]);

  const markDone = async (task: UserTask) => {
    try {
      const activeUser = await getActiveUser();
      if (!activeUser) return;

      const isReturning = task.done;
      const updatedTask: UserTask = { ...task, done: !task.done };
      if (isReturning) updatedTask.isReturning = (task.isReturning || 0) + 1;

      await updateTask(activeUser.username, task.id, updatedTask);
      const updatedTasks = activeUser.usertasks.map(t => t.id === task.id ? updatedTask : t);
      setTasks(updatedTasks);

      showMessage({ message: "Vazifa statusi o'zgartirildi!", type: "success" });
      closeMenu();
    } catch (e) {
      showMessage({ message: String(e), type: "danger" });
    }
  };

  const editTask = (task: UserTask, initialView: boolean) => {
    navigation.navigate("AddPage", { task, initialView });
    closeMenu();
  };

  const deleteTaskHandler = async (task: UserTask) => {
    try {
      const activeUser = await getActiveUser();
      if (!activeUser) return;

      await softDeleteTask(activeUser.username, task.id);
      const updatedTasks = activeUser.usertasks.map(t =>
        t.id === task.id ? { ...t, isDeleted: true } : t
      );
      setTasks(updatedTasks);

      showMessage({ message: "Vazifa o'chirildi (soft-delete)", type: "success" });
      closeMenu();
    } catch (e) {
      showMessage({ message: String(e), type: "danger" });
    }
  };

  const openMenu = (taskId: string, y: number) => {
    setSelectedTaskId(taskId);
    const screenHeight = globalThis.window?.innerHeight || 800;
    const spaceBelow = screenHeight - y;
    setMenuDirection(spaceBelow < MENU_HEIGHT + BOTTOM_AREA ? "top" : "bottom");
    setMenuPosition({ x: 20, y: spaceBelow < MENU_HEIGHT + BOTTOM_AREA ? y - MENU_HEIGHT : y });
    Vibration.vibrate(20);

    menuAnim.setValue(0);
    Animated.timing(menuAnim, { toValue: 1, duration: 250, useNativeDriver: false }).start();
  };

  const closeMenu = () => {
    Animated.timing(menuAnim, { toValue: 0, duration: 150, useNativeDriver: false }).start(() => setSelectedTaskId(null));
  };

  const groupedTasks = tasks
    .filter(t => t.done)
    .slice()
    .reverse()
    .reduce((acc: any[], task) => {
      const dateStr = new Date(task.time).toLocaleDateString();
      const group = acc.find(g => g.title === dateStr);
      if (group) group.data.push(task);
      else acc.push({ title: dateStr, data: [task] });
      return acc;
    }, []);

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={styles.bar} />
      <View style={[styles.containerLittle, {backgroundColor: theme.background}]}>
        <CustomHeader onProfilePress={() => navigation.navigate("ProfileView")} />
        <SectionList
          style={{ marginBottom: 40 }}
          sections={groupedTasks}
          keyExtractor={(item) => item.id}
          renderSectionHeader={({ section }) => (
            <Text style={[styles.sectionHeader, {color: theme.subText}]}>{section.title}</Text>
          )}
          renderItem={({ item, index, section }) => (
            <TodoItem
              item={item}
              index={index}
              isFirst={index === 0}
              isLast={index === section.data.length - 1}
              onToggle={() => {editTask(item, true)}}
              onLongPress={(y) => openMenu(item.id, y)}
            />
          )}
        />
            {selectedTaskId && (() => {
              const task = tasks.find(t => t.id === selectedTaskId);
              if (!task) return null;
              return (
                <TaskContextMenu
                  task={task}
                  visible={true}
                  menuAnim={menuAnim}
                  menuPositionY={menuPosition.y}
                  onClose={closeMenu}
                  onMarkDone={markDone}
                  onEdit={(task) => editTask(task, false)}
                  onDelete={deleteTaskHandler}
                  modalVisible={modalVisible}
                  setModalVisible={setModalVisible}
                />
              );
            })()}
        <LeftMenu
          buttons={[
            { icon: "home-outline", onPress: () => navigation.navigate("MainPage"), size: 26 },
            { icon: "trash-outline", onPress: () => navigation.navigate("DeletedTasks"), size: 24 },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { height: 35, width: "100%" },
  container: { flex: 1 },
  containerLittle: { flex: 1, justifyContent: "flex-end", paddingHorizontal: 10 },
  sectionHeader: { fontSize: 11, fontWeight: "bold", marginVertical: 5 },
});

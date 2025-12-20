import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  Animated,
  Image,
  Easing,
  Vibration,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import LeftMenu from "../../components/MenuBar";
import CustomHeader from "../../components/CustomHeader";
import { UserTask } from "../types/userTypes";
import { getActiveUser, updateTask, softDeleteTask } from "../../service/storage";
import TodoItem from "../../components/TodoItem";
import TaskContextMenu from "../../components/TaskContextMenu";
import { useTheme } from "../../theme/ThemeContext";
import AdminIcon from "../../assets/admin_icon.png";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export default function MainPage({ navigation }: any) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [menuDirection, setMenuDirection] = useState<"top" | "bottom">("bottom");
  const [modalVisible, setModalVisible] = useState(false);

  type TaskTab = "main" | "done" | "deleted";
  const [activeTab, setActiveTab] = useState<TaskTab>("main");
  const menuAnim = useRef(new Animated.Value(0)).current;
  const listAnim = useRef(new Animated.Value(0)).current;
  const listOpacity = useRef(new Animated.Value(10)).current;
  const MENU_HEIGHT = 200;
  const BOTTOM_AREA = 100;

  // Load user
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const activeUser = await getActiveUser();
        if (!activeUser) {
          navigation.reset({ index: 0, routes: [{ name: "LoginCodePage" }] });
          return;
        }
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
      const updatedTask: UserTask = { ...task, done: !task.done };
      await updateTask(activeUser.username, task.id, updatedTask);
      const updatedTasks = activeUser.usertasks.map(t => t.id === task.id ? updatedTask : t);
      setTasks(updatedTasks);
      closeMenu();
      showMessage({ message: "Vazifa statusi o'zgartirildi!", type: "success" });
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
      closeMenu();
      showMessage({ message: "Vazifa o'chirildi (soft-delete)", type: "success" });
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

  // Group tasks by date
  const groupedTasks = tasks
    .filter(t => {
      if (activeTab === "main") return !t.isDeleted && !t.done;
      if (activeTab === "done") return t.done;
      if (activeTab === "deleted") return t.isDeleted;
      return true;
    })
    .slice()
    .reverse()
    .reduce((acc: any[], task) => {
      const date = new Date(task.time);
      const dateKey = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
      const title = date.toLocaleDateString("uz-Uz");
      const group = acc.find(g => g.dateKey === dateKey);
      if (group) group.data.push(task);
      else acc.push({ title, dateKey, data: [task] });
      return acc;
    }, [])
    .sort((a, b) => b.dateKey - a.dateKey);

  const hasTasks = groupedTasks.some(section => section.data.length > 0);
  const BOTTOM_BAR_HEIGHT = 80;

  // Animate tab change
const TAB_ORDER: TaskTab[] = ["main", "done", "deleted"];

const onTabPress = (tab: TaskTab) => {
  if (tab === activeTab) return;
  const currentIndex = TAB_ORDER.indexOf(activeTab);
  const nextIndex = TAB_ORDER.indexOf(tab);
  const fromX = nextIndex > currentIndex ? 300 : -300;
  listAnim.setValue(fromX);
  listOpacity.setValue(0);
  setActiveTab(tab);
  Animated.timing(listAnim, {
    toValue: 0,
    duration: 300,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();
  Animated.timing(listOpacity, {
    toValue: 1,
    duration: 150,
    delay: 100,
    useNativeDriver: true,
  }).start();
};


  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.bar} />
      <View style={[styles.containerLittle, { backgroundColor: theme.background }]}>
        <CustomHeader onProfilePress={() => navigation.navigate("ProfileView")} />

        {hasTasks ? (
          <Animated.View
              style={{
                flex: 1,
                transform: [{ translateX: listAnim }],
                opacity: listOpacity,
              }}
            >
              <SectionList
                contentContainerStyle={{ paddingBottom: BOTTOM_BAR_HEIGHT + insets.bottom + 16 }}
                style={{ marginBottom: 40, borderRadius: 12 }}
                sections={groupedTasks}
                keyExtractor={(item) => item.id}
                renderSectionHeader={({ section }) => (
                  <Text style={[styles.sectionHeader, { color: theme.subText }]}>{section.title}</Text>
                )}
                renderItem={({ item, index, section }) => (
                  <TodoItem
                    item={item}
                    index={index}
                    isFirst={index === 0}
                    isLast={index === section.data.length - 1}
                    onToggle={() => editTask(item, true)}
                    onLongPress={(y) => openMenu(item.id, y)}
                  />
                )}
              />
            </Animated.View>

        ) : (
          <View style={{ flex: 1, alignItems: "center" }}>
            <Image source={AdminIcon} style={styles.icon} />
            <Text style={[styles.description, { color: theme.text }]}>
              Bu yerda kun tartibingiz bo'yicha vazifalarni yozishingiz mumkin.
            </Text>
          </View>
        )}

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
            { icon: "home-outline", onPress: () => onTabPress("main"), size: 26, color: activeTab === "main" ? theme.primary : theme.text },
            { icon: "checkbox-outline", onPress: () => onTabPress("done"), size: 26, color: activeTab === "done" ? theme.primary : theme.text },
            { icon: "trash-outline", onPress: () => onTabPress("deleted"), size: 24, color: activeTab === "deleted" ? theme.primary : theme.text },
            { icon: "calendar-outline", onPress: () => navigation.navigate("Business"), size: 24 },
            { icon: "add-outline", onPress: () => navigation.navigate("AddPage"), marginLeft: "auto"},
          ]}
          containerStyle={{ width: "100%", paddingBottom: insets.bottom + 8 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  description: { fontSize: 16, textAlign: "center", marginTop: 15, color: "#555" },
  icon: { width: 200, height: 200, resizeMode: "contain" },
  bar: { height: 35, width: "100%" },
  container: { flex: 1 },
  containerLittle: { flex: 1, justifyContent: "flex-start", paddingHorizontal: 10 },
  sectionHeader: { fontSize: 11, fontWeight: "bold", marginVertical: 5 },
});

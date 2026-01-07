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
import LeftMenu from "../../components/global/MenuBar";
import CustomHeader from "../../components/Task/CustomHeader";
import { UserTask } from "../types/userTypes";
import { getActiveUser, updateTask, softDeleteTask } from "../../service/storage";
import TodoItem from "../../components/Task/TodoItem";
import TaskContextMenu from "../../components/global/TaskContextMenu";
import { useTheme } from "../../theme/ThemeContext";
import AdminIcon from "../../assets/admin_icon.png";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";

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
        const newDone = !task.done;
        const updatedTask: UserTask = {
          ...task,
          done: newDone,
          isReturning: newDone === false ? (task.isReturning || 0) + 1 : task.isReturning,
        };
        await updateTask(activeUser.username, task.id, updatedTask);
        const updatedTasks = activeUser.usertasks.map(t => t.id === task.id ? updatedTask : t);
        setTasks(updatedTasks);
        closeMenu();
        showMessage({ message: "Vazifa statusi o'zgartirildi!", type: "success" });
      } catch (e) {
        showMessage({ message: String(e), type: "danger" });
      }
  };

  let startX = 0;
  let startY = 0;
  const handlePressIn = (e: any) => {
    startX = e.nativeEvent.pageX;
    startY = e.nativeEvent.pageY;
  };
  const editTask = (task: UserTask, initialView: boolean, e?: any) => {
      if (e) {
        const dx = Math.abs(e.nativeEvent.pageX - startX);
        const dy = Math.abs(e.nativeEvent.pageY - startY);
        if (dx >= 5 || dy >= 5) return; // swipe bo‘lsa chiqmaydi
      }
      // event yo‘q yoki tap bo‘lsa
      closeMenu();
      setTimeout(() => {
        navigation.navigate(initialView ? "ViewTask" : "AddPage", { task });
      }, 0);
    };

  const onSetAlarm = async (task: UserTask, date: Date) => {
      try {
        const activeUser = await getActiveUser();
        if (!activeUser) return;
        if (task.notificationId) {
          await Notifications.cancelScheduledNotificationAsync(task.notificationId);
        }
        const trigger = {
          type: "date",
          date,
        };
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: {
            title: "⏰ Vazifa eslatmasi",
            body: task.title || "Vaqt bo‘ldi",
            sound: true,
          },
            //@ts-ignore
          trigger,
        });
        await updateTask(activeUser.username, task.id, {
          alarmDate: date.toISOString(),
          notificationId,
        });
        setTasks(prev =>
          prev.map(t =>
            t.id === task.id
              ? { ...t, alarmDate: date.toISOString(), notificationId }
              : t
          )
        );
        showMessage({ message: "Bildirishnoma saqlandi!", type: "success" });
      } catch (e) {
          console.log(e);
        showMessage({ message: "Bildirishnoma xatosi", type: "danger" });
      }
  };
  const onRemoveAlarm = async (task: UserTask) => {
      try {
        const activeUser = await getActiveUser();
        if (!activeUser) return;
        if (task.notificationId) {
          await Notifications.cancelScheduledNotificationAsync(task.notificationId);
        }
        await updateTask(activeUser.username, task.id, {
          alarmDate: null,
          notificationId: null,
        });
        setTasks(prev =>
          prev.map(t =>
            t.id === task.id
              ? { ...t, alarmDate: null, notificationId: null }
              : t
          )
        );
        closeMenu();
        showMessage({
          message: "Qo‘ng‘iroq o‘chirildi",
          type: "success",
        });
      } catch (e) {
        console.log(e);
        showMessage({
          message: "Qo‘ng‘iroqni o‘chirishda xato",
          type: "danger",
        });
      }
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
    duration: 200,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();
  Animated.timing(listOpacity, {
    toValue: 1,
    duration: 50,
    delay: 20,
    useNativeDriver: true,
  }).start();
};


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
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
                contentContainerStyle={{ paddingBottom: BOTTOM_BAR_HEIGHT }}
                style={{ marginBottom: 30, borderRadius: 12 }}
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
                    onPressIn={handlePressIn}
                    onPress={(e) => editTask(item, true, e)}
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
              onSetAlarm={onSetAlarm}
              onRemoveAlarm={onRemoveAlarm}
            />
          );
        })()}

        <LeftMenu
          buttons={[
            // { icon: "person-outline", onPress: () => navigation.navigate("ProfileView"), size: 22, color: "transparent" },
            { icon: "list-outline", onPress: () => onTabPress("main"), size: 24, color: activeTab === "main" ? "#fff" : "transparent" },
            { icon: "checkbox-outline", onPress: () => onTabPress("done"), size: 24, color: activeTab === "done" ? "#fff" : "transparent" },
            { icon: "trash-outline", onPress: () => onTabPress("deleted"), size: 22, color: activeTab === "deleted" ? "#fff" : "transparent" },
            { icon: "add-outline", onPress: () => navigation.navigate("AddPage"), marginLeft: "auto", color: "transparent"},
          ]}
          containerStyle={{ width: "100%", paddingBottom: insets.bottom + 8 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  description: { fontSize: 16, textAlign: "center", marginTop: 15, color: "#555" },
  icon: { width: 200, height: 200, resizeMode: "contain" },
  containerLittle: { flex: 1, justifyContent: "flex-start", paddingHorizontal: 10 },
  sectionHeader: { fontSize: 11, fontWeight: "bold", marginVertical: 5 },
});

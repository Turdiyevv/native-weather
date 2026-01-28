// MainPage.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  Animated,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { UserTask } from "../types/userTypes";
import { getActiveUser, updateTask, softDeleteTask } from "../../service/storage";
import TodoItem from "../../components/Task/TodoItem";
import { useTheme } from "../../theme/ThemeContext";
import AdminIcon from "../../assets/admin_icon.png";
import * as Notifications from "expo-notifications";
import {useScrollHandler} from "../../utills/ScrollContext";

export default function MainPage({ navigation }: any) {
  const { theme } = useTheme();
  const scrollHandler = useScrollHandler();
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [openMenuTaskId, setOpenMenuTaskId] = useState<string | null>(null);

  type TaskTab = "main" | "done" | "deleted";
  const [activeTab, setActiveTab] = useState<TaskTab>("main");
  const listAnim = useRef(new Animated.Value(0)).current;
  const listOpacity = useRef(new Animated.Value(1)).current;

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
      showMessage({ message: "Vazifa statusi o'zgartirildi!", type: "success" });
    } catch (e) {
      showMessage({ message: String(e), type: "danger" });
    }
  };

  const handleItemPress = (task: UserTask) => {
    if (openMenuTaskId) {
      handleCloseMenu();
      return;
    }
    editTask(task, true);
  };

  const editTask = (task: UserTask, initialView: boolean) => {
    navigation.navigate(initialView ? "ViewTask" : "AddPage", { task });
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
          body: task.title || "Vaqt bo'ldi",
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
      showMessage({
        message: "Qo'ng'iroq o'chirildi",
        type: "success",
      });
    } catch (e) {
      console.log(e);
      showMessage({
        message: "Qo'ng'iroqni o'chirishda xato",
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
      showMessage({ message: "Vazifa o'chirildi (soft-delete)", type: "success" });
    } catch (e) {
      showMessage({ message: String(e), type: "danger" });
    }
  };

  const handleOpenMenu = (taskId: string) => {
    setOpenMenuTaskId(taskId);
  };

  const handleCloseMenu = () => {
    setOpenMenuTaskId(null);
  };

  const groupedTasks = tasks
    .filter(t => {return !t.isDeleted && !t.done;})
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

  return (
    <TouchableWithoutFeedback onPress={handleCloseMenu}>
      <View style={[styles.containerLittle, { backgroundColor: theme.background }]}>
        {hasTasks ? (
          <Animated.View
            style={{
              flex: 1,
              width: "100%",
              transform: [{ translateX: listAnim }],
              opacity: listOpacity,
            }}
          >
            <SectionList
              contentContainerStyle={{}}
              style={{ marginVertical: 1, borderRadius: 12 }}
              sections={groupedTasks}
              keyExtractor={(item) => item.id}
              onScroll={scrollHandler?.handleScroll}
              scrollEventThrottle={16}
              renderSectionHeader={({ section }) => (
                <Text style={[styles.sectionHeader, { color: theme.subText }]}>
                  {section.title}
                </Text>
              )}
              renderItem={({ item, index, section }) => (
                <TodoItem
                  item={item}
                  index={index}
                  isFirst={index === 0}
                  isLast={index === section.data.length - 1}
                  onPress={() => handleItemPress(item)}
                  onMarkDone={markDone}
                  onEdit={editTask}
                  onDelete={deleteTaskHandler}
                  onSetAlarm={onSetAlarm}
                  onRemoveAlarm={onRemoveAlarm}
                  isMenuOpen={openMenuTaskId === item.id}
                  onOpenMenu={handleOpenMenu}
                  onCloseMenu={handleCloseMenu}
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
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  description: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    color: "#555",
  },
  icon: { width: 200, height: 200, resizeMode: "contain" },
  containerLittle: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "bold",
    marginVertical: 5,
  },
});
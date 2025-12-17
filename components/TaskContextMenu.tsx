import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ConfirmModal from "./ConfirmModal";
import {UserTask} from "../pages/types/userTypes";
import {useTheme} from "../theme/ThemeContext";

interface Props {
  task: UserTask;
  visible: boolean;
  menuAnim: Animated.Value;
  menuPositionY: number;
  onClose: () => void;
  onMarkDone: (task: UserTask) => void;
  onEdit: (task: UserTask) => void;
  onDelete: (task: UserTask) => void;
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
}
export default function TaskContextMenu({
  task,
  visible,
  menuAnim,
  menuPositionY,
  onClose,
  onMarkDone,
  onEdit,
  onDelete,
  modalVisible,
  setModalVisible,
}: Props) {

    const { theme } = useTheme();
  if (!visible) return null;

  const menuStyle: Animated.AnimatedProps<any> = {
    position: "absolute",
    right: 20,
    top: menuPositionY,
    width: menuAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 200],
    }),
    opacity: menuAnim,
    transform: [{ scale: menuAnim }],
    backgroundColor: theme.card,
    borderRadius: 10,
    paddingVertical: 10,
    overflow: "hidden",
  };

  return (
    <TouchableOpacity
      style={styles.menuOverlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <Animated.View style={menuStyle}>
        <View style={styles.menuButtonTitle}>
          <Text style={styles.taskTitle}>
            {task.title.length > 16
              ? task.title.slice(0, 16) + "..."
              : task.title}
          </Text>
          <Ionicons name="document-outline" size={20} color="gray" />
        </View>

        <TouchableOpacity
          style={[styles.menuButton, (!!task?.isDeleted || task.isReturning >=9) && { opacity: 0.4 }]}
          onPress={() => onMarkDone(task)}
          disabled={!!task?.isDeleted || (!!task.done && task.isReturning >=9)}
        >
          <Text style={[styles.menuText, {color: theme.text}]}>
            {task.done ? "Qaytarish" : "Bajarildi"}
          </Text>
          <Ionicons
            name={task.done ? "arrow-undo-outline" : "checkmark-circle-outline"}
            size={20}
            color={task.done ? "orange" : "green"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButton, (!!task?.isDeleted|| !!task?.done) ? { opacity: 0.4 }:{}]}
          onPress={() => onEdit(task)}
          disabled={!!task?.isDeleted || !!task?.done}
        >
          <Text style={[styles.menuText, {color: theme.text}]}>Tahrirlash</Text>
          <Ionicons name="create-outline" size={20} color="blue" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuButtonDel, !!task?.isDeleted && { opacity: 0.4 }]}
          onPress={() => setModalVisible(true)}
          disabled={!!task?.isDeleted}
        >
          <Text style={[styles.menuText, { color: "red" }]}>
            O'chirish
          </Text>
          <Ionicons name="trash-outline" size={20} color="red" />
        </TouchableOpacity>
      </Animated.View>

      <ConfirmModal
        visible={modalVisible}
        message="Ishonchingiz komilmi?"
        onConfirm={() => {
          onDelete(task);
          setModalVisible(false);
        }}
        onCancel={() => setModalVisible(false)}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  taskTitle: { fontSize: 16, color: "#007AFF" },
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
  menuText: { fontSize: 16 },
});

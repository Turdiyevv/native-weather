import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ConfirmModal from "../global/ConfirmModal";
import { UserTask } from "../../pages/types/userTypes";
import { useTheme } from "../../theme/ThemeContext";
import DateTimePickerModalComponent from "../global/DateTimePickerModalComponent";

interface Props {
  task: UserTask;
  menuAnim: Animated.Value;
  onClose: () => void;
  onMarkDone: (task: UserTask) => void;
  onEdit: (task: UserTask, initialView: boolean) => void;
  onDelete: (task: UserTask) => void;
  onSetAlarm: (task: UserTask, date: Date) => void;
  onRemoveAlarm: (task: UserTask) => void;
}

const screenHeight = Dimensions.get("window").height;
const MENU_HEIGHT = 175;

export default function TaskContextMenu({
  task,
  menuAnim,
  onClose,
  onMarkDone,
  onEdit,
  onDelete,
  onSetAlarm,
  onRemoveAlarm,
}: Props) {
  const { theme } = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Menu joylashuvini aniqlash
  const [menuPosition, setMenuPosition] = useState({ top: 0, bottom: 0 });

  React.useEffect(() => {
    // Item balandligi taxminan 64px, menu pastda ochiladi
    const spaceBelow = screenHeight - 64; // Soddaroq variant
    if (spaceBelow >= MENU_HEIGHT + 50) {
      // Pastda joy bor
      setMenuPosition({ top: 64, bottom: undefined });
    } else {
      // Pastda joy yo'q - tepaga
      setMenuPosition({ top: undefined, bottom: 64 });
    }
  }, []);

  const menuStyle: any = {
    position: "absolute",
    right: 10,
    ...menuPosition,
    width: menuAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 220],
    }),
    height: menuAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, MENU_HEIGHT],
    }),
    opacity: menuAnim,
    backgroundColor: theme.card,
    borderRadius: 10,
    paddingVertical: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  };

  return (
    <>
      {/* Overlay */}
      <TouchableOpacity
        style={styles.menuOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Animated.View style={menuStyle}>
          {/* Qo'ng'iroq */}
          <TouchableOpacity
            style={[
              styles.menuButtonTitle,
              { borderColor: theme.background },
              !!task?.isDeleted && { opacity: 0.4 },
            ]}
            onPress={() => {
              if (task.alarmDate) {
                onRemoveAlarm(task);
                onClose();
              } else {
                setShowPicker(true);
              }
            }}
            disabled={!!task?.isDeleted}
          >
            <Text
              style={[
                styles.taskTitle,
                { color: !!task.alarmDate ? theme.text : theme.primary },
              ]}
            >
              {task.alarmDate
                ? "Qo'ng'iroqni o'chirish"
                : "Qo'ng'iroqni o'rnatish"}
            </Text>
            <Ionicons name="time-outline" size={18} color={theme.text} />
          </TouchableOpacity>

          {/* Bajarildi / Qaytarish */}
          <TouchableOpacity
            style={[
              styles.menuButton,
              { borderColor: theme.background },
              (!!task?.isDeleted || task.isReturning >= 9) && { opacity: 0.4 },
            ]}
            onPress={() => {
              onMarkDone(task);
              onClose();
            }}
            disabled={!!task?.isDeleted || (!!task.done && task.isReturning >= 9)}
          >
            <Text style={[styles.menuText, { color: theme.text }]}>
              {task.done ? "Qaytarish" : "Bajarildi"}
            </Text>
            <Ionicons
              name={
                task.done ? "arrow-undo-outline" : "checkmark-circle-outline"
              }
              size={20}
              color={task.done ? "orange" : "green"}
            />
          </TouchableOpacity>

          {/* Tahrirlash */}
          <TouchableOpacity
            style={[
              styles.menuButton,
              { borderColor: theme.background },
              (!!task?.isDeleted || !!task?.done) && { opacity: 0.4 },
            ]}
            onPress={() => {
              onEdit(task, false);
              onClose();
            }}
            disabled={!!task?.isDeleted || !!task?.done}
          >
            <Text style={[styles.menuText, { color: theme.text }]}>
              Tahrirlash
            </Text>
            <Ionicons name="create-outline" size={20} color="blue" />
          </TouchableOpacity>

          {/* O'chirish */}
          <TouchableOpacity
            style={[
              styles.menuButtonDel,
              !!task?.isDeleted && { opacity: 0.4 },
            ]}
            onPress={() => setModalVisible(true)}
            disabled={!!task?.isDeleted}
          >
            <Text style={[styles.menuText, { color: "red" }]}>Arxivlash</Text>
            <Ionicons name="archive-outline" size={20} color="red" />
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>

      {/* Confirm modal */}
      <ConfirmModal
        visible={modalVisible}
        message="Element arxivga tushuriladi. Ishonchingiz komilmi?"
        onConfirm={() => {
          onDelete(task);
          setModalVisible(false);
          onClose();
        }}
        onCancel={() => setModalVisible(false)}
      />

      {/* DateTime picker modal */}
      <DateTimePickerModalComponent
        isVisible={showPicker}
        onConfirm={(date) => {
          setShowPicker(false);
          onSetAlarm(task, date);
          onClose();
        }}
        onCancel={() => {
          setShowPicker(false);
          onClose();
        }}
      />
    </>
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
    zIndex: 999,
  },
  taskTitle: { fontSize: 16 },
  menuButtonTitle: {
    paddingTop: 3,
    paddingBottom: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
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
  },
  menuButtonDel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 3,
    paddingHorizontal: 15,
  },
  menuText: { fontSize: 16 },
});
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
import { UserTask } from "../../pages/types/userTypes";
import { useTheme } from "../../theme/ThemeContext";
import * as Notifications from "expo-notifications";
import DateTimePickerModalComponent from "./DateTimePickerModalComponent";
import {showMessage} from "react-native-flash-message";

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
  onSetAlarm: (task: UserTask, date: Date) => void;
  onRemoveAlarm: (task: UserTask) => void;
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
  onSetAlarm,
  onRemoveAlarm
}: Props) {
  const { theme } = useTheme();
  const [showPicker, setShowPicker] = React.useState(false);

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
        {/* Qo‘ng‘iroq */}
        <TouchableOpacity
          style={[
            styles.menuButtonTitle,
            { borderColor: theme.background },
            !!task?.isDeleted && { opacity: 0.4 },
          ]}
          onPress={() => {
            if (task.alarmDate) {
              onRemoveAlarm(task);
            } else {
              setShowPicker(true);
            }
          }}
          disabled={!!task?.isDeleted}
        >
          <Text style={[styles.taskTitle, {color: !!task.alarmDate ? theme.text : theme.primary }]}>
              {task.alarmDate ? "Qo'ng'iroqni o'chirish" : "Qo'ng'iroqni o'rnatish"}
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
          onPress={() => onMarkDone(task)}
          disabled={!!task?.isDeleted || (!!task.done && task.isReturning >= 9)}
        >
          <Text style={[styles.menuText, { color: theme.text }]}>
            {task.done ? "Qaytarish" : "Bajarildi"}
          </Text>
          <Ionicons
            name={task.done ? "arrow-undo-outline" : "checkmark-circle-outline"}
            size={20}
            color={task.done ? "orange" : "green"}
          />
        </TouchableOpacity>

        {/* Tahrirlash */}
        <TouchableOpacity
          style={[
            styles.menuButton,
            { borderColor: theme.background },
            (!!task?.isDeleted || !!task?.done) ? { opacity: 0.4 } : {},
          ]}
          onPress={() => onEdit(task)}
          disabled={!!task?.isDeleted || !!task?.done}
        >
          <Text style={[styles.menuText, { color: theme.text }]}>Tahrirlash</Text>
          <Ionicons name="create-outline" size={20} color="blue" />
        </TouchableOpacity>

        {/* O‘chirish */}
        <TouchableOpacity
          style={[styles.menuButtonDel, !!task?.isDeleted && { opacity: 0.4 }]}
          onPress={() => setModalVisible(true)}
          disabled={!!task?.isDeleted}
        >
          <Text style={[styles.menuText, { color: "red" }]}>O'chirish</Text>
          <Ionicons name="trash-outline" size={20} color="red" />
        </TouchableOpacity>
      </Animated.View>

      {/* Confirm modal */}
      <ConfirmModal
        visible={modalVisible}
        message="Element arxivga tushuriladi. Ishonchingiz komilmi?"
        onConfirm={() => {
          onDelete(task);
          setModalVisible(false);
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

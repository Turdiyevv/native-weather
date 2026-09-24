import { useRef, useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Vibration,
  Animated,
} from "react-native";
import { UserTask } from "../../pages/types/userTypes";
import { useTheme } from "../../theme/ThemeContext";
import TaskContextMenu from "./TaskContextMenu";

interface TaskRowProps {
  item: UserTask;
  index: number;
  isMenuOpen: boolean;
  onPress: () => void;
  onMarkDone: (task: UserTask) => void;
  onEdit: (task: UserTask, initialView: boolean) => void;
  onDelete: (task: UserTask) => void;
  onSetAlarm: (task: UserTask, date: Date) => void;
  onRemoveAlarm: (task: UserTask) => void;
  onOpenMenu: (taskId: string) => void;
  onCloseMenu: () => void;
}

export default function TaskRow({
  item,
  isMenuOpen,
  onPress,
  onMarkDone,
  onEdit,
  onDelete,
  onSetAlarm,
  onRemoveAlarm,
  onOpenMenu,
  onCloseMenu,
}: TaskRowProps) {
  const { theme } = useTheme();
  const menuAnim = useRef(new Animated.Value(0)).current;
  const itemRef = useRef<View>(null);
  const [itemLayout, setItemLayout] = useState<{ y: number; height: number } | null>(null);

  // Menu animation
  useEffect(() => {
    Animated.timing(menuAnim, {
      toValue: isMenuOpen ? 1 : 0,
      duration: isMenuOpen ? 200 : 150,
      useNativeDriver: false,
    }).start();
  }, [isMenuOpen]);

  // Press handlers
  let startX = 0;
  let startY = 0;
  const handlePressIn = (e: any) => {
    startX = e.nativeEvent.pageX;
    startY = e.nativeEvent.pageY;
  };
  const handlePress = (e: any) => {
    const dx = Math.abs(e.nativeEvent.pageX - startX);
    const dy = Math.abs(e.nativeEvent.pageY - startY);
    if (dx >= 6 || dy >= 6) return;
    onPress();
  };
  const handleLongPress = () => {
    Vibration.vibrate(20);
    if (itemRef.current) {
      itemRef.current.measureInWindow((_x, y, _width, height) => {
        setItemLayout({ y, height });
      });
    }
    onOpenMenu(item.id);
  };

  const taskColor =
    item.status === 1
      ? theme.success
      : item.status === 3
        ? theme.danger
        : theme.isDark
          ? "#FBBF24"
          : "#C47A00";
  const createdTime = new Date(item.time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <View ref={itemRef}>
      <TouchableOpacity
        activeOpacity={0.65}
        onPressIn={handlePressIn}
        onPress={handlePress}
        onLongPress={handleLongPress}
        style={[
          styles.row,
          item.isDeleted && styles.archivedRow,
        ]}
      >
        <View style={styles.taskLine}>
          <View style={[styles.dot, { backgroundColor: taskColor }]} />
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[styles.title, { color: taskColor }, item.done && styles.doneTitle]}
          >
            {item.title}
          </Text>
          <Text style={[styles.time, { color: theme.placeholder }]}>
            {createdTime}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Context Menu */}
      {isMenuOpen && (
        <TaskContextMenu
          task={item}
          menuAnim={menuAnim}
          onClose={onCloseMenu}
          onMarkDone={onMarkDone}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetAlarm={onSetAlarm}
          onRemoveAlarm={onRemoveAlarm}
          itemLayout={itemLayout}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  archivedRow: {
    opacity: 0.55,
  },
  taskLine: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 24,
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  },
  time: {
    fontSize: 11,
    lineHeight: 18,
    flexShrink: 0,
  },
  doneTitle: {
    textDecorationLine: "line-through",
  },
});

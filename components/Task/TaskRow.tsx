import { useRef, useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Vibration,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  onLongPressDrag?: () => void;
  isDragging?: boolean;
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
  onLongPressDrag,
  isDragging,
}: TaskRowProps) {
  const { theme } = useTheme();
  const menuAnim = useRef(new Animated.Value(0)).current;
  const itemRef = useRef<View>(null);
  const titleRef = useRef<View>(null);
  const [itemLayout, setItemLayout] = useState<{ y: number; height: number } | null>(null);

  // Menu animation
  useEffect(() => {
    Animated.timing(menuAnim, {
      toValue: isMenuOpen ? 1 : 0,
      duration: isMenuOpen ? 200 : 150,
      useNativeDriver: false,
    }).start();
  }, [isMenuOpen]);

  // Press handlers - Title long press
  let startX = 0;
  let startY = 0;
  const handleTitlePressIn = (e: any) => {
    startX = e.nativeEvent.pageX;
    startY = e.nativeEvent.pageY;
  };
  const handleTitlePress = (e: any) => {
    const dx = Math.abs(e.nativeEvent.pageX - startX);
    const dy = Math.abs(e.nativeEvent.pageY - startY);
    if (dx >= 6 || dy >= 6) return;
    onPress();
  };
  const handleTitleLongPress = () => {
    Vibration.vibrate(20);
    if (titleRef.current) {
      titleRef.current.measureInWindow((_x, y, _width, height) => {
        setItemLayout({ y, height });
      });
    }
    onOpenMenu(item.id);
  };

  // Burger icon long press - Reorder
  const handleBurgerLongPress = () => {
    Vibration.vibrate([20, 30, 20]);
    onLongPressDrag?.();
  };

  // Qiyinlik nuqta rangi (status asosida)
  const difficultyColor =
    item.status === 1
      ? theme.success
      : item.status === 3
        ? theme.danger
        : theme.isDark
          ? "#FBBF24"
          : "#C47A00";

  // Sarlavha rangi: default, faqat bajarilaganlarda success
  const titleColor = item.done ? theme.success : theme.text;

  const createdTime = new Date(item.time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const displayTitle = item.title.slice(0, 30);

  return (
    <View ref={itemRef} style={[isDragging && { opacity: 0.6 }]}>
      <View style={styles.taskLine}>
        <View style={[styles.dot, { backgroundColor: difficultyColor }]} />
        
        {/* Title section - with menu trigger */}
        <TouchableOpacity
          ref={titleRef}
          activeOpacity={0.65}
          onPressIn={handleTitlePressIn}
          onPress={handleTitlePress}
          onLongPress={handleTitleLongPress}
          style={styles.titleSection}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="clip"
            style={[
              styles.title,
              { color: titleColor },
              item.isDeleted && styles.strikethrough,
            ]}
          >
            {displayTitle}
          </Text>
        </TouchableOpacity>

        {/* Burger icon - Reorder trigger */}
        <TouchableOpacity
          onLongPress={handleBurgerLongPress}
          activeOpacity={0.6}
          style={styles.burgerButton}
        >
          <Ionicons
            name="menu"
            size={16}
            color={isDragging ? theme.primary : theme.placeholder}
          />
        </TouchableOpacity>

        {/* Alarm icon */}
        {item.alarmDate && (
          <Ionicons
            name="alarm-outline"
            size={15}
            color={theme.placeholder}
            style={styles.alarmIcon}
          />
        )}
        
        {/* Time */}
        <Text style={[styles.time, { color: theme.placeholder }]}>
          {createdTime}
        </Text>
      </View>

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
    paddingVertical: 0.5,
  },
  archivedRow: {
    // opacity o'chirildi - faqat strikethrough qo'yiladi
  },
  taskLine: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 24,
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  titleSection: {
    flex: 1,
    paddingVertical: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
  },
  burgerButton: {
    padding: 4,
    marginHorizontal: -4,
  },
  time: {
    fontSize: 11,
    lineHeight: 18,
    flexShrink: 0,
  },
  alarmIcon: {
    marginLeft: -2,
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
});

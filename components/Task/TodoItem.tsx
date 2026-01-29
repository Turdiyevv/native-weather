import React, { useRef, useEffect, useState } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Dimensions,
  Vibration,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserTask } from "../../pages/types/userTypes";
import { useTheme } from "../../theme/ThemeContext";
import TaskContextMenu from "./TaskContextMenu";

interface TodoItemProps {
  item: UserTask;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onPress: () => void;
  onMarkDone: (task: UserTask) => void;
  onEdit: (task: UserTask, initialView: boolean) => void;
  onDelete: (task: UserTask) => void;
  onSetAlarm: (task: UserTask, date: Date) => void;
  onRemoveAlarm: (task: UserTask) => void;
  isMenuOpen: boolean;
  onOpenMenu: (taskId: string) => void;
  onCloseMenu: () => void;
}

export default function TodoItem({
  item,
  isFirst,
  isLast,
  onPress,
  onMarkDone,
  onEdit,
  onDelete,
  onSetAlarm,
  onRemoveAlarm,
  isMenuOpen,
  onOpenMenu,
  onCloseMenu,
}: TodoItemProps) {
  const { theme } = useTheme();
  const menuAnim = useRef(new Animated.Value(0)).current;
  const itemRef = useRef<View>(null);
  const [itemLayout, setItemLayout] = useState<{ y: number; height: number } | null>(null);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  let deadlineColor = "#2b87af";

  if (item.deadline) {
    const deadlineDate = new Date(item.deadline);
    if (
      deadlineDate.getFullYear() === today.getFullYear() &&
      deadlineDate.getMonth() === today.getMonth() &&
      deadlineDate.getDate() === today.getDate()
    ) {
      deadlineColor = "#fa5d5d"; // bugun
    } else if (
      deadlineDate.getFullYear() === tomorrow.getFullYear() &&
      deadlineDate.getMonth() === tomorrow.getMonth() &&
      deadlineDate.getDate() === tomorrow.getDate()
    ) {
      deadlineColor = "#fa5d5d"; // ertaga
    }
  }

  const createdTime = new Date(item.time);
  const formattedTime = createdTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const formattedDeadline = item.deadline
    ? new Date(item.deadline).toLocaleDateString()
    : null;
  const displayTitle =
    item.title.length > 26 ? item.title.slice(0, 26) + "..." : item.title;

  // Swipe detection
  let startX = 0;
  let startY = 0;

  const handlePressIn = (e: any) => {
    startX = e.nativeEvent.pageX;
    startY = e.nativeEvent.pageY;
  };

  const handlePress = (e: any) => {
    const dx = Math.abs(e.nativeEvent.pageX - startX);
    const dy = Math.abs(e.nativeEvent.pageY - startY);
    if (dx >= 5 || dy >= 5) return; // swipe bo'lsa
    onPress();
  };

  const handleLongPress = () => {
    Vibration.vibrate(20);

    // Item koordinatalarini olish
    if (itemRef.current) {
      itemRef.current.measureInWindow((x, y, width, height) => {
        setItemLayout({ y, height });
      });
    }

    onOpenMenu(item.id);
  };

  // Menu ochilganda animatsiya
  useEffect(() => {
    if (isMenuOpen) {
      menuAnim.setValue(0);
      Animated.timing(menuAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(menuAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  }, [isMenuOpen]);

  return (
    <View style={{ position: "relative" }} ref={itemRef}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[
          styles.item,
          { backgroundColor: theme.card, borderColor: theme.background },
          isFirst && styles.firstBorder,
          isLast && styles.lastBorder,
        ]}
        onPressIn={handlePressIn}
        onPress={handlePress}
        onLongPress={handleLongPress}
      >
        <View
          style={[
            styles.defaultItem,
            isFirst && styles.firstBorder,
            isLast && styles.lastBorder,
            item.isReturning && item.isReturning > 0 && !item.done
              ? styles.returningBorder
              : item.done
              ? styles.done
              : null,
            item.isDeleted && { backgroundColor: theme.deleted },
          ]}
        >
          <View style={styles.titleContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {item.files?.length > 0 && (
                <Ionicons name={"document"} color={"orange"} size={16} />
              )}
              <Text
                style={[
                  styles.text,
                  item.isDeleted && styles.doneText,
                  { color: theme.text },
                ]}
              >
                {displayTitle}
              </Text>
            </View>
            <View style={styles.iconBox}>
              {item.isReturning && item.isReturning > 0 && (
                <View style={styles.returnCount}>
                  <Ionicons
                    name="refresh-outline"
                    size={20}
                    color="#a19e9e"
                    style={styles.scale}
                  />
                  <Text style={[styles.returnCountText, { color: theme.text }]}>
                    {item.isReturning}
                  </Text>
                </View>
              )}
              {item.done && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#4CAF50"
                  style={{ marginLeft: 1 }}
                />
              )}
              {item.deadline?.length > 0 && (
                <Ionicons
                  name="alarm"
                  size={20}
                  color="#ff5300"
                  style={{ marginLeft: 1 }}
                />
              )}
              {((item.isDeleted && !item.done) ||
                deadlineColor === "#fa5d5d") && (
                <Ionicons
                  name="alert-circle"
                  size={20}
                  color="grey"
                  style={{ marginLeft: 1 }}
                />
              )}
              {item.isDeleted && (
                <Ionicons name="trash" size={16} color="red" />
              )}
            </View>
          </View>
          <View style={styles.titleContainer2}>
            {formattedDeadline ? (
              <Text style={[styles.deadline, { color: deadlineColor }]}>
                {formattedDeadline}
              </Text>
            ) : (
              <Text style={styles.deadlineBox}></Text>
            )}
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                formattedDeadline ? styles.description : styles.description2,
                { color: theme.description },
              ]}
            >
              {item.description}
            </Text>
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{formattedTime}</Text>
            </View>
          </View>
          <View
            style={[
              styles.draft,
              item.isReturning && item.isDeleted
                ? { right: 64 }
                : { right: 47 },
            ]}
          >
            {item.status > 1 && (
              <Ionicons
                name="bookmark"
                size={20}
                color={item.status === 2 ? "orange" : "#fb5151"}
              />
            )}
          </View>
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

const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  scale: { top: -1, transform: [{ scaleX: -1 }, { rotate: "40deg" }] },
  firstBorder: {
    borderTopLeftRadius: 12,
    borderTopEndRadius: 12,
    borderTopWidth: 0,
  },
  lastBorder: {
    borderBottomLeftRadius: 12,
    borderBottomEndRadius: 12,
    borderBottomWidth: 0,
  },
  deleted: { backgroundColor: "#e1e0e0" },
  returningBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#a19e9e",
    borderBottomWidth: 0,
  },
  done: {
    borderColor: "#4CAF50",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 0,
  },
  item: { marginBottom: 2, height: 64 },
  defaultItem: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 12,
    height: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  iconBox: { flexDirection: "row", alignItems: "center" },
  text: { fontSize: 15 },
  doneText: { textDecorationLine: "line-through", color: "gray" },
  returnCount: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  returnCountText: { marginLeft: 3, position: "absolute", fontSize: 11 },
  draft: { position: "absolute", top: -4 },
  deadline: { fontSize: 14, marginTop: 0 },
  deadlineBox: { height: 14, marginTop: 0 },
  timeContainer: { marginLeft: "auto" },
  time: { fontSize: 12, color: "gray" },
  description: { fontSize: 14, marginLeft: 3, maxWidth: screenWidth - 154 },
  description2: { fontSize: 14, marginLeft: 3, maxWidth: screenWidth - 84 },
});
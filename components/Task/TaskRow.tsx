import React, { useRef, useEffect, useState } from "react";
import {
  TouchableOpacity,
  Text,
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
}

const STATUS_COLORS: Record<number, string> = {
  1: "#10B981", // yashil — yengil
  2: "#F59E0B", // sariq — o'rtacha
  3: "#EF4444", // qizil — og'ir
};

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

  // Sarlavha rang
  const getTitleColor = () => {
    if (item.isDeleted) return theme.subText;
    if (item.done) return theme.subText;
    return STATUS_COLORS[item.status] ?? theme.text;
  };

  // Deadline rang
  const getDeadlineColor = () => {
    if (!item.deadline) return null;
    const dl = new Date(item.deadline);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    dl.setHours(0, 0, 0, 0);
    if (dl <= now) return theme.danger;
    return "#60A5FA";
  };

  const deadlineColor = getDeadlineColor();

  // Deadline matn (qisqa format)
  const getDeadlineText = () => {
    if (!item.deadline) return null;
    const dl = new Date(item.deadline);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dlDay = new Date(dl.getFullYear(), dl.getMonth(), dl.getDate());
    const diff = Math.round((dlDay.getTime() - today.getTime()) / 86400000);
    if (diff === 0) return "bugun";
    if (diff === 1) return "ertaga";
    if (diff === -1) return "kecha";
    if (diff < 0) return `${Math.abs(diff)}k oldin`;
    return dl.toLocaleDateString("uz-UZ", { day: "numeric", month: "short" });
  };

  // Vaqt (qo'shilgan vaqt)
  const createdTime = new Date(item.time).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

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
      itemRef.current.measureInWindow((x, y, width, height) => {
        setItemLayout({ y, height });
      });
    }
    onOpenMenu(item.id);
  };

  const titleColor = getTitleColor();

  return (
    <View ref={itemRef}>
      <TouchableOpacity
        activeOpacity={0.65}
        onPressIn={handlePressIn}
        onPress={handlePress}
        onLongPress={handleLongPress}
        style={[
          styles.row,
          item.isDeleted && { opacity: 0.5 },
        ]}
      >
        {/* Qator 1: sarlavha + vaqt */}
        <View style={styles.line1}>
          <Text
            numberOfLines={2}
            style={[
              styles.title,
              { color: titleColor },
              item.done && styles.doneTitle,
              item.isDeleted && styles.deletedTitle,
            ]}
          >
            {item.title}
          </Text>
          <Text style={[styles.time, { color: theme.subText }]}>
            {createdTime}
          </Text>
        </View>

        {/* Qator 2: tavsif + meta (deadline, alarm, fayl, qaytarish) */}
        {(item.description ||
          item.deadline ||
          item.alarmDate ||
          (item.files?.length > 0) ||
          (item.isReturning && item.isReturning > 0)) ? (
          <View style={styles.line2}>
            {/* Tavsif */}
            {!!item.description && (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.description, { color: theme.subText }]}
              >
                {item.description}
              </Text>
            )}

            {/* Meta iconlar va deadline */}
            <View style={styles.metaGroup}>
              {item.alarmDate && (
                <Ionicons name="alarm-outline" size={13} color={theme.subText} style={styles.metaIcon} />
              )}
              {item.files?.length > 0 && (
                <View style={styles.metaItem}>
                  <Ionicons name="attach-outline" size={13} color={theme.subText} />
                  <Text style={[styles.metaText, { color: theme.subText }]}>
                    {item.files.length}
                  </Text>
                </View>
              )}
              {item.isReturning && item.isReturning > 0 ? (
                <View style={styles.metaItem}>
                  <Ionicons name="refresh-outline" size={13} color={theme.subText} />
                  <Text style={[styles.metaText, { color: theme.subText }]}>
                    {item.isReturning}
                  </Text>
                </View>
              ) : null}
              {deadlineColor && (
                <Text style={[styles.deadline, { color: deadlineColor }]}>
                  {getDeadlineText()}
                </Text>
              )}
            </View>
          </View>
        ) : null}
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
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  line1: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 20,
  },
  doneTitle: {
    textDecorationLine: "line-through",
  },
  deletedTitle: {
    fontStyle: "italic",
  },
  time: {
    fontSize: 12,
    marginTop: 1,
    flexShrink: 0,
  },
  line2: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
    gap: 6,
  },
  description: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  metaGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexShrink: 0,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  metaIcon: {},
  metaText: {
    fontSize: 12,
  },
  deadline: {
    fontSize: 12,
    fontWeight: "600",
  },
});

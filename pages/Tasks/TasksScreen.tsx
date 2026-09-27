import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { showMessage } from "react-native-flash-message";
import * as Notifications from "expo-notifications";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useTheme } from "../../theme/ThemeContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { getActiveUser, softDeleteTask, updateTask } from "../../service/storage";
import { UserTask } from "../types/userTypes";
import { RootStackParamList } from "../types/types";
import TaskRow from "../../components/Task/TaskRow";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

// ─── Filter turlari ─────────────────────────────────────────────────────────
type FilterType = "all" | "active" | "done" | "archive";

const FILTERS: { key: FilterType; labelKey: string }[] = [
  { key: "all",     labelKey: "all"      },
  { key: "active",  labelKey: "current"  },
  { key: "done",    labelKey: "completed"},
  { key: "archive", labelKey: "archive"  },
];

// ─── Sana section headerini formatlash ──────────────────────────────────────
function formatSectionTitle(dateKey: number): string {
  const d = new Date(dateKey);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 86400000;

  if (dateKey === today) return "Bugun";
  if (dateKey === yesterday) return "Kecha";

  return d.toLocaleDateString("uz-UZ", {
    day: "numeric",
    month: "long",
    year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

// ─── Filterlash logikasi ─────────────────────────────────────────────────────
function applyFilter(task: UserTask, filter: FilterType): boolean {
  switch (filter) {
    case "active":  return !task.isDeleted && !task.done;
    case "done":    return !!task.done && !task.isDeleted;
    case "archive": return !!task.isDeleted;
    case "all":
    default:        return true;
  }
}

// ─── Sana bo'yicha guruhlar ───────────────────────────────────────────────────
function buildSections(tasks: UserTask[], filter: FilterType) {
  const filtered = tasks.filter(t => applyFilter(t, filter));

  const grouped = filtered.reduce((acc: any[], task) => {
    const d = new Date(task.time);
    const dateKey = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const existing = acc.find(g => g.dateKey === dateKey);
    if (existing) existing.data.push(task);
    else acc.push({ title: formatSectionTitle(dateKey), dateKey, data: [task] });
    return acc;
  }, []);

  return grouped.sort((a, b) => b.dateKey - a.dateKey);
}

// ─── Filter chip hisobi ────────────────────────────────────────────────────────
function countFilter(tasks: UserTask[], filter: FilterType): number {
  return tasks.filter(t => applyFilter(t, filter)).length;
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function TasksScreen() {
  const { theme } = useTheme();
  const { t }     = useLanguage();
  const navigation = useNavigation<NavProp>();

  const [tasks,         setTasks]         = useState<UserTask[]>([]);
  const [filter,        setFilter]        = useState<FilterType>("active");
  const [openMenuId,    setOpenMenuId]    = useState<string | null>(null);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);

  // FAB animated opacity/scale (scroll hide)
  const fabAnim  = useRef(new Animated.Value(1)).current;
  const lastScrollY = useRef(0);

  // ─── Ma'lumot yuklash ───────────────────────────────────────────────────────
  const loadTasks = useCallback(async () => {
    try {
      const user = await getActiveUser();
      if (!user) {
        navigation.reset({ index: 0, routes: [{ name: "LoginPage" }] });
        return;
      }
      setTasks(user.usertasks || []);
    } catch (e) {
      showMessage({ message: t("genericError"), type: "danger" });
    }
  }, [navigation]);

  useFocusEffect(useCallback(() => { loadTasks(); }, [loadTasks]));

  // Blur da menyuni yopish
  useEffect(() => {
    return navigation.addListener("blur", () => setOpenMenuId(null));
  }, [navigation]);

  // ─── Scroll — FAB yashirish ─────────────────────────────────────────────────
  const handleScroll = (e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    const dy = y - lastScrollY.current;
    lastScrollY.current = y;
    if (dy > 8 && y > 40) {
      Animated.timing(fabAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start();
    } else if (dy < -6) {
      Animated.timing(fabAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    }
  };

  // ─── Task actions ───────────────────────────────────────────────────────────
  const markDone = async (task: UserTask) => {
    const user = await getActiveUser();
    if (!user) return;
    const newDone = !task.done;
    const updated: UserTask = {
      ...task,
      done: newDone,
      isReturning: newDone === false ? (task.isReturning || 0) + 1 : task.isReturning,
    };
    await updateTask(user.username, task.id, updated);
    setTasks(prev => prev.map(t => (t.id === task.id ? updated : t)));
    showMessage({ message: newDone ? t("taskCompleted") : t("taskRestored"), type: "success" });
  };

  const editTask = (task: UserTask, view: boolean) => {
    navigation.navigate(view ? "ViewTask" : "AddPage", { task });
  };

  const archiveTask = async (task: UserTask) => {
    const user = await getActiveUser();
    if (!user) return;
    await softDeleteTask(user.username, task.id);
    setTasks(prev => prev.map(t => (t.id === task.id ? { ...t, isDeleted: true } : t)));
    showMessage({ message: t("taskArchived"), type: "success" });
  };

  const onSetAlarm = async (task: UserTask, date: Date) => {
    try {
      const user = await getActiveUser();
      if (!user) return;
      if (task.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(task.notificationId);
      }
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ ${t("notificationTask")}`,
          body: task.title || t("timeUp"),
          sound: true,
        },
        // @ts-ignore
        trigger: { type: "date", date },
      });
      await updateTask(user.username, task.id, {
        alarmDate: date.toISOString(),
        notificationId,
      });
      setTasks(prev =>
        prev.map(t =>
          t.id === task.id ? { ...t, alarmDate: date.toISOString(), notificationId } : t
        )
      );
      showMessage({ message: t("notificationSaved"), type: "success" });
    } catch {
      showMessage({ message: t("notificationError"), type: "danger" });
    }
  };

  const onRemoveAlarm = async (task: UserTask) => {
    const user = await getActiveUser();
    if (!user) return;
    if (task.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(task.notificationId);
    }
    await updateTask(user.username, task.id, { alarmDate: null, notificationId: null });
    setTasks(prev =>
      prev.map(t => (t.id === task.id ? { ...t, alarmDate: null, notificationId: null } : t))
    );
    showMessage({ message: t("alarmRemoved"), type: "success" });
  };

  // ─── Reorder logikasi ─────────────────────────────────────────────────────
  // (Future implementation: Advanced drag-and-drop with swipe gestures)

  // ─── Sections ──────────────────────────────────────────────────────────────
  const sections = buildSections(tasks, filter);

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <TouchableWithoutFeedback onPress={() => openMenuId && setOpenMenuId(null)}>
      <View style={[styles.screen, { backgroundColor: theme.background }]}>

        {/* ── Doimiy filter chip paneli ─── */}
        <View style={[styles.filterPanel, { backgroundColor: theme.background }]}>
          <View style={styles.filterRow}>
            {FILTERS.map(f => {
              const count = countFilter(tasks, f.key);
              const active = filter === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  onPress={() => {
                    setFilter(f.key);
                  }}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active ? theme.primary : theme.card,
                      borderColor: active ? theme.primary : theme.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: active ? "#fff" : theme.subText },
                    ]}
                    numberOfLines={1}
                  >
                    {t(f.labelKey)} · {count}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Asosiy ro'yxat ─────────────────────────────────────────── */}
        {sections.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={[styles.emptyText, { color: theme.subText }]}>
              {t("noTasks")}
            </Text>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={item => item.id}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.listContent}
            stickySectionHeadersEnabled={false}
            renderSectionHeader={({ section }) => (
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionDate, { color: theme.subText }]}>
                  {section.title}
                </Text>
                <Text style={[styles.sectionCount, { color: theme.subText }]}>
                  · {section.data.length} ta
                </Text>
              </View>
            )}
            renderSectionFooter={() => <View style={styles.sectionGap} />}
            renderItem={({ item, index }) => (
              <TaskRow
                item={item}
                index={index}
                isMenuOpen={openMenuId === item.id}
                isDragging={draggingTaskId === item.id}
                onPress={() => {
                  if (openMenuId) { setOpenMenuId(null); return; }
                  navigation.navigate("ViewTask", { task: item });
                }}
                onMarkDone={markDone}
                onEdit={editTask}
                onDelete={archiveTask}
                onSetAlarm={onSetAlarm}
                onRemoveAlarm={onRemoveAlarm}
                onOpenMenu={id => setOpenMenuId(id)}
                onCloseMenu={() => setOpenMenuId(null)}
                onLongPressDrag={() => setDraggingTaskId(item.id)}
              />
            )}
          />
        )}

        {/* ── FAB ─── */}
        {draggingTaskId ? (
          <View style={[styles.dragHint, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TouchableOpacity onPress={() => {}} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="arrow-up-outline" size={16} color={theme.primary} />
              <Text style={[styles.dragHintText, { color: theme.primary }]}>Yuqori</Text>
            </TouchableOpacity>
            <Text style={[styles.dragHintDivider, { color: theme.subText }]}>|</Text>
            <TouchableOpacity onPress={() => setDraggingTaskId(null)} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="close-outline" size={16} color={theme.danger} />
              <Text style={[styles.dragHintText, { color: theme.danger }]}>Bekor</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View
            style={[
              styles.fab,
              {
                backgroundColor: theme.primary,
                opacity: fabAnim,
                transform: [{ scale: fabAnim }],
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("AddPage", {})}
              style={styles.fabInner}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1 },

  // Filter chips
  filterPanel: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  filterRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "space-between",
  },
  chip: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
  },

  // List
  listContent: {
    paddingTop: 4,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  sectionDate: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  sectionCount: {
    fontSize: 12,
    marginLeft: 4,
  },
  // Kunlar orasidagi bo'shliq (chiziq emas!)
  sectionGap: {
    height: 10,
  },

  // Bo'sh holat
  emptyBox: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 27,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  fabInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dragHint: {
    position: "absolute",
    bottom: 20,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dragHintText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dragHintDivider: {
    fontSize: 14,
    marginHorizontal: 2,
  },
});

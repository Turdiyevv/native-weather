import { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { showMessage } from "react-native-flash-message";
import { CommonActions } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TextField from "../global/TextField";
import Toggle from "../global/Toggle";
import SingleCheckBox from "../global/CheckBox";
import FilePickerComponent from "../global/FilePicker";
import ConfirmModal from "../global/ConfirmModal";
import Header from "../global/Header";
import { UserTask } from "../../pages/types/userTypes";
import { RootStackParamList } from "../../pages/types/types";
import {
  addTask,
  updateTask,
  getActiveUser,
  softDeleteTask,
} from "../../service/storage";
import { useTheme } from "../../theme/ThemeContext";
import { useLanguage } from "../../i18n/LanguageContext";

type AddPageProps = NativeStackScreenProps<RootStackParamList, "AddPage">;

export default function AddPage({ navigation, route }: AddPageProps) {
  const { theme } = useTheme();
  const { t, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const dateLocale =
    language === "uz" ? "uz-UZ" : language === "ru" ? "ru-RU" : "en-US";

  const taskToEdit: UserTask | undefined = route.params?.task;
  const isEditMode = !!taskToEdit;

  // The first line is stored as the task title; all following lines become the description.
  const [taskText, setTaskText] = useState<string>(() => {
    if (!taskToEdit) return "";
    return [taskToEdit.title, taskToEdit.description].filter(Boolean).join("\n");
  });
  const [deadline, setDeadline] = useState<Date | null>(
    taskToEdit?.deadline ? new Date(taskToEdit.deadline) : null
  );
  const [priority, setPriority] = useState<number>(taskToEdit?.status ?? 1);
  const [isArchived, setIsArchived] = useState<boolean>(
    taskToEdit?.isDeleted ?? false
  );
  const [attachments, setAttachments] = useState<UserTask["files"]>(
    taskToEdit?.files ?? []
  );

  const [showPicker, setShowPicker] = useState(false);
  const [archiveModalVisible, setArchiveModalVisible] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Muhimlik darajalari (til o'zgarganda qayta hisoblanadi)
  const priorityOptions = useMemo(
    () => [
      { id: 1, text: t("priorityEasy"), color: theme.success },
      { id: 2, text: t("priorityMedium"), color: theme.primary },
      { id: 3, text: t("priorityHard"), color: theme.danger },
    ],
    [language, theme]
  );

  /**
   * Yagona navigatsiya funksiyasi:
   * - stack'da oldingi ekran bo'lsa, unga qaytadi (yangi nusxa yaratmaydi)
   * - bo'lmasa (masalan, notification orqali ochilgan), MainTabs'ga reset qiladi
   */
  const goToMain = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.dispatch(
        CommonActions.reset({ index: 0, routes: [{ name: "MainTabs" }] })
      );
    }
  }, [navigation]);

  // Android hardware back tugmasi
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        goToMain();
        return true;
      }
    );
    return () => subscription.remove();
  }, [goToMain]);

  const handleDateChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      // Android'da picker har bir hodisadan keyin yopiladi
      if (Platform.OS === "android") setShowPicker(false);
      if (event.type === "dismissed") return;
      if (selectedDate) setDeadline(selectedDate);
    },
    []
  );

  const handleSave = async () => {
    if (isSaving) return;

    const lines = taskText.trim().split(/\r?\n/);
    const trimmedTitle = lines.shift()?.trim() ?? "";
    const trimmedDescription = lines.join("\n").trim();

    if (trimmedTitle === "" || trimmedDescription === "") {
      showMessage({ message: t("taskFieldsRequired"), type: "warning" });
      return;
    }

    setIsSaving(true);
    try {
      const activeUser = await getActiveUser();
      if (!activeUser) {
        showMessage({ message: t("activeUserNotFound"), type: "danger" });
        return;
      }

      const deadlineISO = deadline ? deadline.toISOString() : null;

      if (taskToEdit) {
        // UPDATE
        await updateTask(activeUser.username, taskToEdit.id, {
          title: trimmedTitle,
          description: trimmedDescription,
          deadline: deadlineISO,
          status: priority,
          time: taskToEdit.time,
          isDeleted: isArchived,
          files: attachments,
        });
      } else {
        // CREATE
        const newTask: UserTask = {
          id: Date.now().toString(),
          title: trimmedTitle,
          description: trimmedDescription,
          done: false,
          deadline: deadlineISO,
          time: new Date().toISOString(),
          status: priority,
          isDeleted: isArchived,
          files: attachments,
          alarmDate: null,
          notificationId: null,
        };
        await addTask(activeUser.username, newTask);
      }

      showMessage({ message: t("savedSuccessfully"), type: "success" });
      goToMain();
    } catch (error) {
      console.error("AddPage: save failed", error);
      showMessage({ message: t("genericError"), type: "danger" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchiveConfirm = async () => {
    setArchiveModalVisible(false);
    try {
      const activeUser = await getActiveUser();
      if (!activeUser) {
        showMessage({ message: t("activeUserNotFound"), type: "danger" });
        return;
      }
      if (!taskToEdit) return;

      await softDeleteTask(activeUser.username, taskToEdit.id);
      setIsArchived(true);
      showMessage({ message: t("taskArchivedSuccess"), type: "success" });
      goToMain();
    } catch (error) {
      console.error("AddPage: archive failed", error);
      showMessage({ message: t("genericError"), type: "danger" });
    }
  };

  const cardStyle = [
    styles.containerInputs,
    { backgroundColor: theme.card, borderColor: theme.border },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <Header title={isEditMode ? t("edit") : t("add")} isBack={true} />

      <KeyboardAwareScrollView
        style={styles.flex}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 16 },
        ]}
        enableOnAndroid={true}
        extraHeight={100 + insets.bottom}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* One text area: first line is the title, remaining lines are the description. */}
        <View style={cardStyle}>
          <TextField
            label={t("taskTitleAndDescription")}
            value={taskText}
            onChangeText={setTaskText}
            placeholder={`${t("taskTitle")}\n${t("taskDescription")}`}
            multiline={true}
            minHeight={180}
            textAlignVertical="top"
          />
          <Text style={[styles.inputHint, { color: theme.subText }]}>
            {t("taskInputHint")}
          </Text>
          <Text style={[styles.priorityLabel, { color: theme.subText }]}>
            {t("priorityLabel")}
          </Text>
          <View style={styles.selectsBox}>
            {priorityOptions.map((option) => (
              <SingleCheckBox
                key={option.id}
                label={option.text}
                value={priority === option.id}
                onChange={() => setPriority(option.id)}
                color={option.color}
              />
            ))}
          </View>
        </View>

        {/* Fayllar */}
        <View style={cardStyle}>
          <FilePickerComponent
            onChange={setAttachments}
            initialFiles={taskToEdit?.files ?? []}
          />
        </View>

        {/* Deadline */}
        <View style={styles.deadlineContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.dateButton,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => setShowPicker((prev) => !prev)}
          >
            <Text style={[styles.dateText, { color: theme.text }]}>
              {deadline
                ? deadline.toLocaleDateString(dateLocale)
                : t("noDeadline")}
            </Text>
          </TouchableOpacity>

          {deadline && (
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.clearButton, { backgroundColor: theme.danger }]}
              onPress={() => setDeadline(null)}
              accessibilityRole="button"
              accessibilityLabel={t("clearDeadline")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.clearText}>X</Text>
            </TouchableOpacity>
          )}
        </View>

        {showPicker && (
          <DateTimePicker
            value={deadline ?? new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        {/* Arxivlash (faqat tahrirlash rejimida) */}
        {isEditMode && !taskToEdit?.isDeleted && (
          <View style={[styles.row, styles.archiveRow]}>
            <Toggle
              value={isArchived}
              onChange={() => setArchiveModalVisible(true)}
            />
            <Text style={[styles.archiveText, { color: theme.danger }]}>
              {t("archiveTask")}
            </Text>
          </View>
        )}

        {/* Saqlash tugmasi */}
        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isSaving}
          style={[
            styles.addButton,
            { backgroundColor: theme.primary, shadowColor: theme.primary },
            isSaving && styles.addButtonDisabled,
          ]}
          onPress={handleSave}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addText}>
              {isEditMode ? t("save") : t("add")}
            </Text>
          )}
        </TouchableOpacity>
      </KeyboardAwareScrollView>

      <ConfirmModal
        visible={archiveModalVisible}
        message={t("archiveConfirm")}
        onConfirm={handleArchiveConfirm}
        onCancel={() => setArchiveModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 16,
  },
  selectsBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 2,
  },
  inputHint: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: -4,
    marginBottom: 12,
  },
  priorityLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  containerInputs: {
    marginTop: 18,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  archiveRow: {
    marginBottom: 10,
  },
  archiveText: { marginLeft: 10 },
  deadlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 10,
  },
  dateButton: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "flex-start",
  },
  dateText: {
    fontSize: 15,
  },
  clearButton: {
    marginLeft: 10,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  clearText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  addButton: {
    padding: 15,
    minHeight: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  addButtonDisabled: {
    opacity: 0.7,
  },
  addText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
import {useEffect, useState} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform, BackHandler,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import TextField from "../global/TextField";
import {showMessage} from "react-native-flash-message";
import Toggle from "../global/Toggle";
import SingleCheckBox from "../global/CheckBox";
import FilePickerComponent from "../global/FilePicker";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ConfirmModal from "../global/ConfirmModal";
import {UserTask} from "../../pages/types/userTypes";
import { CommonActions } from "@react-navigation/native";
import { addTask, updateTask, getActiveUser, softDeleteTask } from "../../service/storage";
import {useTheme} from "../../theme/ThemeContext";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import Header from "../global/Header";
import { useLanguage } from "../../i18n/LanguageContext";


export default function AddPage({ navigation, route }: any) {
    const { theme } = useTheme();
    const { t } = useLanguage();
    const insets = useSafeAreaInsets();
  const { task: taskToEdit } = route.params || {};
  const [task, setTask] = useState(taskToEdit ? taskToEdit.title : "");
  const [description, setDescription] = useState(taskToEdit ? taskToEdit.description || "" : "");
  const [deadline, setDeadline] = useState<Date | null>(
    taskToEdit && taskToEdit.deadline ? new Date(taskToEdit.deadline) : null
  );
  const [showPicker, setShowPicker] = useState(false);
  const [selected, setSelected] = useState<number>(taskToEdit?.status ?? 1);
  const [isActive, setIsActive] = useState<boolean>(taskToEdit ? taskToEdit.isDeleted : false);
  const [attachments, setAttachments] = useState<string[]>(taskToEdit ? taskToEdit.files : []);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const options = [
    {id: 1, text: "Yengil", color: 'green'},
    {id: 2, text: "O'rtacha", color: 'orange'},
    {id: 3, text: "Og'ir", color: '#fb5151'},
  ];
  useEffect(() => {
      const backAction = () => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: "MainTabs" }],
              })
            );
          }
          return true;
        };
      const backHandler = BackHandler.addEventListener(
          "hardwareBackPress", backAction);
      return () => backHandler.remove()
  }, [navigation]);
  const saveTask = async () => {
      if (task.trim() === "" || description.trim() === "") {
        showMessage({
          message: t("taskFieldsRequired"),
          type: "warning",
        });
        return;
      }
      const activeUser = await getActiveUser();
      if (!activeUser) return;
      // UPDATE (edit)
      if (taskToEdit) {
        await updateTask(activeUser.username, taskToEdit.id, {
          title: task,
          description,
          deadline: deadline ? deadline.toISOString() : null,
          status: selected,
          time: taskToEdit.time,
          isDeleted: isActive,
          files: attachments,
        });
      }
      // CREATE (add)
      else {
        const now = new Date();
        const newTask: UserTask = {
          id: Date.now().toString(),
          title: task,
          description,
          done: false,
          deadline: deadline ? deadline.toISOString() : null,
          time: now.toISOString(),
          status: selected,
          isDeleted: isActive,
          files: attachments,
          alarmDate: null,
          notificationId: null
        };

        await addTask(activeUser.username, newTask);
      }

      showMessage({
        message: t("savedSuccessfully"),
        type: "success",
      });
      navigation.replace("MainTabs");
    };

  const modalVisible=() => {setDeleteModalVisible(true)}
  const handleDeleteConfirm = async () => {
      const activeUser = await getActiveUser();
      if (!activeUser || !taskToEdit) return;
      await softDeleteTask(activeUser.username, taskToEdit.id);
      showMessage({
        message: t("taskArchivedSuccess"),
        type: "success",
      });
      setIsActive(true);
      setDeleteModalVisible(false);
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
  };

  return (
      <View style={[styles.screen, {backgroundColor: theme.background}]}>
          <Header title={taskToEdit ? t("edit") : t("add")} isBack={true}/>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 5,
          justifyContent: "flex-end", paddingHorizontal: 16 }}
          enableOnAndroid={true}
          extraHeight={100 + insets.bottom}
          keyboardShouldPersistTaps="handled"
        >
            <View style={[styles.containerInputs, {backgroundColor: theme.card, borderColor: theme.border}]}>
              <TextField
                label={t("tasks")}
                value={task}
                onChangeText={setTask}
                placeholder={t("name")}
              />
              <TextField
                label={t("note")}
                value={description}
                onChangeText={setDescription}
                placeholder={t("note")}
                multiline={true}
                minHeight={100}
              />
              <View style={styles.selectsBox}>
                {options.map((option) => (
                  <SingleCheckBox
                    key={option.id}
                    label={option.text}
                    value={selected === option.id}
                    onChange={() => setSelected(option.id)}
                    color={option.color}
                  />
                ))}
              </View>
            </View>
            <View style={[styles.containerInputs, {backgroundColor: theme.card, borderColor: theme.border}]}>
              <FilePickerComponent
                  onChange={setAttachments}
                  initialFiles={taskToEdit ? taskToEdit.files : []}
              />
            </View>
            <View style={styles.deadlineContainer}>
              <TouchableOpacity
                style={[styles.dateButton, {backgroundColor: theme.card, borderColor: theme.border}]}
                onPress={() => setShowPicker(true)}
              >
                <Text style={[styles.dateText, {color: theme.text}]}>
                  {deadline ? deadline.toLocaleDateString() : "Deadline belgilanmadi"}
                </Text>
              </TouchableOpacity>

              {deadline && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() =>setDeadline(null)}
                >
                  <Text style={styles.clearText}>X</Text>
                </TouchableOpacity>
              )}
            </View>
            {showPicker && (
              <DateTimePicker
                value={deadline || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={new Date()}
                onChange={(_event, selectedDate) => {
                  setShowPicker(false);
                  if (selectedDate) setDeadline(selectedDate);
                }}
              />
            )}
            {taskToEdit && !taskToEdit.isDeleted &&(
                <View style={[styles.row, {marginBottom:10}]}>
                  <Toggle value={isActive} onChange={modalVisible} />
                  <Text style={{marginLeft: 10, color: "#fb5151"}}>O'chirish</Text>
                </View>
            )}
            <TouchableOpacity style={[styles.addButton, {backgroundColor: theme.primary}]} onPress={saveTask}>
              <Text style={[styles.addText, {color: "#fff"}]}>{taskToEdit ? "Saqlash" : "Qo‘shish"}</Text>
            </TouchableOpacity>
        </KeyboardAwareScrollView>
        <ConfirmModal
          visible={deleteModalVisible}
          message={t("deleteConfirm")}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModalVisible(false)}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  selectsBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 2
  },
  containerInputs: {
    marginTop:18,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
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
    marginTop: 15,
    marginLeft: 10,
    backgroundColor: "#ff4d4d",
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
    borderRadius: 16,
    alignItems: "center",
    marginTop: 14,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 4,
  },
  addText: {
    fontSize: 18,
    fontWeight: "700",
  },
});

import React, {useEffect, useState} from "react";
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
import { addTask, updateTask, getActiveUser, softDeleteTask } from "../../service/storage";
import {useTheme} from "../../theme/ThemeContext";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import Header from "../global/Header";


export default function AddPage({ navigation, route }: any) {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
  const { task: taskToEdit } = route.params || {};
  const [task, setTask] = useState(taskToEdit ? taskToEdit.title : "");
  const [description, setDescription] = useState(taskToEdit ? taskToEdit.description || "" : "");
  const [deadline, setDeadline] = useState<Date | null>(
    taskToEdit && taskToEdit.deadline ? new Date(taskToEdit.deadline) : null
  );
  const [showPicker, setShowPicker] = useState(false);
  const [selected, setSelected] = useState<number | null>(taskToEdit ? taskToEdit.status : 1);
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
          navigation.navigate("TopTabs"); // har doim TopTabs ga qaytadi
          return true; // default behaviorni to‘xtatadi
        };
      const backHandler = BackHandler.addEventListener(
          "hardwareBackPress", backAction);
      return () => backHandler.remove()
  }, [navigation]);
  const saveTask = async () => {
      if (task.trim() === "" || description.trim() === "") {
        showMessage({
          message: "Vazifa nomi va izoh bo‘sh bo‘lishi mumkin emas",
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
        message: "Muvaffaqiyatli saqlandi!",
        type: "success",
      });
      navigation.navigate("TopTabs");
    };

  const modalVisible=() => {setDeleteModalVisible(true)}
  const handleDeleteConfirm = async () => {
      const activeUser = await getActiveUser();
      if (!activeUser || !taskToEdit) return;
      await softDeleteTask(activeUser.username, taskToEdit.id);
      showMessage({
        message: "Vazifa o‘chirildi!",
        type: "success",
      });
      setIsActive(true);
      setDeleteModalVisible(false);
      navigation.goBack();
  };

  return (
      <View style={[{flex: 1}, {backgroundColor: theme.background}]}>
          <Header title={taskToEdit ?  "Vazifani tahrirlash" : "Yangi vazifa qo‘shish"}/>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 5,
          justifyContent: "flex-end", paddingHorizontal: 10 }}
          enableOnAndroid={true}
          extraHeight={100 + insets.bottom}
          keyboardShouldPersistTaps="handled"
        >
            {/*<Text style={{color: theme.placeholder}}>{JSON.stringify(taskToEdit, null, 2)}</Text>*/}
            <View style={[styles.containerInputs, {backgroundColor: theme.card}]}>
              <TextField
                label="Vazifa"
                value={task}
                onChangeText={setTask}
                placeholder="Vazifa nomi"
              />
              <TextField
                label="Batafsil izoh"
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description..."
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
            <View style={[styles.containerInputs, {backgroundColor: theme.card}]}>
              <FilePickerComponent
                  onChange={setAttachments}
                  initialFiles={taskToEdit ? taskToEdit.files : []}
              />
            </View>
            <View style={styles.deadlineContainer}>
              <TouchableOpacity
                style={[styles.dateButton, {backgroundColor: theme.card}]}
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
                onChange={(event, selectedDate) => {
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
          message="Hisobni butunlay o‘chirmoqchimisiz?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModalVisible(false)}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  selectsBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 2
  },
  containerInputs: {
    marginTop:20,
    padding: 10,
    borderRadius: 10,
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
    marginBottom: 20,
  },
  dateButton: {
    marginTop: 20,
    flex: 1,
    padding: 12,
    borderRadius: 10,
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
    backgroundColor: "#121",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addText: {
    fontSize: 18,
  },
});

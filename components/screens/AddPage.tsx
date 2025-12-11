import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import TextField from "../../components/TextField";
import {showMessage} from "react-native-flash-message";
import Toggle from "../Toggle";
import SingleCheckBox from "../CheckBox";
import FilePickerComponent from "../FilePicker";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ConfirmModal from "../ConfirmModal";

interface Task {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  deadline?: string | null;
  time: string;
  status?: number;
  isDeleted?: boolean;
  files:string[]
}

export default function AddPage({ navigation, route }: any) {
  const { task: taskToEdit, initialView } = route.params || {};
  const [view, setView] = useState<boolean>(initialView || false);
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
  console.log("ROUTE PARAMS:", route.params);
  const options = [
    {id: 1, text: "Yengil", color: 'green'},
    {id: 2, text: "O'rtacha", color: 'orange'},
    {id: 3, text: "Og'ir", color: '#fb5151'},
  ];

  const saveTask = async () => {
    if (task.trim() === "" || description.trim() === "") {
      showMessage({
        message: "Vazifa nomi va description bo‘sh bo‘lishi mumkin emas",
        type: "warning",
      });
      return;
    }
    if (view) {
        if (taskToEdit.isDeleted) {
          showMessage({
            message: "Vazifa allaqachon tugatilgan !",
            type: "danger",
          });
          return
        }
        setView(false);
        return;
    }

    try {
      const activeUserStr = await AsyncStorage.getItem("activeUser");
      if (!activeUserStr) return;
      const activeUser = JSON.parse(activeUserStr);
      if (!Array.isArray(activeUser.usertasks)) activeUser.usertasks = [];

      const storedUsers = await AsyncStorage.getItem("users");
      let users = storedUsers ? JSON.parse(storedUsers) : [];

      const chosenStatus = selected ?? (taskToEdit ? taskToEdit.status : 0);
      const chosenDeleted = isActive !== null ? isActive : (taskToEdit ? taskToEdit.isDeleted : false);
      const chosenFiles = attachments.length > 0 ? attachments : (taskToEdit ? taskToEdit.files : []);

      if (taskToEdit) {
        activeUser.usertasks = activeUser.usertasks.map((t: Task) =>
          t.id === taskToEdit.id
            ? {
                ...t,
                title: task,
                description,
                deadline: deadline ? deadline.toISOString() : null,
                status: chosenStatus,
                isDeleted: chosenDeleted,
                files: chosenFiles,
              }
            : t
        );
      } else {
        // New task
        const now = new Date();
        const newTask: Task = {
          id: Date.now().toString(),
          title: task,
          description,
          done: false,
          deadline: deadline ? deadline.toISOString() : null,
          time: now.toISOString(),
          status: chosenStatus,
          isDeleted: chosenDeleted,
          files: chosenFiles,
        };
        activeUser.usertasks.push(newTask);
      }
      const idx = users.findIndex((u: any) => u.username === activeUser.username);
      if (idx >= 0) {
        users[idx] = activeUser;
      } else {
        users.push(activeUser);
      }

      await AsyncStorage.setItem("users", JSON.stringify(users));
      await AsyncStorage.setItem("activeUser", JSON.stringify(activeUser));

      showMessage({
        message: "Muvaffaqiyatli saqlandi!",
        type: "success",
      });

      navigation.goBack();
    } catch (e) {
      showMessage({
        message: String(e),
        type: "danger",
      });
    }
  };
  const modalVisible=() => {setDeleteModalVisible(true)}
  const handleDeleteConfirm = async (id: number) => {
    try {
      const activeUserStr = await AsyncStorage.getItem("activeUser");
      if (!activeUserStr) return;
      const activeUser = JSON.parse(activeUserStr);
      const updatedTasks = activeUser.usertasks.map((t) =>
        t.id === id ? { ...t, isDeleted: true } : t
      );
      activeUser.usertasks = updatedTasks;
      const storedUsers = await AsyncStorage.getItem("users");
      let users = storedUsers ? JSON.parse(storedUsers) : [];
      users = users.map((u) =>
        u.username === activeUser.username ? activeUser : u
      );
      await AsyncStorage.setItem("users", JSON.stringify(users));
      await AsyncStorage.setItem("activeUser", JSON.stringify(activeUser));
      showMessage({
        message: "Vazifa o'chirildi!",
        type: "success",
      });
      setIsActive(true);
      navigation.goBack();
    } catch (e) {
      showMessage({
        message: String(e),
        type: "danger",
      });
    }
  }
  return (
      <View style={{flex: 1}}>
        <KeyboardAwareScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-end", paddingTop: 40, paddingBottom: 30, paddingHorizontal: 10 }}
          enableOnAndroid={true}
          extraHeight={100}
          keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>
              {taskToEdit ? view ? "Vazifani ko'rish" : "Vazifani tahrirlash" : "Yangi vazifa qo‘shish"}
            </Text>

            <View style={styles.containerInputs}>
              <TextField
                label="Vazifa"
                value={task}
                onChangeText={setTask}
                placeholder="Vazifa nomi"
                editable={!view}
              />
              <TextField
                label="Batafsil izoh"
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description..."
                multiline={true}
                minHeight={100}
                editable={!view}
              />
              <View style={styles.selectsBox}>
                {options.map((option) => (
                  <SingleCheckBox
                    key={option.id}
                    label={option.text}
                    value={selected === option.id}
                    onChange={() => !view && setSelected(option.id)}
                    color={option.color}
                  />
                ))}
              </View>
            </View>

            <View style={styles.containerInputs}>
              <FilePickerComponent
                  onChange={setAttachments}
                  initialFiles={taskToEdit ? taskToEdit.files : []}
                  disabled={view}
              />
            </View>

            <View style={styles.deadlineContainer}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => !view && setShowPicker(true)}
                disabled={view}
              >
                <Text style={styles.dateText}>
                  {deadline ? deadline.toLocaleDateString() : "Deadline belgilanmadi"}
                </Text>
              </TouchableOpacity>

              {deadline && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => !view && setDeadline(null)}
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

            <TouchableOpacity style={styles.addButton} onPress={saveTask}>
              <Text style={styles.addText}>{taskToEdit ? view ? "Tahrirlash" : "Saqlash" : "Qo‘shish"}</Text>
            </TouchableOpacity>
        </KeyboardAwareScrollView>

        <ConfirmModal
          visible={deleteModalVisible}
          message="Hisobni butunlay o‘chirmoqchimisiz?"
          onConfirm={() => {
            handleDeleteConfirm(taskToEdit.id);
          }}
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
  container: {
    padding: 10,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  containerInputs: {
    marginTop:20,
    padding: 10,
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
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
    backgroundColor: "black",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addText: {
    color: "white",
    fontSize: 18,
  },
});

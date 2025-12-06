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

interface Task {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  deadline?: string | null;
  time: string;
}

export default function AddPage({ navigation, route }: any) {
  const taskToEdit: Task | undefined = route.params?.task;

  const [task, setTask] = useState(taskToEdit ? taskToEdit.title : "");
  const [description, setDescription] = useState(taskToEdit ? taskToEdit.description || "" : "");
  const [deadline, setDeadline] = useState<Date | null>(
    taskToEdit && taskToEdit.deadline ? new Date(taskToEdit.deadline) : null
  );
  const [showPicker, setShowPicker] = useState(false);

  const saveTask = async () => {
    if (task.trim() === "" || description.trim() === "") return;

    try {
      const data = await AsyncStorage.getItem("tasks");
      const tasks: Task[] = data ? JSON.parse(data) : [];

      if (taskToEdit) {
        // Edit qilish
        const updatedTasks = tasks.map(t =>
          t.id === taskToEdit.id
            ? { ...t, title: task, description, deadline: deadline ? deadline.toISOString() : null }
            : t
        );
        await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
      } else {
        // Yangi task qo‘shish
        const now = new Date();
        const newTask: Task = {
          id: Date.now().toString(),
          title: task,
          description,
          done: false,
          deadline: deadline ? deadline.toISOString() : null,
          time: now.toISOString(),
        };
        const newTasks = [...tasks, newTask];
        await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
      }

      navigation.goBack();
    } catch (e) {
      console.log("Error saving task", e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>
          {taskToEdit ? "Vazifani Tahrirlash" : "Yangi Vazifa Qo‘shish"}
        </Text>

        <TextField
          label="Vazifa"
          value={task}
          onChangeText={setTask}
          placeholder="Vazifa nomi"
        />
        <TextField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description..."
          multiline={true}
          minHeight={50}
          maxHeight={300}
        />
        <View style={styles.deadlineContainer}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.dateText}>
              {deadline ? deadline.toLocaleDateString() : "Deadline belgilanmadi"}
            </Text>
          </TouchableOpacity>

          {deadline && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setDeadline(null)}
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

        <TouchableOpacity style={styles.addButton} onPress={saveTask}>
          <Text style={styles.addText}>{taskToEdit ? "Saqlash" : "Qo‘shish"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#f5f5f5",
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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

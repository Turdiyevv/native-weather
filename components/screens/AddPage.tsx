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

export default function AddPage({ navigation }) {
  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const addTask = async () => {
    if (task.trim() === "") return;

    try {
      const data = await AsyncStorage.getItem("tasks");
      const tasks = data ? JSON.parse(data) : [];

      const newTask = {
        id: Date.now().toString(),
        title: task,
        done: false,
        deadline: deadline.toISOString(),
      };

      const newTasks = [...tasks, newTask];
      await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));

      navigation.goBack(); // qo‘shgandan keyin MainPage-ga qaytish
    } catch (e) {
      console.log("Error adding task", e);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Yangi Vazifa Qo‘shish</Text>

        {/* Task nomi */}
        <TextField
          label="Vazifa nomi"
          value={task}
          onChangeText={setTask}
          placeholder="Yangi vazifa"
        />

        {/* Deadline */}
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateText}>
            {deadline ? deadline.toLocaleDateString() : "Deadline"}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={deadline}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) setDeadline(selectedDate);
            }}
          />
        )}

        {/* Qo‘shish tugmasi */}
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addText}>Qo‘shish</Text>
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
  dateButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
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

import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddTaskScreen({ navigation, tasks, saveTasks }) {
  const [task, setTask] = useState("");
  const [deadline, setDeadline] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const addTask = () => {
    if (!task.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      title: task,
      done: false,
      deadline: deadline.toISOString(),
    };

    saveTasks([...tasks, newTask]);
    navigation.goBack(); // avtomatik Home ga qaytadi
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Vazifa nomi..."
        value={task}
        onChangeText={setTask}
      />

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
          display="default"
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) setDeadline(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={addTask}>
        <Text style={styles.addText}>Qo'shish</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 10, fontSize: 18, marginBottom: 20 },
  dateButton: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 20 },
  dateText: { fontSize: 18 },
  addButton: { backgroundColor: "black", padding: 15, borderRadius: 10, alignItems: "center" },
  addText: { color: "white", fontSize: 18, fontWeight: "bold" },
});

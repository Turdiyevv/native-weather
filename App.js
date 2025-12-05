import React, { useState, useEffect } from "react";
import { Alert, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from '@react-native-community/datetimepicker';
import TodoItem from "./components/TodoItem";

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const [deadline, setDeadline] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await AsyncStorage.getItem("tasks");
      if (data) setTasks(JSON.parse(data));
    } catch (e) {
      console.log("Error loading tasks", e);
    }
  };

  const saveTasks = async (newTasks) => {
    await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  const addTask = () => {
    if (task.trim() === "") return;

    const newTasks = [
      ...tasks,
      {
        id: Date.now().toString(),
        title: task,
        done: false,
        deadline: deadline.toISOString()
      },
    ];

    setTasks(newTasks);
    saveTasks(newTasks);
    setTask("");
    setDeadline(new Date());
  };

  const toggleTask = (id) => {
    const newTasks = tasks.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find(t => t.id === id);

    Alert.alert(
      "Vazifani o'chirish",
      `Siz "${taskToDelete.title}" vazifasini o'chirmoqchimisiz?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const newTasks = tasks.filter((t) => t.id !== id);
            setTasks(newTasks);
            saveTasks(newTasks);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Offline To-Do List</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Yangi vazifa..."
          value={task}
          onChangeText={setTask}
        />

        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Deadline Picker */}
      <View style={{ flexDirection: "row", marginBottom: 20, alignItems: "center" }}>
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
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            item={item}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    fontSize: 18,
  },
  addButton: {
    backgroundColor: "black",
    paddingHorizontal: 20,
    marginLeft: 10,
    borderRadius: 10,
    justifyContent: "center",
  },
  addText: {
    color: "white",
    fontSize: 24,
  },
  dateButton: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
  },
  dateText: {
    fontSize: 18,
  },
});

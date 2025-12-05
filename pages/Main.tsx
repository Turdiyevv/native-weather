import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TodoItem from "../components/TodoItem";
import { Ionicons } from '@expo/vector-icons';

export default function MainPage({ navigation }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTasks();
    });

    return unsubscribe;
  }, [navigation]);

  const loadTasks = async () => {
    try {
      const data = await AsyncStorage.getItem("tasks");
      if (data) setTasks(JSON.parse(data));
    } catch (e) {
      console.log("Error loading tasks", e);
    }
  };

  const toggleTask = async (id) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setTasks(newTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  const deleteTask = async (id) => {
    const newTasks = tasks.filter(t => t.id !== id);
    setTasks(newTasks);
    await AsyncStorage.setItem("tasks", JSON.stringify(newTasks));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vega-chat List</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem item={item} onToggle={toggleTask} onDelete={deleteTask} />
        )}
      />


      <View style={styles.leftButtons}>
          <TouchableOpacity style={styles.sideButton} onPress={() => navigation.navigate("ProfileView")}>
              <Ionicons name="person-circle-outline" size={32} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sideButton} onPress={() => console.log("Chat")}>
              <Ionicons name="chatbubble-outline" size={32} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.sideButton} onPress={() => console.log("Support")}>
              <Ionicons name="help-circle-outline" size={32} color="black" />
          </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("AddPage")}>
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, backgroundColor: "#f5f5f5" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  addButton: {
      backgroundColor: "black", width: 50, height: 50, borderRadius: 30, justifyContent: "center",
      alignItems: "center", position: "absolute", bottom: 30, right: 30,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
  },
  addText: { color: "white", fontSize: 32 },
    leftButtons: {
    position: "absolute",
    bottom: 30,
    left: 20,
    flexDirection: "row",
    gap: 15,
  },
  sideButton: {
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});

import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

interface TodoItemProps {
  item: {
    id: string;
    title: string;
    done: boolean;
    deadline?: string | Date;
    time: string | Date;
  };
  onToggle: (id: string) => void;
  onDone?: (item: any) => void;
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
}

export default function TodoItem({ item, onToggle, onDone, onEdit, onDelete }: TodoItemProps) {
  const [menuVisible, setMenuVisible] = useState(false);

  const createdTime = new Date(item.time);
  const formattedTime = createdTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formattedDeadline = item.deadline
    ? new Date(item.deadline).toLocaleDateString()
    : null;

  // Item title uzunligini maksimal 30 ta belgiga qisqartirish
  const displayTitle = item.title.length > 30 ? item.title.slice(0, 30) + "..." : item.title;

  return (
    <TouchableOpacity
      style={[styles.item, item.done && styles.done]}
      onPress={() => onToggle(item.id)}
      onLongPress={() => setMenuVisible(!menuVisible)}
    >
      <Text style={[styles.text, item.done && styles.doneText]}>
        {displayTitle}
      </Text>

      {formattedDeadline && (
        <Text style={styles.deadline}>Deadline: {formattedDeadline}</Text>
      )}

      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formattedTime}</Text>
      </View>

      {/* Item Menu */}
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuButton} onPress={() => { onDone && onDone(item); setMenuVisible(false); }}>
            <Text>Done</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => { onEdit && onEdit(item); setMenuVisible(false); }}>
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => { onDelete && onDelete(item.id); setMenuVisible(false); }}>
            <Text style={{ color: "red" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
    minHeight: 50,
    justifyContent: "center",
  },
  done: {
    backgroundColor: "#ffd1d8",
  },
  text: {
    fontSize: 18,
  },
  doneText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  deadline: {
    fontSize: 14,
    color: "#007AFF",
    marginTop: 4,
  },
  timeContainer: {
    position: "absolute",
    bottom: 5,
    right: 10,
  },
  time: {
    fontSize: 12,
    color: "gray",
  },
  menu: {
    position: "absolute",
    top: 50,
    right: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
    padding: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
});

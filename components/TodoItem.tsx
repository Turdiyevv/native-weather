import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

interface TodoItemProps {
  item: {
    id: string;
    title: string;
    done: boolean;
    deadline?: string | Date; // foydalanuvchi o'zgartirishi mumkin
    time: string | Date;      // yaratilgan vaqt, o'zgartirish mumkin emas
  };
  onToggle: (id: string) => void;
}

export default function TodoItem({ item, onToggle }: TodoItemProps) {
  // Yaralgan vaqt
  const createdTime = new Date(item.time);
  const formattedTime = createdTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formattedDeadline = item.deadline
    ? new Date(item.deadline).toLocaleDateString()
    : null;

  return (
    <TouchableOpacity
      style={[styles.item, item.done && styles.done]}
      onPress={() => onToggle(item.id)}
    >
      <Text style={[styles.text, item.done && styles.doneText]}>
        {item.title}
      </Text>

      {formattedDeadline && (
        <Text style={styles.deadline}>Deadline: {formattedDeadline}</Text>
      )}

      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formattedTime}</Text>
      </View>
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
});

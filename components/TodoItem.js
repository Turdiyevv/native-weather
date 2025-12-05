import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

export default function TodoItem({ item, onToggle, onDelete }) {
  return (
    <TouchableOpacity
      style={[styles.item, item.done && styles.done]}
      onPress={() => onToggle(item.id)}
      onLongPress={() => onDelete(item.id)}
    >
      <Text style={[styles.text, item.done && styles.doneText]}>
        {item.title}
      </Text>
      {item.deadline && (
        <Text style={styles.deadline}>
          Deadline: {new Date(item.deadline).toLocaleDateString()}
        </Text>
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
    color: "gray",
    marginTop: 4,
  },
});

import React from "react";
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
  onLongPress?: (y: number) => void; // menu joylashuvi uchun
}

export default function TodoItem({ item, onToggle, onLongPress }: TodoItemProps) {
  const createdTime = new Date(item.time);
  const formattedTime = createdTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  const formattedDeadline = item.deadline ? new Date(item.deadline).toLocaleDateString() : null;

  // title uzunligini 26 ta belgidan oshsa ... qo'shish
  const displayTitle = item.title.length > 26
    ? item.title.slice(0, 26) + "..."
    : item.title;

  return (
    <TouchableOpacity
      style={[styles.item, item.done && styles.done]}
      onPress={() => onToggle(item.id)}
      onLongPress={(event: any) => {
        const y = event.nativeEvent.pageY;
        onLongPress && onLongPress(y);
      }}
    >
      <Text style={[styles.text, item.done && styles.doneText]}>{displayTitle}</Text>
      {formattedDeadline && <Text style={styles.deadline}>{formattedDeadline}</Text>}
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formattedTime}</Text>
      </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  item: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginVertical: 6, minHeight: 50, justifyContent: "center" },
  done: { backgroundColor: "#ffd1d8" },
  text: { fontSize: 18 },
  doneText: { textDecorationLine: "line-through", color: "gray" },
  deadline: { fontSize: 14, color: "#007AFF", marginTop: 4 },
  timeContainer: { position: "absolute", bottom: 5, right: 10 },
  time: { fontSize: 12, color: "gray" },
});

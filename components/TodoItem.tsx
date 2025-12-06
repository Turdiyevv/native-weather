import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";

interface TodoItemProps {
  item: {
    id: string;
    title: string;
    done: boolean;
    deadline?: string | Date;
    time: string | Date;
    isReturning?: number;
  };
  onToggle: (id: string) => void;
  onLongPress?: (y: number) => void;
}

export default function TodoItem({ item, onToggle, onLongPress }: TodoItemProps) {
  const createdTime = new Date(item.time);
  const formattedTime = createdTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  const formattedDeadline = item.deadline ? new Date(item.deadline).toLocaleDateString() : null;
  const displayTitle = item.title.length > 26 ? item.title.slice(0, 26) + "..." : item.title;

  return (
    <TouchableOpacity
      style={[
        styles.item,
        item.done && styles.done,
        item.isReturning && item.isReturning > 0 && !item.done ? styles.returningBorder : null,
      ]}
      onPress={() => onToggle(item.id)}
      onLongPress={(event: any) => {
        const y = event.nativeEvent.pageY;
        onLongPress && onLongPress(y);
      }}
    >
      {item.isReturning && item.isReturning > 0 && (
        <View style={styles.returnCount}>
          <Text style={styles.returnCountText}>{item.isReturning}</Text>
        </View>
      )}
      <View style={styles.titleContainer}>
        <Text style={[styles.text, item.done && styles.doneText]}>{displayTitle}</Text>

      </View>

      {formattedDeadline && <Text style={styles.deadline}>{formattedDeadline}</Text>}

      <View style={styles.timeContainer}>
        <Text style={styles.time}>{formattedTime}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  returningBorder: {
    borderColor: "orange",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  item: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 6,
    marginLeft: 5,
    minHeight: 50,
    justifyContent: "center",
  },
  done: { backgroundColor: "#d4f7dc" },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // title va counter o'ng va chap
  },
  text: { fontSize: 18 },
  doneText: { textDecorationLine: "line-through", color: "gray" },
  returnCount: {
    position: "absolute",
    top: -5,
    left: -5,
    width: "auto",
    minWidth:20,
    height: 20,
    borderRadius: 12,
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
  },
  returnCountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  deadline: { fontSize: 14, color: "#007AFF", marginTop: 4 },
  timeContainer: { position: "absolute", bottom: 5, right: 10 },
  time: { fontSize: 12, color: "gray" },
});

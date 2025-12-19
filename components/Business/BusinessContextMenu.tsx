import React from "react";
import { Modal, View, Text, Pressable, Animated, StyleSheet } from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useTheme} from "../../theme/ThemeContext";

export default function BusinessContextMenu({
  entry,
  visible,
  menuAnim,
  onClose,
  onEdit,
  onDelete,
}) {

  const { theme } = useTheme();
  return (
    <Modal transparent visible={visible} animationType="none">
      {/* 🔹 BACKDROP */}
      <Pressable style={styles.overlay} onPress={onClose}>

        {/* 🔹 MENU (bosilganda yopilmaydi, opacity o‘zgarmaydi) */}
        <Animated.View
          style={[
            styles.menu, {backgroundColor: theme.card},
            {
              transform: [{ scale: menuAnim }],
              opacity: menuAnim,
            },
          ]}
          onStartShouldSetResponder={() => true}
        >
          <Pressable style={styles.menuButton} onPress={() => onEdit(entry)}>
            <Text style={[styles.item, {color: theme.text}]}>Tahrirlash</Text>
            <Ionicons name="create-outline" size={20} color="blue" />
          </Pressable>

          <Pressable style={styles.menuButtonDel} onPress={() => onDelete(entry)}>
            <Text style={[styles.item, { color: "red" }]}>O‘chirish</Text>
            <Ionicons name="trash-outline" size={20} color="red" />
          </Pressable>
        </Animated.View>

      </Pressable>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    width: 220,
    borderRadius: 14,
  },
  item: {
    fontSize: 15,
    color: "#fff",
  },
  menuButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#a8a6a6",
  },
  menuButtonDel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
});


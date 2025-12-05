import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  multiline?: boolean;
  height?: number;
}

export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  multiline = false,
  height = 50
}: TextFieldProps) {
  return (
    <View style={{ width: "100%", marginBottom: 5 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, { height }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 16, marginBottom: 5, color: "#333" },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
});

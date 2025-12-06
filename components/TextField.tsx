import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";

interface TextFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  multiline?: boolean;
  minHeight?: number;
  maxHeight?: number;
  lineHeight?: number; // optional: satr balandligi
}

export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  multiline = false,
  minHeight = 40,
  maxHeight = 300,
  lineHeight = 20,
  ...rest
}: TextFieldProps) {
  const [inputHeight, setInputHeight] = useState(minHeight);

  // Initial value bilan balandlikni hisoblash
  useEffect(() => {
    if (multiline && value) {
      const lines = value.split("\n").length;
      const newHeight = Math.min(Math.max(lines * lineHeight + 20, minHeight), maxHeight);
      setInputHeight(newHeight);
    }
  }, [value, multiline, lineHeight, minHeight, maxHeight]);

  return (
    <View style={{ width: "100%", marginBottom: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { height: inputHeight, textAlignVertical: multiline ? "top" : "center" },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        onContentSizeChange={(e) => {
          if (multiline) {
            const newHeight = e.nativeEvent.contentSize.height + 20;
            setInputHeight(Math.min(Math.max(newHeight, minHeight), maxHeight));
          }
        }}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, marginBottom: 3, color: "#858484" },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
});

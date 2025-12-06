import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";

interface TextFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  errorMessage?: string;
}

export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  required = false,
  errorMessage = "Bu maydon to‘ldirilishi shart!",
  ...rest
}: TextFieldProps) {
  const [touched, setTouched] = useState(false);

  const showError = required && touched && value.trim().length === 0;

  return (
    <View style={{ width: "100%", marginBottom: 10 }}>
      <Text style={styles.label}>
        {label} {required && <Text style={{ color: "red" }}>*</Text>}
      </Text>

      <TextInput
        style={[
          styles.input,
          showError && styles.errorBorder
        ]}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          if (!touched) setTouched(true); // birinchi yozishda touched true
        }}
        onBlur={() => setTouched(true)} // inputdan chiqsa touched true bo‘ladi
        placeholder={placeholder}
        {...rest}
      />

      {showError && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
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
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  errorBorder: {
    borderColor: "#ff9292",
  },
  errorText: {
    color: "#ff5353",
    fontSize: 12,
    marginTop: 3,
  },
});

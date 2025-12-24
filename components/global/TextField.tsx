import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import { TextFieldProps } from "../../pages/types/types";
import { useTheme } from "../../theme/ThemeContext";

export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  required = false,
  errorMessage = "Bu maydon to‘ldirilishi shart!",
  minLength = 0,
  secureTextEntry,
  minHeight,
  editable,
  multiline,
  keyboardType,
  sumFormat = false, // 🔥 yangi prop
  ...rest
}: TextFieldProps) {
  const [touched, setTouched] = useState(false);
  const { theme } = useTheme();
  const showError = required && touched && value.trim().length === 0;
  const showMinLengthError = touched && value.length > 0 && value.length < minLength;

  // 🔥 summa format funksiyasi
  const formatNumber = (val: string) => {
    if (!val) return "";
    // faqat raqam qoldiramiz
    const numeric = val.replace(/\D/g, "");
    // 3 xonali ajratish
    return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const displayValue = sumFormat ? formatNumber(value) : value;

  return (
    <View style={{ width: "100%", marginBottom: 10 }}>
      <Text style={styles.label}>
        {label} {required && <Text style={{ color: "red" }}>*</Text>}
      </Text>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.card, color: theme.text },
          minHeight ? { minHeight: minHeight } : {},
          (showError || showMinLengthError) && styles.errorBorder,
        ]}
        editable={editable}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        cursorColor={theme.placeholder}
        selectionColor={theme.placeholder}
        value={displayValue}
        onChangeText={(text) => {
          // agar sumFormat bo'lsa, faqat raqamlarni onChange ga yuboramiz
          onChangeText(sumFormat ? text.replace(/\D/g, "") : text);
          if (!touched) setTouched(true);
        }}
        keyboardType={keyboardType}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        placeholderTextColor={theme.placeholder}
        {...rest}
      />

      {showError && <Text style={styles.errorText}>{errorMessage}</Text>}
      {showMinLengthError && (
        <Text style={styles.errorText}>
          {label} kamida {minLength} ta belgi bo'lishi kerak
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, marginBottom: 3, color: "#858484" },
  input: {
    width: "100%",
    borderRadius: 10,
    padding: 10,
    borderWidth: 0.5,
    borderColor: "#eaeaea",
    fontSize: 18,
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

import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import { TextFieldProps } from "../../pages/types/types";
import { useTheme } from "../../theme/ThemeContext";
import { useLanguage } from "../../i18n/LanguageContext";

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
  const { t } = useLanguage();
  const translatedError = errorMessage === "Bu maydon to‘ldirilishi shart!" ? t("required") : errorMessage;
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
    <View style={{ width: "100%", marginBottom: 12 }}>
      <Text style={[styles.label, { color: theme.subText }]}>
        {label} {required && <Text style={{ color: theme.danger }}>*</Text>}
      </Text>

      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
          minHeight ? { minHeight: minHeight } : {},
          (showError || showMinLengthError) && styles.errorBorder,
        ]}
        editable={editable}
        multiline={multiline}
        secureTextEntry={secureTextEntry}
        cursorColor={theme.primary}
        selectionColor={theme.primary}
        value={displayValue}
        onChangeText={(text) => {
          onChangeText(sumFormat ? text.replace(/\D/g, "") : text);
          if (!touched) setTouched(true);
        }}
        keyboardType={keyboardType}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        placeholderTextColor={theme.placeholder}
        {...rest}
      />

      {showError && <Text style={[styles.errorText, { color: theme.danger }]}>{translatedError}</Text>}
      {showMinLengthError && (
        <Text style={[styles.errorText, { color: theme.danger }]}>
          {label} kamida {minLength} ta belgi bo'lishi kerak
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, marginBottom: 6, fontWeight: "600" },
  input: {
    width: "100%",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  errorBorder: {
    borderColor: "#F87171",
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
});

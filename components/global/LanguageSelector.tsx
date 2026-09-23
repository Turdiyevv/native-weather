import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import { Language, useLanguage } from "../../i18n/LanguageContext";

export default function LanguageSelector() {
  const { theme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const languages: { key: Language; label: string }[] = [
    { key: "uz", label: "UZ" },
    { key: "ru", label: "RU" },
    { key: "en", label: "EN" },
  ];

  return (
    <View style={styles.wrapper} accessibilityLabel={t("selectLanguage")}>
      <Text style={[styles.label, { color: theme.subText }]}>{t("language")}</Text>
      <View style={[styles.control, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {languages.map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={() => setLanguage(item.key)}
            style={[styles.option, language === item.key && { backgroundColor: theme.primary }]}
            accessibilityRole="button"
            accessibilityState={{ selected: language === item.key }}
          >
            <Text style={[styles.optionText, { color: language === item.key ? "#fff" : theme.subText }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", gap: 6 },
  label: { fontSize: 12, fontWeight: "600" },
  control: { flexDirection: "row", borderWidth: 1, borderRadius: 12, padding: 3 },
  option: { minWidth: 38, paddingVertical: 6, borderRadius: 9, alignItems: "center" },
  optionText: { fontSize: 11, fontWeight: "800" },
});

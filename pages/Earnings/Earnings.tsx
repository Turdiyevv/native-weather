import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import { useLanguage } from "../../i18n/LanguageContext";

const Earnings: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.empty}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>{t("earningsModule")}</Text>
          <Text style={[styles.description, { color: theme.subText }]}>
            {t("comingSoon")}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Earnings;

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  card: {
    width: "100%",
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 4,
  },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 8 },
  description: { fontSize: 16, textAlign: "center", lineHeight: 22 },
});

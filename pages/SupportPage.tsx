import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
} from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { useLanguage } from "../i18n/LanguageContext";
import Header from "../components/global/Header";

const SupportPage: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Biz haqimizda" isBack={true} />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>Vega</Text>
            <Text style={[styles.description, { color: theme.subText }]}> 
              {t("aboutDescription")}
            </Text>
            <Text style={[styles.subtitle, { color: theme.text }]}>{t("leaveMessage")}</Text>

            <TouchableOpacity
              style={[styles.linkButton, { backgroundColor: theme.primary }]}
              onPress={() => Linking.openURL("https://t.me/turdiyevme")}
            >
              <Text style={styles.linkText}>{t("viaTelegram")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SupportPage;

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  title: { fontSize: 28, fontWeight: "800", marginBottom: 8 },
  description: { fontSize: 16, textAlign: "center", lineHeight: 24 },
  subtitle: { fontSize: 15, marginTop: 18, marginBottom: 18, textAlign: "center", fontWeight: "600" },
  linkButton: {
    width: "100%",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  linkText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

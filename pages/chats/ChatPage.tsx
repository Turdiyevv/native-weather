import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AdminIcon from "../../assets/admin_icon.png";
import { useTheme } from "../../theme/ThemeContext";

const ChatPage: React.FC = () => {
  const { theme } = useTheme();

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Image source={AdminIcon} style={styles.icon} />
          <Text style={[styles.title, { color: theme.text }]}>Chat</Text>
          <Text style={[styles.description, { color: theme.subText }]}>
            Bu yerda keyinchalik online media chat yaratiladi.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 30 },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 4,
  },
  icon: { width: 170, height: 170, resizeMode: "contain" },
  title: { fontSize: 26, fontWeight: "800", marginTop: 12 },
  description: { fontSize: 16, textAlign: "center", marginTop: 12, lineHeight: 24 },
});

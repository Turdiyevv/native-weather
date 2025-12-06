import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView, Linking,
} from "react-native";
import AdminIcon from "../assets/admin_icon.png";

const ChatPage: React.FC = () => {
  const [message, setMessage] = useState("");

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Image source={AdminIcon} style={styles.icon} />
          <Text style={styles.description}>
            Bu yerda keyinchalik, media olamida katta o'rin egallaydigan chat yaratiladi.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  icon: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 15,
    color: "#555",
  },
  link: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 15,
    color: "orange",
  },
  form: {
    width: "100%",
    alignItems: "center",
  },
  textArea: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: "top",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButton: {
    width: "100%",
    backgroundColor: "#121",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

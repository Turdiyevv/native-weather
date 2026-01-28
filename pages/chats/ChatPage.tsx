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
import {useTheme} from "../../theme/ThemeContext";

const ChatPage: React.FC = () => {
    const { theme } = useTheme();

  return (
    <KeyboardAvoidingView
      style={[styles.container, {backgroundColor:theme.background}]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Image source={AdminIcon} style={styles.icon} />
          <Text style={[styles.description, {color: theme.text}]}>
            Bu yerda keyinchalik online media chat yaratiladi.
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
  }
})

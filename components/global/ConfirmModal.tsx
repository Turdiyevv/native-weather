import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {ConfirmModalProps} from "../../pages/types/types";
import {useTheme} from "../../theme/ThemeContext";

export default function ConfirmModal({ visible, message, onConfirm, onCancel }: ConfirmModalProps) {
  const { theme } = useTheme();
    return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onCancel}
      >
        <View style={[styles.modal, {backgroundColor: theme.background}]}>
          <Text style={[styles.message, {color: theme.text}]}>{message}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.btn} onPress={onCancel}>
              <Text style={[styles.canBtnText, {color: theme.text}]}>Yo‘q</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.btn} onPress={onConfirm}>
              <Text style={styles.btnText}>Ha</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
    divider: {
      width: 1,
      backgroundColor: "#cdcdcd",
      marginVertical: 3,
    },
  overlay: {
    flex:1,
    backgroundColor: "rgba(60,60,60,0.58)",
    justifyContent:"center",
    alignItems:"center",
  },
  modal: {
    width: "auto",
    maxWidth: "80%",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
    textAlign:"center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  btn: {
    flex: 1,
    paddingVertical: 5,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  canBtnText: {
    color: "#000",
    fontSize: 16,
  },
  btnText: {
    color: "red",
    fontSize: 16,
  },
});

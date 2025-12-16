import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, StyleSheet, Vibration} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useTheme} from "../theme/ThemeContext";

export default function PasswordCodeInput(
    {
      onComplete,
      title,
      color,
      status,
      autoSubmit = false,
      secureTextEntry = false,
      borderStyle={}
    }: any) {
  const [code, setCode] = useState<string>("");
  const { theme } = useTheme();

  useEffect(() => {
    if (status === true) {
      setCode("");
    }
  }, [status]);

  const handlePress = (digit: string) => {
    if (code.length >= 4) return;

    const newCode = code + digit;
    setCode(newCode);
    Vibration.vibrate(30);
    if (newCode.length === 4 && autoSubmit) {
      setTimeout(() => {
        onComplete(newCode);
      }, 150);
      Vibration.vibrate(40);
    }
  };

  const getCode = () => {
    if (code.length === 4) {
      setTimeout(() => {
        onComplete(code);
      }, 150);
      Vibration.vibrate(40);
    }
  };

  const handleDelete = () => {
    setCode(code.slice(0, -1));
    Vibration.vibrate(40);
  };

  return (
    <View style={styles.container}>
      {/* 4 ta katak */}
      <View style={styles.codeRow}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.codeBox, {borderColor: theme.text}, borderStyle]}>
            <Text
                style={[styles.codeText, {color: theme.text}]}
            >{secureTextEntry
              ? code[i] ? "•" : ""
              : code[i] || ""}
            </Text>
          </View>
        ))}
      </View>

      {title ? (
        <Text style={[styles.title, {color: color}]}>{title}</Text>
      ) : (
        <Text style={[styles.title, {color: theme.text}]}>Tezkor kod</Text>
      )}

      <View style={styles.keyboard}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <TouchableOpacity key={n} style={styles.key} onPress={() => handlePress(String(n))}>
            <Text style={styles.keyText}>{n}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.key} onPress={getCode}>
          <Ionicons style={styles.keyText} name="checkbox-outline" color="green" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.key} onPress={() => handlePress("0")}>
          <Text style={styles.keyText}>0</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.key} onPress={handleDelete}>
          <Ionicons style={styles.keyText} name="backspace-outline" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginTop: 30 },

  codeRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },

  title: {
    marginBottom: 10,
  },

  codeBox: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  codeText: {
    fontSize: 28,
    fontWeight: "500",
  },

  keyboard: {
    width: "80%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  key: {
    width: "30%",
    paddingVertical: 15,
    margin: "1.5%",
    backgroundColor: "#eae9e9",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  keyText: {
    fontSize: 26,
    fontWeight: "600",
  },
});

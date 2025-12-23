import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import {useTheme} from "../theme/ThemeContext";

export default function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const { theme } = useTheme();
    return (
    <TouchableOpacity
      style={[styles.container, value ? styles.on : styles.off, {backgroundColor: theme.background, borderColor: theme.text}]}
      onPress={() => onChange(!value)}
      activeOpacity={0.8}
    >
      <View style={[styles.dot,{backgroundColor: theme.text}, value ? styles.dotOn : styles.dotOff]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
      borderWidth: 2,
    width: 55,
    height: 28,
    borderRadius: 22,
    paddingVertical: 3,
    paddingHorizontal: 1,
    justifyContent: "center",
  },
  on: {
    backgroundColor: "#cc2626",
    alignItems: "flex-end",
  },
  off: {
    alignItems: "flex-start",
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  dotOn: {
    // extra style if needed
  },
  dotOff: {
    // extra style if needed
  },
});

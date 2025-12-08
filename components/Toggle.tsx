import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";

export default function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <TouchableOpacity
      style={[styles.container, value ? styles.on : styles.off]}
      onPress={() => onChange(!value)}
      activeOpacity={0.8}
    >
      <View style={[styles.dot, value ? styles.dotOn : styles.dotOff]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 55,
    height: 28,
    borderRadius: 20,
    padding: 3,
    justifyContent: "center",
  },
  on: {
    backgroundColor: "#cc2626",
    alignItems: "flex-end",
  },
  off: {
    backgroundColor: "#121",
    alignItems: "flex-start",
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "white",
  },
  dotOn: {
    // extra style if needed
  },
  dotOff: {
    // extra style if needed
  },
});

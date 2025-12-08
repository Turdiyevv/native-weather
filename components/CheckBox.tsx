import React from "react";
import { TouchableOpacity, View, StyleSheet, Text } from "react-native";

interface Props {
  label?: string;
  value: boolean;
  onChange: (val: boolean) => void;
  color?: string;
}

export default function SingleCheckBox({ label, value, onChange, color = "orange" }: Props) {
  return (
    <TouchableOpacity style={styles.row} onPress={() => onChange(!value)}>
      <View style={[styles.checkbox, { borderColor: value ? color : "#444" }]}>
        {value && <View style={[styles.innerDot, { backgroundColor: color }]} />}
      </View>
      {label && <Text style={[styles.label, value && { color }]}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  innerDot: {
    width: 15,
    height: 15,
    borderRadius: 4,
  },
  label: {
    fontSize: 16,
    color: "#222",
  },
});

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme/ThemeContext";
import { BusinessEntry } from "../../pages/types/userTypes";
import {formatSum} from "../../utills/utill";

type Props = BusinessEntry & {
  index: number;
  listLength: number;
};

export default function TodoItem({
  title,
  status,
  total,
  time,
  index,
  listLength,
}: Props) {
  const isFirst = index === 0;
  const isLast = index === listLength - 1;
  const isIncome = status === true;

  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.containerOne,
        { backgroundColor: theme.card },
        isFirst && styles.topRadius,
        isLast && styles.bottomRadius,
      ]}
    >
      <View
        style={[
          styles.container,
          { borderBottomColor: theme.border },
          !isLast && styles.borderBottom,
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text
          style={[
            styles.titlePlaceholder,
            { color: !isIncome ? "#2ecc71" : "#e74c3c" },
          ]}
        >
          {formatSum(total)}
        </Text>
      </View>

      <View style={styles.containerIc}>
        <Ionicons
          style={!isIncome && styles.scale}
          name={isIncome ? "trending-up-outline" : "trending-down-outline"}
          size={20}
          color={!isIncome ? "#2ecc71" : "#e74c3c"}
        />
        <Text style={{ fontSize: 10, color: theme.placeholder }}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scale: {
    transform: [{ scaleX: -1 }],
  },
  containerOne: {
    width: "100%",
    flexDirection: "row",
    paddingLeft: 10,
  },
  container: {
    flex: 1,
    alignItems: "flex-start",
    padding: 10,
  },
  containerIc: {
    paddingTop: 5,
    alignItems: "center",
    justifyContent: "center", // old: space-between → center
    paddingHorizontal: 10,
  },
  topRadius: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottomRadius: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  borderBottom: {
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 15,
  },
  titlePlaceholder: {
    fontSize: 12,
  },
});

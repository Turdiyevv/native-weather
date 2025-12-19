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
  date,
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
          !isLast && [styles.borderBottom, { borderBottomColor: theme.border }],
        ]}
      >
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          <View style={styles.smContainer}>
            <Text
              style={[
                styles.titlePlaceholder,
                { color: !isIncome ? "#2ecc71" : "#e74c3c" },
              ]}
            >{formatSum(total)}</Text>
              {date && (<Text style={[styles.dateFull, {color: theme.placeholder}]}>{date}</Text>)}
          </View>
      </View>

      <View style={styles.containerIc}>
        <Ionicons
          style={!isIncome && styles.scale}
          name={isIncome ? "trending-up-outline" : "trending-down-outline"}
          size={20}
          color={!isIncome ? "#2ecc71" : "#e74c3c"}
        />
        <Text style={{ fontSize: 10, bottom: -4, color: theme.placeholder }}>{time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    dateFull:{fontSize: 10, bottom: -9},
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
    padding: 8,
  },
  containerIc: {
    paddingTop: 5,
    alignItems: "center",
    justifyContent: "center",
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
    smContainer:{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
    },
  titlePlaceholder: {
    fontSize: 12,
  },
});

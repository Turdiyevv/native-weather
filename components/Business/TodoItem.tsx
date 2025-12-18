import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {useTheme} from "../../theme/ThemeContext";

type Props = {
  title: string | any;
  index: number;
  total: number;
  status: boolean;
};

export default function TodoItem({ title, status, index, total }: Props) {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const { theme } = useTheme();
  return (
      <View
          style={[
            styles.containerOne, {backgroundColor: theme.card},
            isFirst && styles.topRadius,
            isLast && styles.bottomRadius,
          ]}
      >
        <View
          style={[
            styles.container, {borderBottomColor: theme.border},
            !isLast && styles.borderBottom,
          ]}
        >
          <Text style={[styles.title, {color: theme.text}]}>{title}</Text>
          <Text style={[styles.titlePlaceholder, {color: theme.placeholder}]}>{total}</Text>
        </View>
        <View style={[styles.containerIc]}>
          <Ionicons style={!status ? styles.scale : ""}
            name={!!status ? "trending-up-outline" : "trending-down-outline"}
            size={20}
            color={!status ? "#2ecc71" : "#e74c3c"}
          />
            <Text style={{fontSize:10, bottom: 3, color: theme.placeholder}}>00:00</Text>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
    scale:{
        transform: [{ scaleX: -1}],
    },
  containerOne: {
    width: "100%",
    flexDirection: "row",
      paddingLeft: 10
  },
  container: {
    flex: 1,
    alignItems: "flex-start",
    padding: 10,
  },
  containerIc: {
        paddingTop: 5,
    alignItems: "center",
      justifyContent:"space-between",
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
        fontSize: 15
  },
  titlePlaceholder: {
        fontSize: 12
  },
});

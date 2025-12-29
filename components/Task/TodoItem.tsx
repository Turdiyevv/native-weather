import React from "react";
import {TouchableOpacity, Text, StyleSheet, View, Dimensions} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {TodoItemProps} from "../../pages/types/types";
import {useTheme} from "../../theme/ThemeContext";

export default function TodoItem({ item, onPressIn, onPress, onPressOut, onLongPress, isFirst, isLast }: TodoItemProps) {

    const { theme } = useTheme();
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    let deadlineColor = "#2b87af";

    if (item.deadline) {
      const deadlineDate = new Date(item.deadline);
      if (
        deadlineDate.getFullYear() === today.getFullYear() &&
        deadlineDate.getMonth() === today.getMonth() &&
        deadlineDate.getDate() === today.getDate()
      ) {
        deadlineColor = "#fa5d5d"; // bugun
      } else if (
        deadlineDate.getFullYear() === tomorrow.getFullYear() &&
        deadlineDate.getMonth() === tomorrow.getMonth() &&
        deadlineDate.getDate() === tomorrow.getDate()
      ) {
        deadlineColor = "#fa5d5d"; // ertaga
      }
    }

    const createdTime = new Date(item.time);
  const formattedTime = createdTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  const formattedDeadline = item.deadline ? new Date(item.deadline).toLocaleDateString() : null;
  const displayTitle = item.title.length > 26 ? item.title.slice(0, 26) + "..." : item.title;

  return (
    <TouchableOpacity
      style={[
        styles.item, {backgroundColor: theme.card, borderColor: theme.background},
        isFirst && styles.firstBorder,
        isLast && styles.lastBorder,
      ]}
      onPressIn={onPressIn}
      onPress={onPress}
      onPressOut={onPressOut}
      onLongPress={(event) => onLongPress && onLongPress(event.nativeEvent.pageY)}
    >
        <View style={[
            styles.defaultItem, isFirst && styles.firstBorder, isLast && styles.lastBorder,
            item.isReturning && item.isReturning > 0 && !item.done ?
                styles.returningBorder : item.done ?
                styles.done : null,
            item.isDeleted && {backgroundColor: theme.deleted}
        ]}>
            <View style={styles.titleContainer}>
                <Text style={[styles.text, item.isDeleted && styles.doneText, {color: theme.text}]}>{displayTitle}</Text>
                {/*<Text style={[styles.text, item.isDeleted && styles.doneText, {color: theme.text}]}>{JSON.stringify(item.alarmDate)}</Text>*/}
            <View style={styles.iconBox}>
              {item.isReturning && item.isReturning > 0 && (
                <View style={styles.returnCount}>
                  <Ionicons
                    name="refresh-outline"
                    size={22}
                    color="#a19e9e"
                    style={styles.scale}
                  />
                  <Text style={[styles.returnCountText, {color: theme.text}]}>{item.isReturning}</Text>
                </View>
              )}
              {item.done && (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color="#4CAF50"
                    style={{marginLeft:1}}
                  />
              )}
              {(item.isDeleted && !item.done || deadlineColor === "#fa5d5d") && (
                  <Ionicons
                    name="alert-circle"
                    size={22}
                    color="grey"
                    style={{marginLeft:1}}
                  />
              )}
              {item.isDeleted &&(
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color="red"
                />
              )}
            </View>
          </View>
          <View style={styles.titleContainer2}>
                {
                    formattedDeadline ?
                        <Text style={[styles.deadline, {color: deadlineColor}]}>{formattedDeadline}</Text> :
                        <Text style={styles.deadlineBox}></Text>
                }
                <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[formattedDeadline ? styles.description : styles.description2, {color: theme.description}]}
                >{item.description}</Text>
              <View style={styles.timeContainer}>
                <Text style={styles.time}>{formattedTime}</Text>
              </View>
          </View>
          <View style={[styles.draft, (item.isReturning && item.isDeleted) ? {right: 64,} : {right: 47,}]}>
                {item.status > 1 && (
                    <Ionicons
                        name="bookmark" size={20}
                        color={item.status === 2 ? "orange" : "#fb5151"}
                    />
                )}
          </View>
        </View>
    </TouchableOpacity>
  );
}
const screenWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
    scale: {
        top: -1,
        transform: [{scaleX: -1,}, {rotate: "40deg"}],
    },
    firstBorder: {
        borderTopLeftRadius: 10,
        borderTopEndRadius: 10,
        borderTopWidth: 0,
    },
    lastBorder: {
        borderBottomLeftRadius: 10,
        borderBottomEndRadius: 10,
        borderBottomWidth: 0,
    },
  deleted: {
    backgroundColor: "#e1e0e0",
  },
  returningBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#a19e9e",
    borderBottomWidth: 0,
  },
  done: {
    borderColor: "#4CAF50",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 0,
  },
  item: {
    borderTopWidth: 1,
    height: 64,
  },
  defaultItem:{
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 12,
    height: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer2: {
    flexDirection: "row",
      alignItems: "center",
    justifyContent: "flex-start",
  },
  iconBox:{
    flexDirection: "row",
    alignItems: "center"
  },
  text: { fontSize: 18 },
  doneText: { textDecorationLine: "line-through", color: "gray" },
  returnCount: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  returnCountText: {
     marginLeft: 3,
     position: "absolute",
     fontSize: 11,
  },
  draft: {
    position: "absolute",
    top: -4,
  },
  deadline: { fontSize: 14, marginTop: 0 },
  deadlineBox: { height: 14, marginTop: 0 },
  timeContainer: {marginLeft: "auto" },
  time: { fontSize: 12, color: "gray" },
  description: { fontSize: 14, marginLeft: 3, maxWidth: screenWidth - 154,},
  description2: { fontSize: 14, marginLeft: 3, maxWidth: screenWidth - 84,},
});

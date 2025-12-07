import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomHeaderProps {
  firstName?: string;
  username?: string;
  avatar?: string;
  onProfilePress?: () => void;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  firstName,
  username,
  avatar,
  onProfilePress,
}) => {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.username}>{firstName || "-"}</Text>
        <Text style={styles.keyUsername}>@{username || "-"}</Text>
      </View>
      <TouchableOpacity onPress={onProfilePress}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <Ionicons name="person-circle-outline" size={50} color="#555" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    borderColor: "#121",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderBottomEndRadius: 25,
    borderTopEndRadius: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 60,
    backgroundColor: "#f5f5f5",
  },
  username: { fontSize: 22, fontWeight: "bold" },
  keyUsername: { fontSize: 12, color: "gray" },
  avatar: {
    borderColor: "#121",
    borderWidth: 2,
    backgroundColor: "#121",
    width: 50,
    height: 50,
    margin: 1,
    borderRadius: 25,
  },
});

export default CustomHeader;

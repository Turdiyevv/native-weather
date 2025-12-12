import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getActiveUser } from '../service/storage';
import { User } from '../pages/types/userTypes';
import { useFocusEffect } from "@react-navigation/native";

interface HeaderProps {onProfilePress: () => void}
const CustomHeader: React.FC<HeaderProps> = ({ onProfilePress }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCurrentUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await getActiveUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Failed to load active user:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      loadCurrentUserData();
    }, [loadCurrentUserData])
  );
  if (isLoading) {
    return (
      <View style={styles.header}>
        <Text>Loading profile...</Text>
      </View>
    );
  }
  if (!currentUser) {
      return (
          <View style={styles.header}>
              <Text>No active user found.</Text>
               <TouchableOpacity onPress={onProfilePress}>
                 <Ionicons name="person-circle-outline" size={50} color="#555" />
               </TouchableOpacity>
          </View>
      );
  }
  const { firstName, avatar } = currentUser.userinfo;
  const { username } = currentUser;


  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.username}>{firstName || "Name"}</Text>
        <Text style={styles.keyUsername}>@{username || "username"}</Text>
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
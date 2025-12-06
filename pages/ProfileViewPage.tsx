import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  ScrollView,
  Animated,
  Dimensions
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import { logout } from "../utills/LogOut";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

type ProfileViewNavProp = NativeStackNavigationProp<RootStackParamList, "ProfileView">;

export function ProfileViewPage() {
  const navigation = useNavigation<ProfileViewNavProp>();
  const [user, setUser] = useState<any>(null);
  const avatarAnim = useRef(new Animated.Value(0)).current;

  const loadActiveUser = async () => {
    try {
      const userData = await AsyncStorage.getItem("activeUser");
      if (!userData) return;
      const activeUser = JSON.parse(userData);

      // userinfo bilan ishlash
      const profile = activeUser.userinfo || {};
      setUser({
        username: activeUser.username,
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        avatar: profile.avatar || "",
        phone: profile.phone || "",
        job: profile.job || "",
        description: profile.description || ""
      });
    } catch (e) {
      console.log("Error loading active user", e);
    }
  };

  useEffect(() => {
    loadActiveUser();
    const unsubscribe = navigation.addListener("focus", loadActiveUser);
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "MainPage" }],
        })
      );
      return true;
    });

    return () => {
      unsubscribe();
      backHandler.remove();
    };
  }, []);

  const animatedSize = avatarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [150, screenWidth - 40],
  });

  const animatedRadius = avatarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [75, 10],
  });

  return (
    <ScrollView
      onScroll={(e) => {
        const y = e.nativeEvent.contentOffset.y;
        Animated.timing(avatarAnim, {
          toValue: y > 50 ? 0 : 1,
          duration: 250,
          useNativeDriver: false,
        }).start();
      }}
      scrollEventThrottle={16}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.container}>
        {user?.avatar ? (
          <Animated.Image
            source={{ uri: user.avatar }}
            style={[
              styles.avatarBase,
              {
                width: animatedSize,
                height: animatedSize,
                borderRadius: animatedRadius,
              },
            ]}
          />
        ) : (
          <Ionicons
            name="person-circle-outline"
            size={150} // avatar bilan bir xil
            color="#555"
          />
        )}
      </View>


        <View style={styles.container}>
          <Text style={styles.title}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.username}>@{user?.username}</Text>
        </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Telefon:</Text>
        <Text style={styles.value}>{user?.phone}</Text>

        <Text style={styles.label}>Faoliyat:</Text>
        <Text style={styles.value}>{user?.job}</Text>

        <Text style={styles.label}>Izoh:</Text>
        <Text style={styles.value}>{user?.description}</Text>
      </View>

      <View style={styles.btns}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("ProfileEdit")}
        >
          <Text style={styles.editText}>Tahrirlash</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.outButton}
          onPress={() => logout(navigation)}
        >
          <Text style={styles.outText}>Chiqish</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  logoutBtn: {
    borderRadius: 20,
    paddingHorizontal: 5,
    paddingVertical: 5,
    marginTop: 0,
    marginRight: 0,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingBottom: 50
  },
  container: {
    alignItems: "center",
    flex: 1,
    marginBottom:10,
  },
  avatarBase: {
    backgroundColor: "#ddd",
    marginTop: 10,
  },
  title: { fontSize: 24, fontWeight: "bold" },
  username: { fontSize: 18, color: "#666" },
  infoBox: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 30
  },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  value: { fontSize: 16, color: "#333" },
  btns:{
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editButton: {
    backgroundColor: "#121",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center"
  },
  outButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    width: "48%",
    alignItems: "center"
  },
  editText: { color: "white", fontSize: 18 },
  outText: { color: "red", fontSize: 18 },
});

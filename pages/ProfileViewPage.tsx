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

const screenWidth = Dimensions.get("window").width;
const maxSize = screenWidth - 40; // Katta holat
const minSize = 150;              // Kichik holat

type ProfileViewNavProp = NativeStackNavigationProp<RootStackParamList, "ProfileView">;

export function ProfileViewPage() {
    const navigation = useNavigation<ProfileViewNavProp>();
    const [user, setUser] = useState<any>(null);
    const avatarAnim = useRef(new Animated.Value(1)).current; // 0 → small, 1 → big

    // AsyncStorage dan profil ma'lumotlarini yuklash
    const loadUser = async () => {
        try {
            const saved = await AsyncStorage.getItem("profile");
            if (saved) setUser(JSON.parse(saved));
        } catch (e) {
            console.log("Error loading profile", e);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", loadUser);
        loadUser();

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
        outputRange: [minSize, maxSize],
    });

    const animatedRadius = avatarAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [75, 10],
    });

    const animatedStyle = {
        width: animatedSize,
        height: animatedSize,
        borderRadius: animatedRadius,
    };

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
                <Animated.Image
                    source={user?.avatar ? { uri: user.avatar } : require("../assets/adaptive-icon.png")}
                    style={[styles.avatarBase, animatedStyle]}
                />
            </View>

            <Text style={styles.title}>
                {user?.firstName} {user?.lastName}
            </Text>

            <Text style={styles.username}>@{user?.username}</Text>

            <View style={styles.infoBox}>
                <Text style={styles.label}>Telefon:</Text>
                <Text style={styles.value}>{user?.phone}</Text>

                <Text style={styles.label}>Faoliyat:</Text>
                <Text style={styles.value}>{user?.job}</Text>

                <Text style={styles.label}>Izoh:</Text>
                <Text style={styles.value}>{user?.description}</Text>
            </View>

            <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate("ProfileEdit")}
            >
                <Text style={styles.editText}>Tahrirlash</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        padding: 20,
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        paddingBottom: 50
    },
    container: {
        alignItems: "center",
    },

    avatarBase: {
        backgroundColor: "#ddd",
        marginBottom: 20,
        marginTop: 10,
    },

    title: { fontSize: 24, fontWeight: "bold" },
    username: { fontSize: 18, color: "#666", marginBottom: 20 },

    infoBox: {
        width: "100%",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 30
    },

    label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
    value: { fontSize: 16, color: "#333" },

    editButton: {
        backgroundColor: "black",
        padding: 15,
        borderRadius: 10,
        width: "100%",
        alignItems: "center"
    },
    editText: { color: "white", fontSize: 18 },
});

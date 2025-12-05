import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, BackHandler } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";

type ProfileViewNavProp = NativeStackNavigationProp<RootStackParamList, "ProfileView">;

export function ProfileViewPage() {
    const navigation = useNavigation<ProfileViewNavProp>();
    const [user, setUser] = useState<any>(null);

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

        // Android hardware back tugmasini to'sish va MainPage ga yo'naltirish
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
    }, [navigation]);

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Profil maʼlumotlari topilmadi</Text>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate("ProfileEdit")}
                >
                    <Text style={styles.editText}>Profilni to‘ldirish</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image
                source={user.avatar ? { uri: user.avatar } : require("../assets/adaptive-icon.png")}
                style={styles.avatar}
            />

            <Text style={styles.title}>
                {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.username}>@{user.username}</Text>

            <View style={styles.infoBox}>
                <Text style={styles.label}>Telefon:</Text>
                <Text style={styles.value}>{user.phone}</Text>

                <Text style={styles.label}>Faoliyat:</Text>
                <Text style={styles.value}>{user.job}</Text>

                <Text style={styles.label}>Izoh:</Text>
                <Text style={styles.value}>{user.description}</Text>
            </View>

            <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate("ProfileEdit")}
            >
                <Text style={styles.editText}>Tahrirlash</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", padding: 20, backgroundColor: "#f5f5f5" },

    avatar: { width: 150, height: 150, borderRadius: 75, backgroundColor: "#ddd", marginBottom: 20, marginTop: 10 },

    title: { fontSize: 24, fontWeight: "bold" },
    username: { fontSize: 18, color: "#666", marginBottom: 20 },

    infoBox: { width: "100%", backgroundColor: "#fff", padding: 15, borderRadius: 12, marginBottom: 30 },

    label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
    value: { fontSize: 16, color: "#333" },

    editButton: { backgroundColor: "black", padding: 15, borderRadius: 10, width: "100%", alignItems: "center" },
    editText: { color: "white", fontSize: 18 },
});

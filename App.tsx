import React, {useEffect, useState} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { enableScreens } from "react-native-screens";
import MainPage from "./pages/Main";
import AddPage from "./components/screens/AddPage";
import ProfilePage from "./pages/ProfilePage";
import { ProfileViewPage } from "./pages/ProfileViewPage";
import ChatPage from "./pages/ChatPage";
import SupportPage from "./pages/SupportPage";
import Bussiness from "./pages/Bussiness";
import LoginPage from "./pages/LogIn";
import { RootStackParamList } from "./pages/types";
import FlashMessage from "react-native-flash-message";
import {Platform, StatusBar, View, StyleSheet, AppState} from "react-native";
import LoginCodePage from "./pages/LoginCodePage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeletedTasks from "./pages/DeletedTasks";
import DoneTasks from "./pages/DoneTasks";

enableScreens();

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
    const navigationRef = React.useRef<any>(null);
    const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);
    const lastTimeRef = React.useRef<number>(Date.now());

    useEffect(() => {
        let lastState = AppState.currentState;

        const sub = AppState.addEventListener("change", (nextState) => {
        console.log("filePickerOpen:", global.filePickerOpen);
        console.log("next:", nextState, "last:", lastState);
        if (global.filePickerOpen) {
            return;
        }

        if (nextState === "background" || nextState === "inactive") {
            lastTimeRef.current = Date.now();
        }

        if (lastState !== "active" && nextState === "active") {
            const now = Date.now();
            const diff = now - lastTimeRef.current;

            if (diff > 2000) {
                console.log("diff:", diff);
                navigationRef.current?.navigate("LoginCodePage");
            }
        }
        lastState = nextState;
        });

        return () => sub.remove();
    }, []);

    const checkUsers = async () => {
        const usersStr = await AsyncStorage.getItem("users");
        const users = usersStr ? JSON.parse(usersStr) : [];
        if (users.length > 0) {
            setInitialRoute("LoginCodePage");
        } else {
            setInitialRoute("LoginPage");
        }
    };

    useEffect(() => {
        checkUsers();
    }, []);

    if (!initialRoute) return null;

    return (
        <>
            <StatusBar
                barStyle={Platform.OS === "ios" ? "light-content" : "dark-content"}
                backgroundColor="#121"
            />
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator
                    initialRouteName={initialRoute}
                    screenOptions={{
                        headerShown: true,
                    }}
                >
                    <Stack.Screen options={{ headerShown: false }} name="LoginCodePage" component={LoginCodePage} />
                    <Stack.Screen options={{ headerShown: false }} name="LoginPage" component={LoginPage} />
                    <Stack.Screen name="MainPage" component={MainPage} options={{ headerShown: false }} />
                    {/* Pages */}
                    <Stack.Screen name="AddPage" options={{ headerShown: false }} component={AddPage} />
                    <Stack.Screen name="ProfileView" options={{ headerShown: false }} component={ProfileViewPage} />
                    <Stack.Screen name="ProfileEdit" options={{ headerShown: false }} component={ProfilePage} />
                    <Stack.Screen name="Chat" options={{ headerShown: false }} component={ChatPage} />
                    <Stack.Screen name="Support" options={{ headerShown: false }} component={SupportPage} />
                    <Stack.Screen name="Bussiness" options={{ headerShown: false }} component={Bussiness} />
                    <Stack.Screen name="DeletedTasks" options={{ headerShown: false }} component={DeletedTasks} />
                    <Stack.Screen name="DoneTasks" options={{ headerShown: false }} component={DoneTasks} />
                </Stack.Navigator>

                <View style={styles.flashWrapper}>
                    <FlashMessage position="top" style={styles.flashBox} />
                </View>
            </NavigationContainer>
        </>
    );
};

const styles = StyleSheet.create({
    flashWrapper: {
        position: "absolute",
        top: 37,
        width: "100%",
        zIndex: 9999,
    },
    flashBox: {
        marginHorizontal: 20,
        flex: 1,
        paddingVertical: 10,
        borderRadius: 16,
        opacity: 0.95,
    },
});

export default App;

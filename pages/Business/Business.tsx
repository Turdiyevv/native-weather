import React, {useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    BackHandler,
    ScrollView,
} from 'react-native';
import AdminIcon from "../../assets/admin_icon.png";
import {RootStackParamList} from "../types/types";
import {CommonActions, useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useTheme} from "../../theme/ThemeContext";
import Calendar from "../../components/global/Calendar";
import Header from "../../components/global/Header";

type SupportNav = NativeStackNavigationProp<RootStackParamList, "Business">;

export default function BackdropFilterExample() {
    const { theme } = useTheme();
    const navigation = useNavigation<SupportNav>();

    useEffect(() => {
        const backAction = () => {
            if (navigation.canGoBack()) {
                navigation.goBack();
            } else {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: "MainTabs" }],
                  })
                );
            }
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
        return () => backHandler.remove();
    }, []);

    return (
        <View style={[styles.container, {backgroundColor: theme.background}]}>
            <Header title={"Beznis"}/>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Image source={AdminIcon} style={styles.icon} />
                    <Text style={[styles.description, {color: theme.text}]}>
                        Bu yerda biznesingiz bo'yicha qulay hisobotlar yig'ishingiz mumkin.
                    </Text>
                </View>
                <View style={styles.calendarWrapper}>
                    <Calendar/>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingVertical: 20,
    },
    header: {
        alignItems: "center",
        marginBottom: 15,
        paddingHorizontal: 30,
    },
    icon: {
        width: 100,
        height: 100,
        resizeMode: "contain",
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 15,
        color: "#555",
    },
    calendarWrapper: {
        marginHorizontal: 20,
    }
});
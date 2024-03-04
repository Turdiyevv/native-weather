import React from "react";
import {Text, View, StyleSheet} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";

export default function Weather(location){
    console.log (location)
    return (
        <LinearGradient colors={['#757F9A', '#D7DDE8']}
                        style={styles.container}>
            <Text>
                Weather
            </Text>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
 })

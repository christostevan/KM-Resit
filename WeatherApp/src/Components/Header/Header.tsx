import React from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../App";

// Defines screen on the root path
type historicalScreenProp = StackNavigationProp<RootStackParamList, "Historical", "Forecasting">;

const Header: React.FC = () => {
    const navigation = useNavigation<historicalScreenProp>();

    const handlePressHistorical = () => {
        navigation.navigate("Historical");
    }

    const handlePressTitle = () => {
        navigation.navigate("Forecasting");
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleSection}>
                <TouchableHighlight
                    underlayColor="transparent"
                    onPress={() => handlePressTitle()}
                    testID="title-navigate"
                >
                    <Text style={styles.h1}>Weather App</Text>
                </TouchableHighlight>
            </View>
            <View style={styles.menuSection}>
                <TouchableHighlight
                    underlayColor="transparent"
                    onPress={() => handlePressHistorical()}
                    testID="historical-navigate"
                >
                    <Text style={styles.menuText}>Historical data</Text>
                </TouchableHighlight>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexDirection: "row",
        paddingHorizontal: 16,
        backgroundColor: "#5D7879",
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10
    },
    titleSection: {
        flex: 1,
        alignItems: "flex-start",
        width: "80%",
        textAlign: "center"
    },
    h1: {
        fontSize: 20,
    },
    menuSection: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        width: 50
    },
    menuText: {
        color: "white",
        fontSize: 18,
    }
});



export default Header;
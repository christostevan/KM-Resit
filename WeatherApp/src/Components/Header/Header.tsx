import React from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import Historical from "../../Historical/Historical";

/*
Could you maybe look into getting access to firebase cloud functions? You need to accept a pay as you go plan to access it. 
It will only start to cost money after 2 million requests, so that should not form a problem. For some reason 
however it continuously says I cant accept it.
*/

const Header: React.FC = () => {
    const navigation = useNavigation();

    const handlePressHistorical = () => {
        navigation.navigate("Historical");
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleSection}>
                <Text style={styles.h1}>Weather App</Text>
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
    },
    h1: {
        fontSize: 20,
    },
    menuSection: {
        flex: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    menuText: {
        color: "white",
        fontSize: 18,
    }
});



export default Header;
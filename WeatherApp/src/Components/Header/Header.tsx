import React from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

const Header = () => {

    return (
        <View style={styles.container}>
          <Text style={styles.h1}>Weather App</Text>
          <StatusBar style="auto" />
        </View>
      );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#5D7879",
      height: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    h1: {
      fontSize: 20,
      
    }
  });



export default Header;
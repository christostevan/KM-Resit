import React, { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Forecasting from "./src/Components/Body/Forecasting/Forecasting";
import Historical from "./src/Historical/Historical";

const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Forecast"
        screenOptions={{
          headerShown: false, // Hide navigation bar by default
        }}>
        <Stack.Screen name="Forecast" component={Forecasting} />
        <Stack.Screen name="Historical" component={Historical} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%"
  }
});

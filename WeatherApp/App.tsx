import React, { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Forecasting from "./src/Components/Body/Forecasting/Forecasting";
import Historical from "./src/Components/Body/Historical/Historical";
import Alarm from "./src/Components/Body/Alarm/Alarm"

// Type checking navigator. Make 'screens' directory to contain screens that the app has
export type RootStackParamList = {
  Forecasting: undefined;
  Historical: undefined;
  Alarm: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator initialRouteName="Forecasting"
        screenOptions={{
          headerShown: false, // Hide navigation bar by default
        }}>
        <Stack.Screen name="Forecasting" component={Forecasting} />
        <Stack.Screen name="Historical" component={Historical} />
        <Stack.Screen name="Alarm" component={Alarm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%"
  }
});

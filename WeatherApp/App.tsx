import React, { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Forecasting from "./src/Components/Body/Forecasting/Forecasting";

export default function App() {

  return (
    <Forecasting />
  );
};

const styles = StyleSheet.create({
});

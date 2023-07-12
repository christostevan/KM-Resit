import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import Header from "../../Header/Header";
import { DailyForecast } from "../../../Service/request";
import { CityFetch } from "../../../Service/request";

const Alarm: React.FC = () => {

    useEffect(() => {
    }, []);

    return (
        <Header />
    );
};

export default Alarm;
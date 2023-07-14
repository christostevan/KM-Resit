import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { DailyForecast } from "../../../Service/request";
import { CityFetch } from "../../../Service/request";

const Alarm = () => {

    useEffect(() => {
        console.log(typeof Alarm);
    }, []);

    return (
        <View>

        </View>
    );
};

export default Alarm;
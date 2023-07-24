import React, { useEffect, useState, useRef } from "react";
import { View, Platform, Button, Alert, Text } from "react-native";
import { scheduleNotificationAsync } from "expo-notifications";
import { PrecipicationHourlyForecasting, DailyForecasting } from "../../../Service/request";

interface alarmProps {
    cityName: string
}

export const scheduleNotification = (time: Date, description: string) => {
    scheduleNotificationAsync({
        content: {
            title: 'Bad weather',
            body: description + " is expected",
        },
        trigger: {
            date: new Date(time)
            // seconds: Math.floor(scheduleTime.getTime() / 1000)
        }
    });
}

// For showing an alert 15 mins before if the precipication forecasting is bad
export async function fetchAPIHourly(cityName: string): Promise<any> {
    const jsonData = await PrecipicationHourlyForecasting(cityName);

    if (jsonData["report"] !== "null") {
        // Set alarm date
        const alarmTime: Date = new Date();
        alarmTime.setHours(alarmTime.getHours() + 3); // 1 hr in advance
        // alarmTime.setMinutes(alarmTime.getMinutes() + 2); // Comment later

        const triggerTime = alarmTime.getTime() - (15 * 60 * 1000); // 15 mins before
        scheduleNotification(alarmTime, jsonData["report"].toString());
    }
};

export async function fecthAPIDaily(cityName: string): Promise<any> {
    const jsonData = await DailyForecasting(cityName);
    if (jsonData["result"] === true) {
        const alarmTime: Date = new Date();
        const scheduleTime = new Date(alarmTime.getTime() + (1 * 60 * 1000));
        // alarmTime.setMinutes(alarmTime.getMinutes() + 1 * 60 * 1000); // Comment later
        scheduleNotification(scheduleTime, "High " + jsonData["type"])
    }
};


const Alarm: React.FC<alarmProps> = ({cityName}) => {

    useEffect(() => {
        fecthAPIDaily(cityName);

        // // Schedule subsequent API calls every hour
        const interval = setInterval(() => {
            fetchAPIHourly(cityName);
        }, 3600000); // 1 hr in milliseconds

        return () => {
            // Clear the interval when the component is unmounted
            clearInterval(interval);
        };
    });

    return (
        <View testID="alarm-test">
        </View>
    )
}

export default Alarm;
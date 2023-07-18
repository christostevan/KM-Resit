import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Audio } from "expo-av";
import * as Notification from "expo-notifications";
import { PrecipicationHourlyForecasting } from "../../../Service/request";

const Alarm: React.FC = () => {
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [precipitation, setPrecipitation] = useState<String>('');

    useEffect(() => {
        fetchAPI();

        // Schedule subsequent API calls every hour
        const interval = setInterval(() => {
            fetchAPI();
        }, 3600); // 1 hr in milliseconds

        return () => {
            // Clear the interval when the component is unmounted
            clearInterval(interval)
        };
    }, []);

    async function fetchAPI(): Promise<any> {
        const jsonData = await PrecipicationHourlyForecasting(0, 0);
        setPrecipitation(jsonData["report"].toString());

        if (jsonData["report"] === "null") {
            // Set alarm date
            const alarmTime = new Date();
            alarmTime.setHours(alarmTime.getHours() + 1);
            alarmTime.setMinutes(alarmTime.getMinutes() - 15);

            // await Notification.scheduleNotificationAsync( {
            //     content: {
            //         title: "Alert",
            //         body:  jsonData["report"] + "is expected",
            //     },
            //     trigger: {
            //         date: alarmTime,
            //     },
            // });
        }
    };

    return (
        <View>

        </View>
    )
}

export default Alarm;
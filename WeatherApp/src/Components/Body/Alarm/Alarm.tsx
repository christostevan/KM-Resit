import React, { useEffect, useState, useRef } from "react";
import { View, Platform, Button, Alert, Text } from "react-native";
// import { Audio } from "expo-av";
// import Sound from "react-native-sound";
// import Alarm from "react-native-alarm-manager";
import * as Notification from "expo-notifications";
import { PrecipicationHourlyForecasting, DailyForecasting } from "../../../Service/request";

interface alarmProps {
    cityName: string;
}

const Alarm: React.FC<alarmProps> = ({ cityName }) => {
    // const [time, setTime] = useState<Date | null>(null);
    // const alarmSound = useRef<Sound | HTMLAudioElement | null>(null);
    // const [sound, setSound] = useState<Audio.Sound | null>(null);

    useEffect(() => {
        fecthAPIDaily();
        // fetchAPIHourly();

        // // Schedule subsequent API calls every hour
        // const interval = setInterval(() => {
        //     fetchAPIHourly();
        // }, 3600000); // 1 hr in milliseconds

        return () => {
            // Clear the interval when the component is unmounted
            // clearInterval(interval);
            // sound
            //     ? () => {
            //         sound.unloadAsync();
            //     }
            //     : undefined;
        };
    });

    // For showing an alert 15 mins before if the precipication forecasting is bad
    // async function fetchAPIHourly(): Promise<any> {
    //     const jsonData = await PrecipicationHourlyForecasting(cityName);

    //     if (jsonData["report"] !== "null") {
    //         // Set alarm date
    //         const alarmTime: Date = new Date();
    //         // alarmTime.setHours(alarmTime.getHours() + 3); // 1 hr in advance
    //         alarmTime.setMinutes(alarmTime.getMinutes() + 2); // Comment later
    //         console.log(alarmTime);

    //         // const triggerTime = alarmTime.getTime() - (15 * 60 * 1000); // 15 mins before
    //         // alert(alarmTime);
    //         scheduleNotification(alarmTime, jsonData["report"].toString());
    //     }
    // };

    const scheduleNotification = (time: Date, description: string) => {

        Notification.scheduleNotificationAsync({
            content: {
                title: 'Bad weather',
                body: description + "is expected",
            },
            trigger: {
                date: new Date(time)
                // seconds: Math.floor(scheduleTime.getTime() / 1000)
            }
        });
    }

    async function fecthAPIDaily(): Promise<any> {
        const jsonData = await DailyForecasting(cityName);
        if (jsonData["result"] === true) {
            const alarmTime: Date = new Date();
            const scheduleTime = new Date(alarmTime.getTime() + (1 * 60 * 1000));
            // alarmTime.setMinutes(alarmTime.getMinutes() + 1 * 60 * 1000); // Comment later
            scheduleNotification(scheduleTime, "High " + jsonData["type"])
        }
    };

    // const playSound = async (data: String) => {

    //     alert(data + " is expected");
    //     try {
    //         const { sound } = await Audio.Sound.createAsync(
    //             require('../../../../sound/alarm.mp3'),
    //             { shouldPlay: true }
    //         );
    //         Alert.alert(
    //             data + " is expected",
    //             "Press ok to stop the sound",
    //             [{ text: 'OK', onPress: stopSound }],
    //             { cancelable: false }
    //         );
    //         await sound.playAsync();
    //         // setSound(sound);
    //     } catch (error) {
    //         console.log('Error while loading the sound:', error);
    //     }
    // };

    // const stopSound = async () => {
    //     try {
    //         if (sound) {
    //             await sound.stopAsync();
    //         }
    //     } catch (error) {
    //         console.log('Error while stopping the sound:', error);
    //     }
    // };


    return (
        <View>
            <Text></Text>
        </View>
    )
}

export default Alarm;
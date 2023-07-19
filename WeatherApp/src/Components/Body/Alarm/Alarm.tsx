import React, { useEffect, useState, useRef } from "react";
import { View, Platform, Button, Alert } from "react-native";
import { Audio } from "expo-av";
import * as Notification from "expo-notifications";
// import Sound from "react-native-sound";
// import Alarm from "react-native-alarm-manager";
import { PrecipicationHourlyForecasting, DailyForecasting } from "../../../Service/request";

const Alarm: React.FC = () => {
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    // const alarmSound = useRef<Sound | HTMLAudioElement | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    useEffect(() => {
        fetchAPIHourly();

        // Schedule subsequent API calls every hour
        const interval = setInterval(() => {
            fetchAPIHourly();
        }, 3600000); // 1 hr in milliseconds

        return () => {
            // Clear the interval when the component is unmounted
            clearInterval(interval);
            sound
                ? () => {
                    sound.unloadAsync();
                }
                : undefined;
        };
    }, [sound]);

    // For showing an alert 15 mins before if the precipication forecasting is bad
    async function fetchAPIHourly(): Promise<any> {
        const jsonData = await PrecipicationHourlyForecasting(0, 0);

        if (jsonData["report"] != "null") {
            // Set alarm date
            const alarmTime = new Date();
            alarmTime.setHours(alarmTime.getHours() + 1);
            alarmTime.setMinutes(alarmTime.getMinutes() - 15);
            console.log("sda");
            playSound(jsonData["report"]);
        }
    };

    async function fecthAPIDaily(): Promise<any> {
        const jsonData = await DailyForecasting(0, 0);
    };

    const playSound = async (data: String) => {
        try {
            alert(data + " is expected");
            const { sound } = await Audio.Sound.createAsync(
                require('../../../../sound/alarm.mp3'),
                { shouldPlay: true }
            );
            Alert.alert(
                data + " is expected", 
                "Press ok to stop the sound",
                [{text: 'OK', onPress: stopSound}],
                {cancelable: false}
            );
            await sound.playAsync();
            setSound(sound);
        } catch (error) {
            console.log('Error while loading the sound:', error);
        }
    };

    const stopSound = async () => {
        try {
            if (sound) {
                await sound.stopAsync();
            }
        } catch (error) {
            console.log('Error while stopping the sound:', error);
        }
    };


    return (
        <View>
        </View>
    )
}

export default Alarm;
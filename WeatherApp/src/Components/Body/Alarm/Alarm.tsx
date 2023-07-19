import React, { useEffect, useState, useRef } from "react";
import { View, Platform, Button, Alert, Text } from "react-native";
import { Audio } from "expo-av";
import * as Notification from "expo-notifications";
// import Sound from "react-native-sound";
// import Alarm from "react-native-alarm-manager";
// import { PrecipicationHourlyForecasting, DailyForecasting } from "../../../Service/request";

export function compare2Times(time1: Date, time2: Date): boolean {
    if (time1 && time2) {
        return (
            time1.getHours() === time2.getHours() &&
            time1.getMinutes() === time2.getMinutes()
        );
    }
    return false;
}

const Alarm: React.FC = () => {
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [time, setTime] = useState<Date | null>(null);
    const [precipication, setPrecipitation] = useState<String>('');
    // const alarmSound = useRef<Sound | HTMLAudioElement | null>(null);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    useEffect(() => {
        // fecthAPIDaily();
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
        // const jsonData = await PrecipicationHourlyForecasting(0, 0);

        if (true) {
            // Set alarm date
            const alarmTime = new Date();
            // alarmTime.setHours(alarmTime.getHours() + 1); // 1 hr in advance
            alarmTime.setMinutes(alarmTime.getMinutes() + 2);
            console.log(alarmTime);
            setTime(alarmTime);
            // alert(alarmTime);
            // setPrecipitation(jsonData["report"].toString());
            scheduleNotification(alarmTime);
        }
    };

    function checkAlarm() {
        if (time) {
            const currentTime: Date = new Date();
            if (compare2Times(currentTime, time)) {
                playSound("askjskajdska");
            }
        }
    };

    const scheduleNotification = (time: Date) => {
        const triggerTime = time.getTime() - (1 * 60 * 1000); // 15 mins before
        let date1 = new Date(triggerTime);
        console.log(date1);
        Notification.scheduleNotificationAsync({
            content: {
                title: 'Bad weather',
                body: "test",
            },
            trigger: {
                date: new Date(triggerTime),
            }
        }); 
    }

    async function fecthAPIDaily(): Promise<any> {
        // const jsonData = await DailyForecasting(0, 0);
        // if (jsonData["result"] === true) {
        //     playSound(jsonData["type"].toString());
        // }
    };

    const playSound = async (data: String) => {

        alert(data + " is expected");
        try {
            const { sound } = await Audio.Sound.createAsync(
                require('../../../../sound/alarm.mp3'),
                { shouldPlay: true }
            );
            Alert.alert(
                data + " is expected",
                "Press ok to stop the sound",
                [{ text: 'OK', onPress: stopSound }],
                { cancelable: false }
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
            <Text>{time?.toDateString()}</Text>
        </View>
    )
}

export default Alarm;
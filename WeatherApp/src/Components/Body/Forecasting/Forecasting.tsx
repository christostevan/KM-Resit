import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from 'react-native';
import { Table, Row, Rows } from "react-native-table-component";
import { ForecastFetch } from "../../../Service/request";
import Header from "../../Header/Header";

const Forecasting = () => {
    const [date, setDate] = useState<String[]>([]);
    const [maxTemp, setMaxTemp] = useState<Number[]>([]);
    const [minTemp, setMinTemp] = useState<Number[]>([]);
    const [windDir, setWindDir] = useState<Number[]>([]);
    const [windSpeed, setWindSpeed] = useState<Number[]>([]);

    useEffect(() => {
        fetchingAPI();
    }, []);

    async function fetchingAPI(): Promise<any> {
        const jsonData = await ForecastFetch();
        let dateData: String[] = [];
        let maxTemp: Number[] = [];
        let minTemp: Number[] = [];
        let windDir: Number[] = [];
        let windSpeed: Number[] = [];
        for (let i = 0; i < jsonData["daily"]["time"].length; i++) {
            dateData.push(jsonData["daily"]["time"][i]);
            maxTemp.push(jsonData["daily"]["temperature_2m_max"][i]);
            minTemp.push(jsonData["daily"]["temperature_2m_min"][i]);
            windDir.push(jsonData["daily"]["winddirection_10m_dominant"][i]);
            windSpeed.push(jsonData["daily"]["windspeed_10m_max"][i]);
        }
        setDate(dateData);
        setMaxTemp(maxTemp);
        setMinTemp(minTemp);
        setWindDir(windDir);
        setWindSpeed(windSpeed);
    }

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.table}>
                <View style={styles.column}>
                    <Text>Date</Text>
                    {date?.map((el, i) => <Text key={i}> {el} </Text>)}
                </View>
                <View style={styles.column}>
                    <Text>Max Temp</Text>
                    {maxTemp?.map((el, i) => <Text key={i}> {el.toString()} </Text>)}
                </View>
                <View style={styles.column}>
                    <Text>Min Temp</Text>
                    {minTemp?.map((el, i) => <Text key={i}> {el.toString()}</Text>)}
                </View>
                <View style={styles.column}>
                    <Text>Wind Speed</Text>
                    {windSpeed?.map((el, i) => <Text key={i}> {el.toString()} </Text>)}
                </View>
                <View>
                    <Text>Wind Direction</Text>
                    {windDir.map((el, i) => <Text key={i}> {el.toString()} </Text>)}
                </View>
            </View>
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%"
    },
    date: {
        display: "flex",
        flexDirection: "column"
    },
    header: {
        display: "flex",
        flexDirection: "row"
    },
    table: {
        display: "flex",
        flexDirection: "row"
    }, column: {
        marginRight: 20
    }
});

export default Forecasting;

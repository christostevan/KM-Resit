import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { Table, Row, Rows } from "react-native-table-component";
import { CityFetch } from "../../../Service/request";
import { ForecastFetch } from "../../../Service/request";
import Header from "../../Header/Header";

const Forecasting = () => {
    const [date, setDate] = useState<String[]>([]);
    const [maxTemp, setMaxTemp] = useState<Number[]>([]);
    const [minTemp, setMinTemp] = useState<Number[]>([]);
    const [windDir, setWindDir] = useState<Number[]>([]);
    const [windSpeed, setWindSpeed] = useState<Number[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [cityName, setCityName] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
        fetchingAPI();
    }, []);

    const handleSubmit = async(): Promise<any> => {
        if (inputValue != '' || inputValue != null) {
            const jsonData = await CityFetch(inputValue);
            setLatitude(jsonData["results"][0]["latitude"]);
            setLongitude(jsonData["results"][0]["longitude"]);
            setCityName(jsonData["results"][0]["name"]);
            setCountry(jsonData["results"][0]["country_code"]);
            fetchingAPI();
        }
    }

    async function fetchingAPI(): Promise<any> {
        if (cityName === '' || cityName === null) {
            setCityName("Emmen");
        }
        if (country === '' || country === null) {
            setCountry("NL");
        }
        const jsonData = await ForecastFetch(latitude, longitude);
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
            <Text>Current city: {cityName}, {country}</Text>
            <View style={styles.table}>
                <View style={styles.column}>
                    <Text>Date</Text>
                    {date?.map((el, i) => <Text key={i}> {el} </Text>)}
                </View>
                <View style={styles.column}>
                    <Text>Max Temp (°C)</Text>
                    {maxTemp?.map((el, i) => <Text key={i}> {el.toString()} </Text>)}
                </View>
                <View style={styles.column}>
                    <Text>Min Temp (°C)</Text>
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
            <Text>Set city: </Text>
            <View style={styles.form}>
                <TextInput
                    style={styles.inputStyle}
                    value={inputValue}
                    onChangeText={text => setInputValue(text)}
                    placeholder="Input your city here...."
                />
                <Button title="Submit" onPress={handleSubmit}/>
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
        flexDirection: "row",
        marginLeft: 10,
        marginBottom: 10,
    },
    column: {
        marginRight: 20
    },
    form: {
        width: "10%",
        marginLeft: 10,
    },
    inputStyle: {
        marginTop: 10,
        height: 40,
        width: "30vh",
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10
    }
});

export default Forecasting;

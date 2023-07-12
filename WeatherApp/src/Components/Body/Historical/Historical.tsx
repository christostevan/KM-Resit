import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import Header from "../../Header/Header";
import { HistoricalFetch } from "../../../Service/request";
import { CityFetch } from "../../../Service/request";

const Historical: React.FC = () => {
    const [historicalData, setHistoricalData] = useState<Map<string, { temperature: number, precipitation: number, days: number }>>(new Map());
    const [inputValue, setInputValue] = useState('');
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [cityName, setCityName] = useState<String>('');
    const [country, setCountry] = useState<String>('');

    useEffect(() => {
        fetchAPI();
    }, []);

    const handleSubmit = async (): Promise<any> => {
        if (inputValue != '' || inputValue != null || inputValue) {
            const jsonData = await CityFetch(inputValue);
            setLatitude(jsonData["results"][0]["latitude"]);
            setLongitude(jsonData["results"][0]["longitude"]);
            setCityName(jsonData["results"][0]["name"].toString());
            setCountry(jsonData["results"][0]["country_code"].toString());
            fetchAPI();
        }
    }

    async function fetchAPI(): Promise<any> {
        if (cityName === '' || cityName === null) {
            setCityName("Emmen");
        }
        if (country === '' || country === null) {
            setCountry("NL");
        }
        const jsonData = await HistoricalFetch(latitude, longitude);
        const averages = new Map<string, { temperature: number, precipitation: number, days: number }>();

        for (let i = 0; i < jsonData["daily"]["time"].length; i++) {
            const date = new Date(jsonData["daily"]["time"][i]);
            const month = `${date.toLocaleString('default', { month: 'long' })}-${date.getFullYear()}`;

            if (!averages.has(month)) {
                averages.set(month, {
                    temperature: 0,
                    precipitation: 0,
                    days: 0
                })
            }

            const monthData = averages.get(month)!;
            monthData.temperature += jsonData["daily"]["temperature_2m_mean"][i];
            monthData.precipitation += jsonData["daily"]["precipitation_sum"][i];
            monthData.days++;
        }

        for (const [month, data] of averages) {
            data.temperature /= data.days;
            data.precipitation /= data.days;
        }
        setHistoricalData(averages);
    }

    return (
        <View>
            <Header />
            <Text>Current city: {cityName}, {country}</Text>
            <View style={styles.table}>
                <View style={styles.column}>
                    <Text style={styles.columnData}>Date</Text>
                    <Text style={styles.columnDataSpecial}>Average temp (°C)</Text>
                    <Text style={styles.columnData}>Average Precipitation (mm)</Text>
                </View>
                {Array.from(historicalData.entries()).map(([month, data]) => (
                    <View key={month} style={styles.row}>
                        <View style={styles.rowData}>
                            <Text>{month}</Text>
                        </View>
                        <View style={styles.rowData}>
                            <Text>{data.temperature.toFixed(2)}</Text>
                        </View>
                        <View style={styles.rowData}>
                            <Text>{data.precipitation.toFixed(2)}</Text>
                        </View>
                    </View>
                ))}
                <Text style={{marginTop: 10}}>Set city: </Text>
                <View style={styles.form}>
                    <TextInput
                        style={styles.inputStyle}
                        value={inputValue}
                        onChangeText={text => setInputValue(text)}
                        placeholder="Input your city here...."
                    />
                    <Button title="Submit" onPress={handleSubmit} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    table: {
        display: "flex",
        flexDirection: "column",
        marginLeft: 10,
        marginBottom: 10,
    },
    column: {
        display: "flex",
        flexDirection: "row"
    },
    columnData: {
        marginRight: 90
    },
    columnDataSpecial: {
        marginRight: 40,
    },
    row: {
        display: "flex",
        flexDirection: "row"
    },
    rowData: {
        width: 140,
        display: "flex",
        flexDirection: "column"
    },
    form: {
        width: "10%",
        marginLeft: 10
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

export default Historical;
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Alert, Switch } from 'react-native';
import Header from "../../Header/Header";
import { HistoricalFetch } from "../../../Service/request";
import { CityFetch } from "../../../Service/request";
import { getTemperatureUnitLabel, convertToFahrenheit } from "../Forecasting/Forecasting";

export function mapping(jsonData: any, isCelcius: boolean) {
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
        if (!isCelcius) {
            jsonData["daily"]["temperature_2m_mean"][i] = convertToFahrenheit(jsonData["daily"]["temperature_2m_mean"][i]);
        }
        monthData.temperature += jsonData["daily"]["temperature_2m_mean"][i];
        monthData.precipitation += jsonData["daily"]["precipitation_sum"][i];
        monthData.days++;
    }

    for (const [month, data] of averages) {
        data.temperature /= data.days;
        data.precipitation /= data.days;
    }
    return averages;
}

const Historical: React.FC = () => {
    const [historicalData, setHistoricalData] = useState<Map<string, { temperature: number, precipitation: number, days: number }>>(new Map());
    const [cityName, setCityName] = useState<string>('Emmen');
    const [country, setCountry] = useState<String>('NL');
    const [isCelcius, setIsCelcius] = useState<boolean>(true);

    const [parentWidth, setParentWidth] = useState(null);
    const handleLayout = (event: any) => {
        const { width } = event.nativeEvent.layout;
        setParentWidth(width);
    };

    useEffect(() => {
        fetchAPI();
    }, []);

    const handleSubmit = async (): Promise<any> => {
        if (cityName != '' || cityName != null || cityName) {
            const jsonData = await CityFetch(cityName);
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
        const jsonData = await HistoricalFetch(cityName);
        const averages = mapping(jsonData, isCelcius);
        setHistoricalData(averages);
    }

    const changeUnit = () => {
        setIsCelcius((prev) => !prev);
    };

    return (
        <View testID="parent-view" onLayout={handleLayout}>
            <Header />
            <Text testID="cityName-test">Current city: {cityName}, {country}</Text>
            <View style={styles.table}>
                <View style={styles.column}>
                    <Text style={styles.columnData}>Date</Text>
                    <Text style={styles.columnDataSpecial} testID="averageTemp-test">Average temp <Text testID="unitTempLabel-test">{getTemperatureUnitLabel(isCelcius)}</Text></Text>
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
                <Text style={{ marginTop: 10 }}>Set city: </Text>
                <View style={styles.form}>
                    <TextInput
                        style={styles.inputStyle}
                        value={cityName}
                        onChangeText={text => setCityName(text)}
                        placeholder="Input your city here...."
                    />
                    <Button title="Submit" onPress={handleSubmit} testID="SubmitButtonCity-test"/>
                </View>
            </View>
            <View style={styles.form}>
                <Text>Set units in Celcius</Text>
                <Switch value={isCelcius} onValueChange={changeUnit} testID="switch-test"/>
                <Button title="Apply" onPress={fetchAPI} testID="SubmitButtonUnit-test" />
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
        width: 50,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10
    }
});

export default Historical;
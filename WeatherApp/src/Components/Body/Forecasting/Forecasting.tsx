import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { Table, Row, Rows } from "react-native-table-component";
import { CityFetch } from "../../../Service/request";
import { ForecastFetch } from "../../../Service/request";
import Header from "../../Header/Header";


export function determineWindDirection(windDirection: number): String {
    if (between(windDirection, 0, 22.4)) {
        return "North wind (N)";
    } else if (between(windDirection, 22.5, 44)) {
        return "North-northeast wind (NNE)"
    } else if (between(windDirection, 45, 67.4)) {
        return "Northeast wind (NE)"
    } else if (between(windDirection, 67.5, 89)) {
        return "East-northeast wind (ENE)"
    } else if (between(windDirection, 90, 112.4)) {
        return "East wind (E)"
    } else if (between(windDirection, 112.5, 134)) {
        return "East-southeast wind (ESE)"
    } else if (between(windDirection, 135, 157.4)) {
        return "South-east wind (SE)"
    } else if (between(windDirection, 157.5, 179)) {
        return "South-southeast wind (SSE)"
    } else if (between(windDirection, 180, 202.4)) {
        return "South wind (S)"
    } else if (between(windDirection, 202.5, 224)) {
        return "South-southwest wind (SSW)"
    } else if (between(windDirection, 225, 247.4)) {
        return "South-west wind (SW)"
    } else if (between(windDirection, 247.5, 269)) {
        return "West-southwest wind (WSW)"
    } else if (between(windDirection, 270, 292.4)) {
        return "West wind (W)"
    } else if (between(windDirection, 292.5, 314)) {
        return "West-northwest wind (WNW)"
    } else if (between(windDirection, 315, 337.4)) {
        return "North-west wind (NW)"
    } else if (between(windDirection, 337.5, 359)) {
        return "North-northwest wind (NNW)"
    }
    return "North wind (N)"
};

// Determine is a number is between specific range
export function between(x: number, min: number, max: number): boolean {
    return x >= min && x <= max;
};

export const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const Forecasting: React.FC = () => {
    const [date, setDate] = useState<String[]>([]);
    const [maxTemp, setMaxTemp] = useState<Number[]>([]);
    const [minTemp, setMinTemp] = useState<Number[]>([]);
    const [windDir, setWindDir] = useState<String[]>([]);
    const [windSpeed, setWindSpeed] = useState<Number[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [cityName, setCityName] = useState<String>('');
    const [country, setCountry] = useState<String>('');

    const [parentWidth, setParentWidth] = useState(null);
    const handleLayout = (event: any) => {
      const { width } = event.nativeEvent.layout;
      setParentWidth(width);
    };

    useEffect(() => {
        fetchingAPI();
    }, []);

    const handleSubmit = async (): Promise<any> => {
        if (inputValue != '' || inputValue != null || inputValue) {
            const jsonData = await CityFetch(inputValue);
            setLatitude(jsonData["results"][0]["latitude"]);
            setLongitude(jsonData["results"][0]["longitude"]);
            setCityName(jsonData["results"][0]["name"].toString());
            setCountry(jsonData["results"][0]["country_code"].toString());
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
        let windDir: String[] = [];
        let windSpeed: Number[] = [];
        for (let i = 0; i < jsonData["daily"]["time"].length; i++) {
            const date: Date = new Date(jsonData["daily"]["time"][i].toString());
            let dateString: String =
                weekday[date.getDay()] +
                ", " +
                date.getDate() +
                "-" +
                date.toLocaleString('default', { month: 'long' }) +
                "-" +
                date.getFullYear();
            dateData.push(dateString);
            maxTemp.push(jsonData["daily"]["temperature_2m_max"][i]);
            minTemp.push(jsonData["daily"]["temperature_2m_min"][i]);
            let wind_direction: String = determineWindDirection(jsonData["daily"]["winddirection_10m_dominant"][i]);
            windDir.push(wind_direction);
            windSpeed.push(jsonData["daily"]["windspeed_10m_max"][i]);
        }
        setDate(dateData);
        setMaxTemp(maxTemp);
        setMinTemp(minTemp);
        setWindDir(windDir);
        setWindSpeed(windSpeed);
    }

    return (
        <View style={styles.container} testID="parent-view" onLayout={handleLayout}>
            <Header />
            <Text style={{ marginBottom: 10 }} testID="current-city-test">Current city: {cityName}, {country}</Text>
            <View style={styles.table}>
                <View style={styles.column} >
                    <Text testID="Date-test">Date</Text>
                    {date?.map((el, i) => <Text key={i} testID="date-element-test"> {el}</Text>)}
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
                    <Text>Wind Speed (Km/h)</Text>
                    {windSpeed?.map((el, i) => <Text key={i}> {el.toString()} </Text>)}
                </View>
                <View>
                    <Text>Wind Direction</Text>
                    {windDir?.map((el, i) => <Text key={i}> {el.toString()} </Text>)}
                </View>
            </View>
            <Text>Set city: </Text>
            <View style={styles.form}>
                <TextInput
                    style={styles.inputStyle}
                    value={inputValue}
                    onChangeText={text => setInputValue(text)}
                    placeholder="Input your city here...."
                    testID="TextInput-test"
                />
                <Button title="Submit" onPress={handleSubmit} testID="SubmitButton-test"/>
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

export default Forecasting;

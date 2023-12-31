import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Alert, Switch } from 'react-native';
import { Table, Row, Rows } from "react-native-table-component";
import { CityFetch } from "../../../Service/request";
import { ForecastFetch } from "../../../Service/request";
import Header from "../../Header/Header";
import Alarm from "../Alarm/Alarm";

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

export function mapping(jsonData: any, isCelcius: boolean): any {
    let ans = [];
    let dateData: String[] = [];
    let maxTemp: Number[] = [];
    let minTemp: Number[] = [];
    let windDir: String[] = [];
    let windSpeed: Number[] = [];
    for (let i = 1; i < jsonData["time"].length; i++) {
        const date: Date = new Date(jsonData["time"][i].toString());
        let dateString: String =
            weekday[date.getDay()] +
            ", " +
            date.getDate() +
            "-" +
            date.toLocaleString('default', { month: 'long' }) +
            "-" +
            date.getFullYear();
        dateData.push(dateString);
        if (!isCelcius) {
            jsonData["temperature_2m_max"][i] = convertToFahrenheit(jsonData["temperature_2m_max"][i]).toFixed(1);
            jsonData["temperature_2m_min"][i] = convertToFahrenheit(jsonData["temperature_2m_min"][i]).toFixed(1);
            jsonData["windspeed_10m_max"][i] = convertToMilesPerHour(jsonData["windspeed_10m_max"][i]).toFixed(1);
        }
        maxTemp.push(jsonData["temperature_2m_max"][i]);
        minTemp.push(jsonData["temperature_2m_min"][i]);
        let wind_direction: String = determineWindDirection(jsonData["winddirection_10m_dominant"][i]);
        windDir.push(wind_direction);
        windSpeed.push(jsonData["windspeed_10m_max"][i]);
    }
    ans.push(dateData);
    ans.push(maxTemp);
    ans.push(minTemp);
    ans.push(windDir);
    ans.push(windSpeed);
    return ans;
}

export const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const getTemperatureUnitLabel = (unit: boolean) => {
    return unit ? '(°C)' : '(°F)';
};

export const getWindSpeedUnitLabel = (unit: boolean) => {
    return unit ? '(Km/h)' : '(Mph)';
};

export const convertToFahrenheit = (temp: number): number => {
    return (temp * 9) / 5 + 32;
};

export const convertToMilesPerHour = (speed: number): number => {
    return speed / 1.60934;
};

const Forecasting: React.FC = () => {
    const [date, setDate] = useState<String[]>([]);
    const [maxTemp, setMaxTemp] = useState<Number[]>([]);
    const [minTemp, setMinTemp] = useState<Number[]>([]);
    const [windDir, setWindDir] = useState<String[]>([]);
    const [windSpeed, setWindSpeed] = useState<Number[]>([]);
    const [cityName, setCityName] = useState<string>('Emmen');
    const [country, setCountry] = useState<String>('NL');
    const [days, setDays] = useState<number>(10);
    const [isCelcius, setIsCelcius] = useState<boolean>(true);

    const [parentWidth, setParentWidth] = useState(null);
    const handleLayout = (event: any) => {
        const { width } = event.nativeEvent.layout;
        setParentWidth(width);
    };

    useEffect(() => {
        fetchingAPI();
    }, []);

    const handleSubmit = async (): Promise<any> => {
        if (cityName != '' || cityName != null || cityName) {
            const jsonData = await CityFetch(cityName);
            setCountry(jsonData["results"][0]["country_code"].toString());
            fetchingAPI();
        }
    }

    const handleSubmitDay = (text: string): void => {
        if (text === '' || text === null) {
            setDays(0);
        }
        else {
            let number: number = parseInt(text);
            if (number > 0) {
                setDays(number);
            }
        }
    }

    async function fetchingAPI(): Promise<any> {
        const jsonData = await ForecastFetch(cityName, (days + 1));
        const answer = mapping(jsonData, isCelcius);
        setDate(answer[0]); // date
        setMaxTemp(answer[1]); // max temp
        setMinTemp(answer[2]); // min temp
        setWindDir(answer[3]); // wind speed
        setWindSpeed(answer[4]); // wind dir
    }

    const changeUnit = () => {
        setIsCelcius((prev) => !prev);
    };

    return (
        <View style={styles.container} testID="parent-view" onLayout={handleLayout}>
            <Header />
            <Alarm cityName={cityName}/>
            <Text style={{ marginBottom: 10 }} testID="current-city-test">Current city: {cityName}, {country}</Text>
            <Text style={{ marginBottom: 10 }} testID="current-city-test">Number of forecasting day: {days.toString()}</Text>
            <View style={styles.table}>
                <View style={styles.column} >
                    <Text testID="Date-test">Date</Text>
                    {date?.map((el, i) => <Text key={i} testID="date-element-test"> {el}</Text>)}
                </View>
                <View style={styles.column}>
                    <Text>Max Temp {getTemperatureUnitLabel(isCelcius)}</Text>
                    {maxTemp?.map((el, i) => <Text key={i}> {el.toString()} </Text>)}
                </View>
                <View style={styles.column}>
                    <Text>Min Temp {getTemperatureUnitLabel(isCelcius)}</Text>
                    {minTemp?.map((el, i) => <Text key={i}> {el.toString()}</Text>)}
                </View>
                <View style={styles.column}>
                    <Text>Wind Speed {getWindSpeedUnitLabel(isCelcius)}</Text>
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
                    value={cityName}
                    onChangeText={text => setCityName(text)}
                    placeholder="Input your city here...."
                    testID="TextInput-test"
                />
                <Button title="Submit" onPress={handleSubmit} testID="SubmitButton-test" />
            </View>
            <Text>Set how many days: </Text>
            <View style={styles.form}>
                <TextInput
                    style={styles.inputStyle}
                    value={days.toString()}
                    onChangeText={text => handleSubmitDay(text)}
                    placeholder="Input your days here here...."
                    testID="TextInputDay-test"
                />
                <Button title="Submit" onPress={fetchingAPI} testID="SubmitButtonDay-test" />
            </View>
            <View style={styles.form}>
                <Text>Set units in Celcius and Km</Text>
                <Switch value={isCelcius} onValueChange={changeUnit} />
                <Button title="Apply" onPress={fetchingAPI} testID="SubmitButtonUnit-test" />
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
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10
    }
});

export default Forecasting;

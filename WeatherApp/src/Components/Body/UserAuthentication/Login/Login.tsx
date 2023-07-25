import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { LoginFetch } from "../../../../Service/request";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../../App";


type ForecastingcreenProp = StackNavigationProp<RootStackParamList, "Forecasting">;

const Login: React.FC = () => {
    const navigation = useNavigation<ForecastingcreenProp>();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const fetchDatabase = async (): Promise<any> => {
        const jsonData = await LoginFetch(username, password);
        if (jsonData["message"] === true) {
            navigation.navigate("Forecasting");
        } else {

        }
    }

    return (
        <View style={styles.container}>
            <Text>Login here</Text>
            <View>
                <TextInput
                    style={styles.inputStyle}
                    value={username.toString()}
                    onChangeText={text => setUsername(text)}
                    placeholder="Input your username here here...."
                    testID="TextInputDay-test"
                />
                <TextInput
                    style={styles.inputStyle}
                    value={password.toString()}
                    onChangeText={text => setPassword(text)}
                    placeholder="Input your password here here...."
                    testID="TextInputDay-test"
                />
                <Button title="Submit" onPress={fetchDatabase} testID="SubmitButtonDay-test" />
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        width: "100%"
    },
    inputStyle: {
        marginTop: 10,
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 10
    }
});

export default Login;
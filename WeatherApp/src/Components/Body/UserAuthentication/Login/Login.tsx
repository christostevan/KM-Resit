import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { LoginFetch } from "../../../../Service/request";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../../App";
import { RouteProp, useRoute } from "@react-navigation/native";

type ScreenProp = StackNavigationProp<RootStackParamList, "Forecasting", "Register">;

const Login: React.FC = () => {
    const navigation = useNavigation<ScreenProp>();
    // const route = useRoute<LoginRouteProp>();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // const [parentWidth, setParentWidth] = useState(null);
    // const handleLayout = (event: any) => {
    //     const { width } = event.nativeEvent.layout;
    //     setParentWidth(width);
    // };

    const fetchDatabase = async (): Promise<any> => {
        const jsonData = await LoginFetch(username, password);
        if (jsonData.length > 0) {
            navigation.navigate("Forecasting");
        } else {
            Alert.alert(
                'Warning',
                'Wrong username and/or password',
            );
        }
    }

    const navLogin = () => {
        navigation.navigate("Register");
    }

    return (
        <View style={styles.container} testID="parent-view">
            <Text testID="login-header">Login here</Text>
            <View style={styles.form}>
                <TextInput
                    style={styles.inputStyle}
                    value={username.toString()}
                    onChangeText={text => setUsername(text)}
                    placeholder="Input your username here here...."
                    testID="TextInput-Login"
                />
                <TextInput
                    style={styles.inputStyle}
                    value={password.toString()}
                    onChangeText={text => setPassword(text)}
                    placeholder="Input your password here here...."
                    testID="TextInputPassword-test"
                    secureTextEntry={true}
                />
                <View style={styles.button}>
                    <Button title="Submit" onPress={fetchDatabase} testID="SubmitButtonLogin-test" />
                </View>
            </View>
            <View style={styles.button}>
                <Button title="Go to Register" onPress={navLogin} testID="goToRegister-test" />
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
    },
    form: {
        marginBottom: 10,
        margin: "auto",
        width: "80%"
    },
    
    button: {
        width: "40%",
        margin: "auto"
    },
});

export default Login;
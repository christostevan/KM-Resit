import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { RegisterFetch } from "../../../../Service/request";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../../../../App";

type ScreenProp = StackNavigationProp<RootStackParamList, "Login">;

const Register: React.FC = () => {
    const navigation = useNavigation<ScreenProp>();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');


    const fetchDatabase = async (): Promise<any> => {
        var jsonData: any = await RegisterFetch(username, password);

        if(jsonData.message === true) {
            Alert.alert(
                'Alert',
                'Register sucessful',
            );
        } else {
            Alert.alert(
                'Alert',
                'Error occured: ' + jsonData["message"],
            );
        }
    }

    const navRegister = () => {
        navigation.navigate("Login");
    }

    return (
        <View testID="parent-view">
            <Text>Register here</Text>
            <View style={styles.form}>
                <TextInput
                    style={styles.inputStyle}
                    value={username.toString()}
                    onChangeText={text => setUsername(text)}
                    placeholder="Input your username here here...."
                    testID="TextInputUsername-test"
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
                    <Button title="Submit" onPress={fetchDatabase} testID="SubmitButtonRegister-test" />
                </View>
            </View>
            <View style={styles.button}>
                <Button title="Go to Login" onPress={navRegister} testID="goToLogin-test" />
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

export default Register;
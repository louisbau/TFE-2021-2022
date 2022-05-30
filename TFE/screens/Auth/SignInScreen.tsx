import React, { useState, useContext } from "react";
import { ImageBackground, View, Text, StyleSheet, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/core';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { SocketContext } from "../../components/context/socket";
import {API_URL} from 'react-native-dotenv'
const API = API_URL
async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
}

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const socket = useContext(SocketContext);
    const onForgotPassword = () => {
        navigation.navigate('ForgotPassword');
    }
    const onSignUp = () => {
        navigation.navigate('SignUp');
    }
    console.log(API)
    const onLogin = () => {
        const payload = {
            email,
            password,
        };
        fetch(`${API}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'credentials': 'include'
            },
            body: JSON.stringify(payload),
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                    
                    setIsError(true);
                    setMessage(jsonRes.message);
                } else {
                    
                    setIsError(false);
                    setMessage(jsonRes.message);
                    save('token', jsonRes.token)
                    socket.emit("Join", { userId: jsonRes.UserId })
                    navigation.navigate('Home', { UserId: jsonRes.UserId });
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    }

    return (
        <View>
            <Text style={styles.heading}>Login</Text>
            <CustomInput placeholder='email' value={email} setValue={setEmail} secureTextEntry={false}/>
            <CustomInput placeholder='password' value={password} setValue={setPassword} secureTextEntry/>
            <CustomButton text={'Login'} onPress={onLogin}/>
            <CustomButton text={'Forgot password'} onPress={onForgotPassword}/>
            <CustomButton text={'Sign up'} onPress={onSignUp}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        backgroundColor: 'black',
        width: '100%',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
        marginVertical: 5,
    },
    text: {
        fontWeight: 'bold',
        color: 'white'
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        marginLeft: '10%',
        marginTop: '5%',
        marginBottom: '30%',
        color: 'black',
    },
});
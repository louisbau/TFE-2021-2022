import React, { useState, useContext, useEffect } from "react";
import { ImageBackground, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/core';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { SocketContext } from "../../components/context/socket";
import {API_URL} from 'react-native-dotenv'

const API = "https://checkpcs.com/api"
async function save(key, value) {
    await SecureStore.setItemAsync(key, value);
}

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const socket = useContext(SocketContext);
    

    const fetchAuthentification = async () => {
        fetch(`${API}/authentification`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
                'credentials': 'include'
            }
        })
        .then(async (res) => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                    
                } else {
                    console.log(jsonRes.UserId)
                    socket.emit("Join", { userId: jsonRes.UserId })
                    navigation.navigate('Home')
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };
    useEffect(() => {
        const loggedIn = async () => { 
            const t = await SecureStore.getItemAsync('token')
            if (t !== null) {
                await fetchAuthentification()
                
            }
        }
        loggedIn()
  
    }, [])
    const onForgotPassword = () => {
        navigation.navigate('ForgotPassword');
    }
    const onSignUp = () => {
        navigation.navigate('SignUp');
    }
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
        <View style={styles.container}>
            <Text style={styles.heading}>Welcome To</Text>
            <Image source={require('../../assets/images/opentalk_logo.jpg')} style={styles.image} />
            <CustomInput placeholder='Email' value={email} setValue={setEmail} secureTextEntry={false}/>
            <CustomInput placeholder='Password' value={password} setValue={setPassword} secureTextEntry/>
            <View style={styles.forgotPassword}>
                <TouchableOpacity onPress={onForgotPassword}>
                    <Text style={styles.forgot}>Forgot your password?</Text>
                </TouchableOpacity>
            </View>
            <CustomButton text={'LOGIN'} onPress={onLogin}/>
            <View style={styles.row}>
                <Text>Don’t have an account? </Text>
                <TouchableOpacity onPress={onSignUp}>
                    <Text style={styles.link}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        width: '100%',
        height: '100%',
        padding: 15,
        alignItems: 'center',
        marginTop: 50,
    },
    text: {
        fontWeight: 'bold',
        color: 'white'
    },
    heading: {
        fontSize: 40,
        fontWeight: 'bold',
        padding: 15,
        color: 'black',
        textAlign: 'center',
    },
    image: {
        width: 200,
        height: 100,
        marginBottom: 8,
    },
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    forgot: {
        fontSize: 13,
        // color: theme.colors.secondary,
    },
    link: {
        fontWeight: 'bold',
        // color: theme.colors.primary,
    },
});
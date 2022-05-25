import React, { useState } from "react";
import { ImageBackground, View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { API_URL } from "@env"

import { useRoute, useNavigation } from '@react-navigation/core';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
const API = API_URL
export default function SignUp() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const onLogin = () => {
        navigation.navigate('SignIn');
    }
    const onSignUp = () => {
        const payload = {
            email,
            name,
            password,
        };
        fetch(`${API}/register`, {
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
                    navigation.navigate('SignIn');
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
            <Text style={styles.heading}>Register</Text>
            <CustomInput placeholder='email' value={email} setValue={setEmail} secureTextEntry={false}/>
            <CustomInput placeholder='name' value={name} setValue={setName} secureTextEntry={false}/>
            <CustomInput placeholder='password' value={password} setValue={setPassword} secureTextEntry/>
            <CustomButton text={'Register'} onPress={onSignUp}/>
            <CustomButton text={'Login'} onPress={onLogin}/>
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
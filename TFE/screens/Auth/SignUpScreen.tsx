import React, { useState } from "react";
import {  View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { API_URL } from 'react-native-dotenv'

import { useRoute, useNavigation } from '@react-navigation/core';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
const API = "https://checkpcs.com/api"

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigation = useNavigation();

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const onLogin = () => {
        navigation.navigate('SignIn');
    }
    const onSignUp = () => {
        if (password !== newPassword && password.length <= 9) {
            return Alert.alert('not same password ')
        }
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
        <View style={styles.container}>
            <Image source={require('../../assets/images/opentalk_logo.jpg')} style={styles.image} />
            <Text style={styles.heading}>Create Account</Text>
            <CustomInput placeholder='Name' value={name} setValue={setName} secureTextEntry={false}/>
            <CustomInput placeholder='Email' value={email} setValue={setEmail} secureTextEntry={false}/>
            <CustomInput placeholder='Password' value={password} setValue={setPassword} secureTextEntry/>
            <CustomInput placeholder='Password again' value={newPassword} setValue={setNewPassword} secureTextEntry/>
            <CustomButton text={'SIGN UP'} onPress={onSignUp}/>
            <View style={styles.row}>
                <Text>Already have an account? </Text>
                <TouchableOpacity onPress={onLogin}>
                    <Text style={styles.link}>Login</Text>
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
    row: {
        flexDirection: 'row',
        marginTop: 7,
    },
    link: {
        fontWeight: 'bold',
        //color: theme.colors.primary,
    },
});
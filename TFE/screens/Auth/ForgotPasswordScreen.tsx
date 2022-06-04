import React, { useState } from "react";
import { ImageBackground, View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { API_URL } from 'react-native-dotenv'
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from '@react-navigation/core';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { PRIVATE_KEY } from "../../utils/crypto";
const API = "https://checkpcs.com/api"

/**
 * Component that is used to allow the user to request to change is password
 */

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const navigation = useNavigation();
    const [isError, setIsError] = useState(false);
    
    const onLogin = () => {
        navigation.navigate('SignIn');
    }

    const fetchForgot = async () => {
        fetch(`${API}/forgot/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'credentials': 'include'
            }
        })
        .then(async (res) => { 
            try {
                const jsonRes = await res.json();
                
                if (res.status !== 200) {
                    console.log('error fetch conv private')
                    setIsError(true)
                    setToken(jsonRes.message)
                    
                } else {
                    setToken(jsonRes.token)
                    navigation.navigate("ResetPassword", { token: jsonRes.token });
                }
            } catch (err) {
                console.log(err, 'quoi1');
                setIsError(true)
                
                
            };
        })
        .catch(err => {
            console.log(err, 'quoi');
            setIsError(true)
            
            
        });
    };
    
    const onForgotPassword = async () => {
        SecureStore.deleteItemAsync('token')
        AsyncStorage.removeItem(PRIVATE_KEY)
        await fetchForgot()
        if (isError) {
            Alert.alert(
                "wrong email, error error"
            );
        }
        
        
    }
    

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/opentalk_logo.jpg')} style={styles.image} />
            <Text style={styles.heading}>Forgot password</Text>
            <CustomInput placeholder='Email' value={email} setValue={setEmail} secureTextEntry={false}/>
            <CustomButton text={'SEND EMAIL'} onPress={onForgotPassword}/>
            <View style={styles.row}>
                <Text>Go back to </Text>
                <TouchableOpacity onPress={onLogin}>
                    <Text style={styles.link}>Sign in</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        width: '100%',
        height: '100%',
        padding: 20,
        alignItems: 'center',
        marginTop: 50,
    },
    text: {
        fontWeight: 'bold',
        color: 'white'
    },
    heading: {
        fontSize: 35,
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
        // color: theme.colors.primary,
    },
});
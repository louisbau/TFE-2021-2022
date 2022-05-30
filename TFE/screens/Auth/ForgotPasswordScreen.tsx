import React, { useState } from "react";
import { ImageBackground, View, Text, StyleSheet, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { API_URL } from 'react-native-dotenv'
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from '@react-navigation/core';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { PRIVATE_KEY } from "../../utils/crypto";
const API = API_URL


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
                    console.log("yes")
                    setToken(jsonRes.token)
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
        else {
            navigation.navigate("ResetPassword", { token: token});
        }
        
    }
    

    return (
        <View>
            <Text style={styles.heading}>Forgot password</Text>
            <CustomInput placeholder='email' value={email} setValue={setEmail} secureTextEntry={false}/>
            <CustomButton text={'Forgot'} onPress={onForgotPassword}/>
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
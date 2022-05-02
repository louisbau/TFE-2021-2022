import React, { useState } from "react";
import { ImageBackground, View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { API_URL } from "@env"

import { useRoute, useNavigation } from '@react-navigation/core';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigation = useNavigation();
    const onLogin = () => {
        navigation.navigate('SignIn');
    }
    const onForgotPassword = () => {
        navigation.navigate('ResetPassword');
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
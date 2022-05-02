import React, { useState } from "react";
import { ImageBackground, View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { API_URL } from "@env"

import { useRoute, useNavigation } from '@react-navigation/core';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const navigation = useNavigation();
    const onLogin = () => {
        navigation.navigate('SignIn');
    }
    const onResetPassword = () => {
        navigation.navigate('SignIn');
    }
    
    
    return (
        <View>
            <Text style={styles.heading}>Login</Text>
            <CustomInput placeholder='password' value={password} setValue={setPassword} secureTextEntry/>
            <CustomInput placeholder='again password' value={newpassword} setValue={setNewPassword} secureTextEntry/>
            <CustomButton text={'Reset password'} onPress={onResetPassword}/>
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
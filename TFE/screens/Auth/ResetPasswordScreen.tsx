import React, { useState } from "react";
import { ImageBackground, View, Text, StyleSheet, Alert, Image} from 'react-native';
import { API_URL } from 'react-native-dotenv'
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from '@react-navigation/core';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
const API = API_URL
import { PRIVATE_KEY } from "../../utils/crypto";

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [isError, setIsError] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const onLogin = () => {
        navigation.navigate('SignIn');
    }

    const onResetPassword = async() => {
        SecureStore.deleteItemAsync('token')
        AsyncStorage.removeItem(PRIVATE_KEY)
        if (newpassword === password && password.length > 9) {
            await fetchReset()
            if (isError) {
                Alert.alert(
                    "wrong email, error error"
                );
            }
            else {
                navigation.navigate('SignIn');
            }
        }
        else {
            Alert.alert(
                "not same paswword or not too long"
            );
        }
       
    }
    const fetchReset = async () => {
        fetch(`${API}/newPassword`, {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${route.params?.token}`,
                'credentials': 'include'
            },
            body: JSON.stringify({ password: newpassword })
        })
        .then(async (res) => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                    console.log('error fetch conv private')
                    setIsError(true)
                    return jsonRes
                    
                } else {
                    return jsonRes
                }
            } catch (err) {
                console.log(err);
                setIsError(true)
                return err
                
            };
        })
        .catch(err => {
            console.log(err);
            setIsError(true)
            return err
            
        });
    };
    
    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/opentalk_logo.jpg')} style={styles.image} />
            <Text style={styles.heading}>Restore Password</Text>
            <CustomInput placeholder='password' value={password} setValue={setPassword} secureTextEntry/>
            <CustomInput placeholder='again password' value={newpassword} setValue={setNewPassword} secureTextEntry/>
            <CustomButton text={'Reset password'} onPress={onResetPassword}/>
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
import React, {useEffect, useState} from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { generateKeyPair } from "../utils/crypto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute, useNavigation } from '@react-navigation/core';
import { API_URL } from 'react-native-dotenv'
const API = API_URL
import * as SecureStore from 'expo-secure-store';
import { PRIVATE_KEY } from "../utils/crypto";




const Settings = () => {
  const navigation = useNavigation()
  const logOut = async () => {
    SecureStore.deleteItemAsync('token')
    AsyncStorage.removeItem(PRIVATE_KEY)
    navigation.navigate("SignIn")
  };
  const updateKeyPair = async () => {
    // generate private/public key
    const { publicKey, secretKey } = generateKeyPair();
    

    // save private key to Async storage
    await AsyncStorage.setItem(PRIVATE_KEY, secretKey.toString());
    console.log("secret key was saved");

    // save public key to UserModel in Datastore
    console.log(publicKey.toString())
    const fetchListUser = async () => {
        fetch(`${API}/addPublicKey`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
                'credentials': 'include'
            },
            body: JSON.stringify({ publicKey: publicKey.toString() })
        })
        .then(async (res) => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                    console.log("error")
                } else {
                    console.log(jsonRes)
                  
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };
    fetchListUser()

    

    Alert.alert("Successfully updated the keypair.");
  };

  return (
    <View>
      <Text>Setting</Text>

      <Pressable
        onPress={updateKeyPair}
        style={{
          backgroundColor: "white",
          height: 50,
          margin: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Update keypair</Text>
      </Pressable>
      <Pressable
        onPress={logOut}
        style={{
          backgroundColor: "white",
          height: 50,
          margin: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Logout</Text>
      </Pressable>

      
    </View>
  );
};

export default Settings;
import React, {useContext, useState, useRef}from 'react';
import { Text, Image, View, Pressable, Platform } from 'react-native';
import styles from './styles';
import { API_URL } from 'react-native-dotenv'
import * as SecureStore from 'expo-secure-store';
import CustomButton from '../CustomButton';
import CustomFeather from '../CustomFeather';
const API =  "https://checkpcs.com/api"

export default function UserListInvitationItem({ user }) {
  const onPressAccept = async (event) => {
    event.preventDefault()
    fetchAcceptFriend()
  }

  const onPressDecline = async (event) => {
    event.preventDefault()
    fetchDeclineFriend()
  }
  const fetchAcceptFriend = async () => {
    fetch(`${API}/FriendShips/acceptFriendship`, {
        method: 'Post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
            'credentials': 'include'
        },
        body: JSON.stringify({ id: user.id })
    })
    .then(async (res) => { 
        try {
            const jsonRes = await res.json();
            if (res.status !== 200) {
              console.log(jsonRes)
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

  const fetchDeclineFriend = async () => {
    fetch(`${API}/FriendShips/declineFriendship`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
            'credentials': 'include'
        },
        body: JSON.stringify({ id: user.id })
    })
    .then(async (res) => { 
        try {
            const jsonRes = await res.json();
            if (res.status !== 200) {
              console.log(jsonRes)
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
  

  return (
    
    <View style={styles.container}>
      <Image source={{ uri: user.imageUri}} style={styles.image} />
      <Text style={styles.text}>{user.name}</Text>
      <View style={styles.button}>
        <CustomFeather name="check" size={24} onPress={onPressAccept} color="black"/>
      </View>
      <View style={styles.button}>
        <CustomFeather name="trash-2" size={24} onPress={onPressDecline} color="black"/>
      </View>
    </View>
    
    
  );
}
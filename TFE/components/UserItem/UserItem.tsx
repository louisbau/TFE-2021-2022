import React, {useContext, useState}from 'react';
import { Text, Image, View, Pressable, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import styles from './styles';
import { API_URL } from "@env";
import * as SecureStore from 'expo-secure-store';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
const API =  API_URL

export default function UserItem({ user }) {
  const navigation = useNavigation();
  const context = useContext(AppContext)
  const onPress = async (event) => {
    event.preventDefault()
    try {
      console.log('ced')
      await axios.post(`${API}/ChatRoomUser/newChatRoom`,{user: user.id}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
          'credentials': 'include'
        }
      }).then((response) => { 
        const data = response.data
        
        const fetchData = async () => {
          fetch(`${API_URL}/ChatRoomUser/${data}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
                  'credentials': 'include'
              }
          })
          .then(async res => { 
              try {
                  const jsonRes = await res.json();
                  if (res.status !== 200) {
                    console.log('errrrr')
                    
                  } else {
                    context.readGlobale()
                    context.SelectChatRoom(data)
                    context.readMessage(data)
                    context.readAll(data)
                    const user = context.UserId && jsonRes.find((x) => x.id !== context.UserId)
                    console.log(data, user)
                    navigation.navigate("ChatRoom", { id: data, chat: user });
                    // console.log(jsonRes)
                  }
              } catch (err) {
                  console.log(err);
              };
          })
          .catch(err => {
              console.log(err);
          });
        };
        fetchData();
        
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{ uri: user.imageUri}} style={styles.image} />

      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{user.name}</Text>
        </View>
      </View>
    </Pressable>
  );
}
import React, {useContext, useState}from 'react';
import { Text, Image, View, Pressable, Platform } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/core';
import styles from './styles';
import { API_URL } from "@env";
import * as SecureStore from 'expo-secure-store';
import CustomButton from '../CustomButton';
const API =  API_URL
import Swipeable from 'react-native-gesture-handler/Swipeable';

export default function UserItem({ user, isMe }) {
  const navigation = useNavigation();
  const index = useNavigationState(state => state.type);
  const isEnabled = index === "stack"
  const onPress = async (event) => {
    event.preventDefault()
    fetchDeleteFriend()
  }
  const fetchDeleteFriend = async () => {
    fetch(`${API}/FriendShips/deleteFriendship`, {
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
  const rightSwipeActions = () => {
    return (
      <View
        style={{
          
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
      >
        <CustomButton text={'Delete'} onPress={onPress}/>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={rightSwipeActions}
      enabled={isEnabled}
    >
      <Image source={{ uri: user.imageUri}} style={styles.image} />
      <Text>{user.name}</Text>
    </Swipeable>
  );
}
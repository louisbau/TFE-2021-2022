import React, {useContext, useState, useRef}from 'react';
import { Text, Image, View, Pressable, Platform } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/core';
import styles from './styles';
import { API_URL } from "@env";
import * as SecureStore from 'expo-secure-store';
import CustomButton from '../CustomButton';
const API =  API_URL
import Swipeable from 'react-native-gesture-handler/Swipeable';

export default function UserListItem({ user }) {
  const navigation = useNavigation();
  const swipeableRef = useRef(null);
  const index = useNavigationState(state => state.type);
  const isEnabled = index === "stack"
  const onPress = async (event) => {
    event.preventDefault()
    swipeableRef.current.close();
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
        ref={swipeableRef}
        enabled={isEnabled}
      >
        <View style={styles.container}>
          <Image source={{ uri: user.imageUri}} style={styles.image} />
          <View style={styles.rightContainer}>
            <Text>{user.name}</Text>
          </View>
        </View>
        
        
        
      </Swipeable>
    
    
  );
}
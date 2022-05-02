import React, { useState, useContext, useEffect } from "react";
import {AppContext} from "../components/context/AppContext";
import { View, StyleSheet, FlatList, Platform } from 'react-native';
import ChatRoomItem from '../components/ChatRoomItem';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from "@env"
import { useRoute } from '@react-navigation/core';


export default function TabOneScreen() {
  const context = useContext(AppContext)
  const test = context.UserId

  
  /*
  useEffect(() => {
    const fetchChatRooms = async () => {
        fetch(`${API_URL}/ChatRoom/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
            }
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                    setChatRooms(jsonRes);
                    
                } else {
                    setChatRooms(jsonRes);
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };
    fetchChatRooms();
  }, [])
  */
  
  return (
    <View style={styles.page}>
      {test && (
        <FlatList 
          data={context.app}
          renderItem={({ item }) => <ChatRoomItem chatRoom={item[0]}/>}
          showsHorizontalScrollIndicator={false}
          // horizontal; allow horizental display (exemple stories)
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex:1,
  },
})

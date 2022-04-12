import React, { useState, useEffect } from "react";

import { Text, Image, View, StyleSheet, FlatList, Platform } from 'react-native';
import ChatRoomItem from '../components/ChatRoomItem';

import ChatRoomsData from '../assets/dummy-data/ChatRooms';
const API_URL = Platform.OS === 'ios' ? 'http://172.20.10.5:5000/api' : 'http://172.20.10.5:5000/api';


export default function TabOneScreen() {
  const [chatRooms, setChatRooms] = useState([]);

  const fetchChatRooms = async () => {
        fetch(`${API_URL}/ChatRoomUser/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                    setChatRooms(jsonRes.message);
                } else {
                    setChatRooms(jsonRes.message);
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

  useEffect(() => {
    const fetchChatRooms = async () => {
      const userData = await Auth.currentAuthenticatedUser();

      const chatRooms = (await DataStore.query(ChatRoomUser))
        .filter(chatRoomUser => chatRoomUser.user.id === userData.attributes.sub)
        .map(chatRoomUser => chatRoomUser.chatroom);

      setChatRooms(chatRooms);
    };
    fetchChatRooms();
  }, []);


  return (
    <View style={styles.page}>
      <FlatList 
        data={ChatRoomsData}
        renderItem={({ item }) => <ChatRoomItem chatRoom={item}/>}
        showsHorizontalScrollIndicator={false}
        // horizontal; allow horizental display (exemple stories)
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex:1,
  },
})

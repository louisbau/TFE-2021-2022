import React, { useState, useEffect, useContext } from "react";

import { Text, Image, View, Pressable, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { API_URL } from "@env";
import styles from "./styles";
import * as SecureStore from 'expo-secure-store';
import { AppContext } from "../context/AppContext";

export default function ChatRoomItem({ chatRoom }) {
    const [chatRoomUsers, setChatRoomUsers] = useState();
    const [Loading, setLoading] = useState(false);
    const id = chatRoom["id"];
    const newMessage = chatRoom["newMessages"];
    const name = chatRoom["name"];
    const imageUri = chatRoom["imageUri"];
    const context = useContext(AppContext)
    const index = chatRoom["ChatRoomUsers"][0]["UserId"] === context.UserId ? 1 : 0
    const User = chatRoomUsers && chatRoomUsers[index]
    const lastMessage = chatRoom["Messages"].find((x) => x.id === chatRoom["lastMessageId"])
    const isMe = chatRoomUsers && lastMessage.UserId === context.UserId
    useEffect(() => {
      const fetchData = async () => {
          fetch(`${API_URL}/ChatRoomUser/${id}`, {
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
                    setChatRoomUsers(jsonRes);
                    setLoading(true) 
                  } else {
                    setChatRoomUsers(jsonRes);
                    setLoading(true)
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
    }, [])
    
    const navigation = useNavigation();
    const onPress = (event) => {
      event.preventDefault()
      context.SelectChatRoom(id)
      context.readMessage(id)
      context.readAll(id)
      setLoading(true) 
      context.readGlobale()
      navigation.navigate("ChatRoom", { id: id, chat: chatRoomUsers });
    }
    return (
      <Pressable onPress={onPress} style={styles.container}>
        {Loading && <Image source={{ uri: imageUri ? imageUri : User.imageUri }} style={styles.image} />}
        <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{newMessage}</Text>
        </View>
        <View style={styles.rightContainer}>
            <View style={styles.row}>
              {Loading && <Text style={styles.name}>{name ? name : User.name}</Text>}
              {Loading && <Text style={styles.text}>{lastMessage.createdAt}</Text>}
            </View>
            {Loading && <Text numberOfLines={1} style={styles.text}>{ isMe ? 'me' : User.name } : {lastMessage.content}</Text>}
        </View>
      </Pressable>
    );
}


  
import React, { useState, useEffect, useContext } from "react";
import { Text, Image, View, Pressable, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { API_URL } from "@env";
import styles from "./styles";
import * as SecureStore from 'expo-secure-store';
import { AppContext } from "../context/AppContext";
const API = API_URL



export default function ChatRoomItem({ chatRoom, isMe }) {
    const context = useContext(AppContext)
    const otherUser = chatRoom.Users.find((x) => x.id !== isMe)
    const lastMessage = chatRoom.Users.find((x) => x.id !== chatRoom.lastMessageId)
    const lastMessageID = isMe === chatRoom.lastMessage.id
    const x = chatRoom.lastMessage.Messages[0]
    const content = x.content ? x.content : (x.image ? 'image': (x.audio && 'vocal'))
    /*
    const [chatRoomUsers, setChatRoomUsers] = useState();
    const [Loading, setLoading] = useState(false);
    const id = chatRoom["id"];
    const newMessage = chatRoom["newMessages"];
    const name = chatRoom["name"];
    const imageUri = chatRoom["imageUri"];
    
    const index = chatRoom["ChatRoomUsers"][0]["UserId"] === context.UserId ? 1 : 0
    const User = chatRoomUsers && chatRoomUsers[index]
    const lastMessage = chatRoom["Messages"].find((x) => x.id === chatRoom["lastMessageId"])
    const isMe = chatRoomUsers && lastMessage.UserId === context.UserId
    */
    /*
    useEffect(() => {
      const fetchData = async () => {
          fetch(`${API}/ChatRoomUser/${id}`, {
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
    */
    const navigation = useNavigation();
    const onPress = (event) => {
      event.preventDefault()
      context.SelectChatRoom(chatRoom.id)
      context.readMessage(chatRoom.id)
      context.readAll(chatRoom.id) 
      context.readGlobale()
      navigation.navigate("ChatRoom", { id: chatRoom.id, chat: chatRoom });
    }
    return (
      <Pressable onPress={onPress} style={styles.container}>
        <Image source={{ uri: chatRoom.imageUri ? chatRoom.imageUri : otherUser.imageUri }} style={styles.image} />
        <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{chatRoom.newMessage}</Text>
        </View>
        <View style={styles.rightContainer}>
            <View style={styles.row}>
              <Text style={styles.name}>{chatRoom.name ? chatRoom.name : otherUser.name}</Text>
              <Text style={styles.text}>{lastMessage.createdAt}</Text>
            </View>
            <Text numberOfLines={1} style={styles.text}>{ lastMessageID ? 'ME' : lastMessage.name } : {content && content}</Text>
        </View>
      </Pressable>
    );
}


  
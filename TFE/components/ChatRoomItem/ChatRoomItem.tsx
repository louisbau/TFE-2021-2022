import React, { useState, useEffect, useContext, useRef } from "react";
import { Text, Image, View, Pressable, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { API_URL } from "@env";
import styles from "./styles";
import * as SecureStore from 'expo-secure-store';
import { AppContext } from "../context/AppContext";
const API = API_URL
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { SocketContext } from "../context/socket";

const LeftSwipeActions = () => {
  return (
    <View
      style={{ flex: 1, backgroundColor: '#ccffbd', justifyContent: 'center' }}
    >
      <Text
        style={{
          color: '#40394a',
          paddingHorizontal: 10,
          fontWeight: '600',
          paddingVertical: 20,
        }}
      >
        Crypted Message
      </Text>
    </View>
  );
};



export default function ChatRoomItem({ chatRoom, isMe }) {
    const swipeableRef = useRef(null);
    const socket = useContext(SocketContext);
    const otherChatUser = chatRoom.Users.find((x) => x.UserId !== isMe)
    const isMeChatUser = chatRoom.Users.find((x) => x.UserId === isMe)
    const isMeUserChatId =isMeChatUser.ChatRoomUsers[0].UserChatRoomId
    const otherUserChatId = otherChatUser.ChatRoomUsers[0].UserChatRoomId
    const lastMessageChat = chatRoom.lastMessage && chatRoom.lastMessage
    const lastMessage = lastMessageChat && lastMessageChat.Messages
    const isLastMessageIsMe = lastMessage && isMeUserChatId === lastMessage.UserChatRoomId
    const content = lastMessage && (lastMessage.content ? lastMessage.content : (lastMessage.image ? 'image': (lastMessage.audio && 'vocal')))
    const swipeFromLeftOpen = () => {
      swipeableRef.current.close();
      navigation.navigate("ChatRoom", { id: chatRoom.SubChatRooms.id, chat: otherChatUser, IsCrypted: true });
    };

    const fetchDeleteChat = async () => {
      fetch(`${API}/ChatRoom/deleteChatRoom`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
              'credentials': 'include'
          },
          body: JSON.stringify({ id: chatRoom.SubChatRooms.id })
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
            backgroundColor: '#ff8303',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <Pressable onPress={onPress1}>
            <Text
              style={{
                color: '#1b1a17',
                paddingHorizontal: 10,
                fontWeight: '600',
                paddingVertical: 20,
              }}
            >
              Delete
            </Text>
          </Pressable>
          
        </View>
      );
    };
    
    const navigation = useNavigation();
    const onPress = (event) => {
      event.preventDefault()
      socket.emit("Room", {subchatRoomid : chatRoom.SubChatRooms.id})
      
      navigation.navigate("ChatRoom", { id: chatRoom.SubChatRooms.id, chat: otherChatUser, IsCrypted: false });
    }
    const onPress1 = (event) => {
      event.preventDefault()
      swipeableRef.current.close();
      fetchDeleteChat()

    }
    return (
      <Swipeable
        renderLeftActions={LeftSwipeActions}
        renderRightActions={rightSwipeActions}
        onSwipeableLeftOpen={swipeFromLeftOpen}
        ref={swipeableRef}
      >
        <Pressable onPress={onPress} style={styles.container}>
          <Image source={{ uri: otherChatUser.imageUri }} style={styles.image} />
          <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>0</Text>
          </View>
          <View style={styles.rightContainer}>
              <View style={styles.row}>
                <Text style={styles.name}>{otherChatUser.pseudo}</Text>
                <Text style={styles.text}>{lastMessage && lastMessage.createdAt}</Text>
              </View>
              {content && <Text numberOfLines={1} style={styles.text}>{ isLastMessageIsMe ? 'ME' : otherChatUser.pseudo } : {content && content}</Text>}
          </View>
        </Pressable>
      </Swipeable>
      
    );
}


  
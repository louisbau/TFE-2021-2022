import React, { useState, useEffect, useContext } from "react";
import { Text, Image, View, Pressable, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { API_URL } from "@env";
import styles from "./styles";
import * as SecureStore from 'expo-secure-store';
import { AppContext } from "../context/AppContext";
const API = API_URL



export default function ChatRoomItem({ chatRoom, isMe }) {
    const otherChatUser = chatRoom.Users.find((x) => x.UserId !== isMe)
    const isMeChatUser = chatRoom.Users.find((x) => x.UserId === isMe)
    const isMeUserChatId =isMeChatUser.ChatRoomUsers[0].UserChatRoomId
    const otherUserChatId = otherChatUser.ChatRoomUsers[0].UserChatRoomId
    const lastMessageChat = chatRoom.lastMessage && chatRoom.lastMessage
    const lastMessage = lastMessageChat && lastMessageChat.Messages
    const isLastMessageIsMe = lastMessage && isMeUserChatId === lastMessage.UserChatRoomId
    const content = lastMessage && (lastMessage.content ? lastMessage.content : (lastMessage.image ? 'image': (lastMessage.audio && 'vocal')))
    
    
    const navigation = useNavigation();
    const onPress = (event) => {
      event.preventDefault()
      navigation.navigate("ChatRoom", { id: chatRoom.SubChatRooms.id, chat: otherChatUser });
    }
    return (
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
    );
}


  
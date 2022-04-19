import React, { useState, useEffect } from "react";

import { Text, Image, View, Pressable, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/core';
const API_URL = Platform.OS === 'ios' ? 'http://192.168.1.44:5000/api' : 'http://192.168.1.44:5000/api';
import axios from 'axios';
import styles from "./styles";

export default function ChatRoomItem({ chatRoom }) {
    const [chatRoomUsers, setChatRoomUsers] = useState();
    const [Loading, setLoading] = useState(true);
    console.log(chatRoom.id)
    useEffect(() => {
        const getData = async () => {
          try {
            const response = await axios.get(
              `${API_URL}/ChatRoomUser/${chatRoom.id}`
            );
            setChatRoomUsers(response.data);
            console.log(chatRoomUsers[1].Messages.length)
          } catch (err) {
            console.log(err)
          } finally {
            setLoading(false);
          }
        };
        getData();
      }, []);

    const navigation = useNavigation();

    const onPress = () => {
        console.warn('pressed on ', chatRoom.id)
        navigation.navigate('ChatRoom', { id: chatRoom.id });
    }

    

    return (
        <Pressable onPress={onPress} style={styles.container}>
            { chatRoomUsers && <Image source={{ uri: chatRoomUsers[1].imageUri }} style={styles.image} />}
            { chatRoomUsers && <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>
                  {chatRoomUsers[1].Messages.length}
                </Text>
            </View>}

            <View style={styles.rightContainer}>
                <View style={styles.row}>
                    {chatRoomUsers && <Text style={styles.name}>{chatRoomUsers[1].name}</Text>}
                    {chatRoomUsers && <Text style={styles.text}>{chatRoomUsers[1].Messages[chatRoomUsers[1].Messages.length - 1].createdAt}</Text>}
                </View>
                {chatRoomUsers && <Text numberOfLines={1} style={styles.text}>{chatRoomUsers[1].Messages[chatRoomUsers[1].Messages.length - 1].content}</Text>}
            </View>
        </Pressable>
    );
}


  
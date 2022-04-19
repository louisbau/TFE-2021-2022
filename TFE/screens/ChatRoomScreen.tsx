import React, { useState, useEffect } from "react";

import { Text, View, StyleSheet, FlatList, SafeAreaView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/core';
import Message from "../components/Message";
import ChatsData from "../assets/dummy-data/Chats";
import MessageInput from "../components/MessageInput";

const API_URL = Platform.OS === 'ios' ? 'http://192.168.1.44:5000/api' : 'http://192.168.1.44:5000/api';

export default function ChatRoomScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const [chatRooms, setChatRooms] = useState();
    const [Loading, setLoading] = useState(true);
    console.warn("Displaying chat room: ", route.params?.id)
    useEffect(() => {
        const fetchChatRooms = async () => {
            fetch(`${API_URL}/Message/${route.params?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
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

    navigation.setOptions({title: 'Elon Musk'})
    return (
        <SafeAreaView style={styles.page}>
            <FlatList 
                data={chatRooms}
                renderItem={({item}) => <Message message={item} />}
            />
            <MessageInput />
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    page: {
        backgroundColor: 'white',
        flex: 1,
    },
});
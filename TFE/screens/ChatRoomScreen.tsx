import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, FlatList, SafeAreaView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/core';
import Message from "../components/Message";
import MessageInput from "../components/MessageInput";
import * as SecureStore from 'expo-secure-store';
import {AppContext} from "../components/context/AppContext";

import { API_URL } from "@env"

export default function ChatRoomScreen() {
    const navigation = useNavigation();
    const context = useContext(AppContext)
    
    
    /*
    useEffect(() => {
        const fetchChatRooms = async () => {
            fetch(`${API_URL}/Message/${route.params?.id}`, {
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
                        setMessage(jsonRes);
                    } else {
                        setMessage(jsonRes);
                        
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
        const fetchChatRoom = async () => {
            fetch(`${API_URL}/ChatRoom/${route.params?.id}`, {
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
                        setChatRoom(jsonRes);
                    } else {
                        setChatRoom(jsonRes);
                    }
                } catch (err) {
                    console.log(err);
                };
            })
            .catch(err => {
                console.log(err);
            });
        };
        fetchChatRoom();
    }, [])
    */

    return (
        <SafeAreaView style={styles.page}>
            {context.message &&
                <FlatList 
                    data={context.message}
                    renderItem={({item}) => <Message message={item} />}
                />
            }
            {context.chatRoomId && <MessageInput chatRoomId={context.chatRoomId}/>}
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    page: {
        backgroundColor: 'white',
        flex: 1,
    },
});
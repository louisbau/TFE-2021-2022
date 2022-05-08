import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, FlatList, SafeAreaView, Platform } from 'react-native';
import { useRoute, useNavigation,f } from '@react-navigation/core';
import Message from "../components/Message";
import MessageInput from "../components/MessageInput";
import * as SecureStore from 'expo-secure-store';
import {AppContext} from "../components/context/AppContext";
import { API_URL } from "@env";



export default function ChatRoomScreen() {
    const navigation = useNavigation();
    const context = useContext(AppContext)
    const route = useRoute();
    const [message, setMessage] = useState([])
    const [user, setUser] = useState([])
    const API = API_URL
    
    useEffect(() => {
        fetchMessage();
    }, [])

    useEffect(() => {
        fetchUser();
    }, [])

    const fetchMessage = async () => {
        fetch(`${API}/Message/${route.params?.id}`, {
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
    
    const fetchUser = async () => {
        fetch(`${API}/${route.params?.id}`, {
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
                    setUser(jsonRes);
                } else {
                    setUser(jsonRes);
                    
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };

    return (
        <SafeAreaView style={styles.page}>
            {context.message &&
                <FlatList 
                    data={message}
                    renderItem={({item}) => <Message message={item} user={user.find(x => x.id === item.UserId)} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            }
            {context.chatRoomId && <MessageInput chatRoomId={route.params?.id} setMessage={setMessage}/>}
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    page: {
        backgroundColor: 'white',
        flex: 1,
    },
});
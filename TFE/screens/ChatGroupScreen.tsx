import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, FlatList, SafeAreaView, Platform } from 'react-native';
import { useRoute, useNavigation,f } from '@react-navigation/core';
import Message from "../components/Message";
import MessageInput from "../components/MessageInput";
import * as SecureStore from 'expo-secure-store';
import { API_URL } from 'react-native-dotenv'
import { SocketContext } from "../components/context/socket";



export default function ChatGroupScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const [message, setMessage] = useState([])
    const [user, setUser] = useState()
    const [userId, setUserId] = useState();
    const [role, setRole] = useState();
    const [subId, setsubId] = useState()
    const [typing, setTyping] = useState(false)
    const [nameTyping, setNameTyping] = useState()
    const socket = useContext(SocketContext);
    const API = API_URL
    const [onReply, setOnReply] = useState();
    
    useEffect(() => {
        const loggedIn = async () => { 
            const t = await SecureStore.getItemAsync('token')
            if (t === null) {
                navigation.navigate('SignIn')
            }
        }
        loggedIn()

    }, [])
    
    useEffect(() => {
        fetchAuthentification()
    }, [])

    useEffect(() => {
        fetchMessage();
    }, [])

    useEffect(() => {
        fetchUser();
    }, [])

    useEffect(() => {
        socket.on('connectToRoom',function(data){
            setTyping(true) 
            fetchUserChatRoom(data[1])
            if (!data[2])  {
                setTyping(false)
                fetchMessage()
            }
        });
    }, [])

    const fetchUserChatRoom = async (id) => {
        fetch(`${API}/UserChatRoom/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
                'credentials': 'include'
            }
        })
        .then(async (res) => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                  console.log(jsonRes)
                } else {
                    console.log(jsonRes)
                    setNameTyping(jsonRes.pseudo)
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };

    const fetchAuthentification = async () => {
        fetch(`${API}/authentification`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
                'credentials': 'include'
            }
        })
        .then(async (res) => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                  setRole(jsonRes.role) 
                  setUserId(jsonRes.UserId)
                } else {
                  setRole(jsonRes.role) 
                  setUserId(jsonRes.UserId) 
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };

    const fetchMessage = async () => {
        fetch(`${API}/Message/${route.params?.id}`, {
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
                    setMessage(jsonRes);
                } else {
                    setMessage(jsonRes);
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
    
    const fetchUser = async () => {
        fetch(`${API}/${route.params?.id}`, {
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
                    setUser(jsonRes);
                    
                } else {
                    setUser(jsonRes);
                    setsubId(jsonRes)
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
            {message && user &&
                <FlatList 
                    data={message}
                    renderItem={({item}) => <Message message={item} user={user} isMeUserId={userId} setOnReply={setOnReply} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            }
            {message && user && 
                <MessageInput
                    subChatRoomId={route.params?.id} 
                    userChatRoomId={user && user.find(x => x.UserId === userId).ChatRoomUsers[0].UserChatRoomId} 
                    setMessage={setMessage} 
                    IsCrypted={false} 
                    onReply={onReply} 
                    setOnReply={setOnReply}
                    typing={typing} 
                    setTyping={setTyping} 
                    nameTyping={nameTyping}
                />
            }
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    page: {
        backgroundColor: 'white',
        flex: 1,
    },
});
import React, { useState, useContext, useEffect } from "react";
import {AppContext} from "../components/context/AppContext";
import { View, StyleSheet, FlatList, Platform, TextInput } from 'react-native';
import ChatRoomItem from '../components/ChatRoomItem';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from "@env";

export default function TabOneScreen() {
  const context = useContext(AppContext)
  const [conv, setConv] = useState([]);
  const [search, setSearch] = useState('');
  const test = context.app
  const API = API_URL
  
  
  
  useEffect(() => {
    const fetchChatRooms = async () => {
        fetch(`${API}/ChatRoom/test`, {
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
                    setConv(jsonRes);
                    
                } else {
                    console.log(jsonRes)
                    setConv(jsonRes);
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
  
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    console.log(text)

    if (text) {
      setSearch(text);
    } else {
      setSearch(text);
    }
  };
  
  
  return (
    <View style={styles.page}>
      {test && (
        <TextInput
            style={styles.textInputStyle}
            onChangeText={(text) => searchFilterFunction(text)}
            value={search}
            underlineColorAndroid="transparent"
            placeholder="Search Here"
        />
      )}
      {test && (
        <FlatList 
          data={conv}
          renderItem={({ item }) => <ChatRoomItem chatRoom={item}/>}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          // horizontal; allow horizental display (exemple stories)
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex:1,
  },
  itemStyle: {
    padding: 10,
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
  },
})

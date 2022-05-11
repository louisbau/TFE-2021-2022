import React, { useState, useContext, useEffect, useCallback } from "react";
import {AppContext} from "../components/context/AppContext";
import { View, StyleSheet, FlatList, Platform, TextInput } from 'react-native';
import ChatRoomItem from '../components/ChatRoomItem';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from "@env";
import { useFocusEffect } from '@react-navigation/native';


export default function TabOneScreen() {
  const context = useContext(AppContext)
  const [conv, setConv] = useState([]);
  const [search, setSearch] = useState('');
  const [masterDataSource, setMasterDataSource] = useState([]);
  const test = context.app
  const API = API_URL
  
  useFocusEffect(
    useCallback(() => {
      setSearch('')
      fetchChatRooms()

      return () => {
        setSearch('')
        fetchChatRooms()
      };
    }, [])
  );

  

  const fetchChatRooms = async () => {
    fetch(`${API}/ChatRoom/test`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
        }
    })
    .then(async (res) => { 
        try {
            const jsonRes = await res.json();
            if (res.status !== 200) {
                
                setConv(jsonRes);
                setMasterDataSource(jsonRes) 
            } else {
                setConv(jsonRes);
                setMasterDataSource(jsonRes)
            }
        } catch (err) {
            console.log(err);
        };
    })
    .catch(err => {
        console.log(err);
    });
  };
  
 

  
  
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank

    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      const newData = masterDataSource.filter(function (item) {
        // Applying filter for the inserted text in search bar
  
        for (let i in item.Users) {
          if (item.Users[i].id != context.UserId) {
            const index = item.Users[i].ChatRoomUsers.pseudo ? item.Users[i].ChatRoomUsers.pseudo : item.Users[i].name

            const itemData = (item.name ? item.name : index)
                ? (item.name ? item.name.toUpperCase() : index.toUpperCase())
                : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
          }  
        }
      });
      setConv(newData);
      setSearch(text);
    } else {
      setConv(masterDataSource);
      setSearch(text);
    }
  };
  
  
  return (
    <View style={styles.page}>
      {conv && context.UserId && test && (
        <TextInput
            style={styles.textInputStyle}
            onChangeText={(text) => searchFilterFunction(text)}
            value={search}
            underlineColorAndroid="transparent"
            placeholder="Search Here"
        />
      )}
      {conv && context.UserId && test && (
        <FlatList 
          data={conv}
          renderItem={({ item }) => <ChatRoomItem chatRoom={item} isMe={context.UserId}/>}
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

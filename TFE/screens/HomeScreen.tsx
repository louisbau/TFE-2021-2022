import React, { useState, useContext, useEffect, useCallback } from "react";
import {AppContext} from "../components/context/AppContext";
import { View, StyleSheet, FlatList, Platform, TextInput, SafeAreaView, StatusBar } from 'react-native';
import ChatRoomItem from '../components/ChatRoomItem';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from "@env";
import { useFocusEffect } from '@react-navigation/native';
import UserItem from "../components/UserItem";
import CustomInput from "../components/CustomInput";

export default function TabOneScreen() {
  const [conv, setConv] = useState([]);
  const [search, setSearch] = useState('');
  const [userId, setUserId] = useState();
  const [role, setRole] = useState();
  const [friends, setFriends] = useState();
  const [masterDataSource, setMasterDataSource] = useState([]);
  const API = API_URL

  useEffect(() => {
    fetchAuthentification()
    
  }, [])
  
  useFocusEffect(
    useCallback(() => {
      setSearch('')
      fetchChatRooms()
      fetchFriends()
      return () => {
        setSearch('')
      };
    }, [])
  );

  
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
  
  
  const fetchChatRooms = async () => {
    fetch(`${API}/ChatRoom/listPrivateConv`, {
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
                console.log('error fetch conv private room')
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

  const fetchFriends = async () => {
    fetch(`${API}/Friends/list`, {
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
                console.log('error fetch conv private')
            } else {
                setFriends(jsonRes)
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
  
        for (let i in item["Users"]) {
          if (item["Users"][i]["UserId"] != userId) {
            const index = item["Users"][i]["pseudo"]
            const itemData = index
              ? index.toUpperCase()
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
    <SafeAreaView style={styles.container}>
      
      <CustomInput placeholder='Search Here' value={search} setValue={searchFilterFunction} secureTextEntry={false}/>
      {friends&&friends["FriendShips"] !== null && <FlatList 
        data={friends["FriendShips"]}
        renderItem={({ item }) => <UserItem user={item} isMe={userId}/>}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        horizontal
      />}
      
      <FlatList 
        data={conv}
        renderItem={({ item }) => <ChatRoomItem chatRoom={item} isMe={userId}/>}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        // horizontal; allow horizental display (exemple stories)
      />
      
    </SafeAreaView>
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
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingTop: StatusBar.currentHeight
  },
})

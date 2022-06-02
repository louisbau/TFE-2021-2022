import React, { useState, useContext, useEffect, useCallback, useRef } from "react";
import {AppContext} from "../components/context/AppContext";
import { View, StyleSheet, FlatList, Platform, TextInput, SafeAreaView, StatusBar, Text } from 'react-native';
import ChatRoomItem from '../components/ChatRoomItem';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from 'react-native-dotenv'
import { useFocusEffect } from '@react-navigation/native';
import UserItem from "../components/UserItem";
import CustomInput from "../components/CustomInput";
import { io } from "socket.io-client";
import CustomButton from "../components/CustomButton";
import { SocketContext } from "../components/context/socket";
import { useNavigation } from "@react-navigation/native";

export default function TabOneScreen() {
  
  const [conv, setConv] = useState([]);
  const [search, setSearch] = useState('');
  const [userId, setUserId] = useState();
  const [role, setRole] = useState();
  const [friends, setFriends] = useState();
  const [masterDataSource, setMasterDataSource] = useState([]);
  const API = "https://checkpcs.com/api"
  const navigation = useNavigation()
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
  
  useFocusEffect(
    useCallback(() => {
      setSearch('')
      fetchChatRooms()
      
      return () => {
        setSearch('')
      };
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      setSearch('')
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
      <View>
          <CustomInput placeholder='Search Here' value={search} setValue={searchFilterFunction} secureTextEntry={false}/>
      </View>
      <View style={styles.friend}>
        <FlatList 
          data={friends}
          renderItem={({ item }) => <UserItem user={item} isMe={userId}/>}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          horizontal
        />
      </View>
      <View style={styles.conv}>
        <FlatList 
          data={conv}
          renderItem={({ item }) => <ChatRoomItem chatRoom={item} isMe={userId}/>}
          keyExtractor={(item, index) => index.toString()}
          // horizontal; allow horizental display (exemple stories)
          ListFooterComponent={<View style={{height: 150}}/>}
        />
      </View>
      
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  conv: {
    padding: 10,
  },
  friend: {
    paddingLeft: 10,
    
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
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: StatusBar.currentHeight,
  },
})

import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, StyleSheet, FlatList, Platform, TextInput, Text, Image, SafeAreaView, StatusBar } from 'react-native';
import UserItem from '../components/UserItem';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomFeather from '../components/CustomFeather';
import { API_URL } from "@env";
const API = API_URL

export default function FriendsScreen() {
  const [user, setUser] = useState()
  const [friends, setFriends] = useState([]);
  
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [search, setSearch] = useState('');
  useEffect(() => {
      fetchUser();
      fetchFriends();
  }, [])

  

  
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
                setFriends(jsonRes)
                setMasterDataSource(jsonRes)
            } else {
                setFriends(jsonRes)
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

  const fetchUser = async () => {
      fetch(`${API}/card`, {
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
                setUser(jsonRes)
              } else {
                
                setUser(jsonRes) 
                
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
      
      const newData = masterDataSource["FriendShips"].filter(function (item) {
        // Applying filter for the inserted text in search bar
        
        const itemData = item.name
            ? item.name.toUpperCase()
            : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      const test = friends
      test["FriendShips"] = newData
      console.log(friends, 'lol')
      console.log(test, 'test')
      setFriends(test);
      setSearch(text);
    } else {
        console.log(masterDataSource)
        setFriends(masterDataSource);
        setSearch(text);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <CustomInput placeholder='Search Here' value={search} setValue={searchFilterFunction} secureTextEntry={false}/>
        {friends&&friends["FriendShips"] !== null && <FlatList 
            data={friends["FriendShips"]}
            renderItem={({ item }) => <UserItem user={item} isMe={user}/>}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
        />}
        
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingTop: StatusBar.currentHeight
  },
});
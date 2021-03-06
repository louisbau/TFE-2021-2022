import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, StyleSheet, FlatList, Platform, TextInput, Text, Image, SafeAreaView, StatusBar } from 'react-native';
import UserListItem from '../components/UserListItem';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomFeather from '../components/CustomFeather';
import { API_URL } from 'react-native-dotenv'
const API = "https://checkpcs.com/api"


/**
 * Component that the list of friends
 */

export default function FriendsScreen() {
  const [friends, setFriends] = useState([]);
  
  const [masterDataSource, setMasterDataSource] = useState([]);
  const [search, setSearch] = useState('');
  useEffect(() => {
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

  const searchFilterFunction = (text) => {
    // Check if searched text is not blank

    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource and update FilteredDataSource
      
      const newData = masterDataSource.filter(function (item) {
        // Applying filter for the inserted text in search bar
        
        const itemData = item.name
            ? item.name.toUpperCase()
            : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFriends(newData);
      setSearch(text);
    } else {
        
        setFriends(masterDataSource);
        setSearch(text);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
        <CustomInput placeholder='Search Here' value={search} setValue={searchFilterFunction} secureTextEntry={false}/>
        {friends !== null && <FlatList 
            data={friends}
            renderItem={({ item }) => <UserListItem user={item}/>}
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
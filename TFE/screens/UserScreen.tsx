import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, StyleSheet, FlatList, Platform, TextInput } from 'react-native';
import UserItem from '../components/UserItem';
import { API_URL } from "@env";
const API = API_URL

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [masterDataSource, setMasterDataSource] = useState([]);


  useEffect(() => {
    const fetchUsers = async () => {
        console.log('')
        fetch(`${API}/list`, {
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
                    setUsers(jsonRes);
                    setMasterDataSource(jsonRes)
                    
                } else {
                    setUsers(jsonRes);
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
    fetchUsers();
  }, [])
  const searchFilterFunction = (text) => {
    // Check if searched text is not blank
    console.log(text)
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
      setUsers(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setUsers(masterDataSource);
      setSearch(text);
    }
  };

  return (
    <View style={styles.page}>
        <TextInput
          style={styles.textInputStyle}
          onChangeText={(text) => searchFilterFunction(text)}
          value={search}
          underlineColorAndroid="transparent"
          placeholder="Search Here"
        />
        <FlatList 
          data={users}
          renderItem={({ item }) => <UserItem user={item} />}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1
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
});
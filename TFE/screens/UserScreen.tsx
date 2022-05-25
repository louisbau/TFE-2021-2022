import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, StyleSheet, FlatList, Platform, TextInput, Text, Image } from 'react-native';
import UserItem from '../components/UserItem';
import { API_URL } from "@env";
const API = API_URL

export default function UsersScreen() {
  const [user, setUser] = useState()
  useEffect(() => {
      fetchUser();
  }, [])
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

  return (
    <View style={styles.page}>
      {user && <Image 
          source={{ uri: user.imageUri}}
          style={{ width: 30, height: 30, borderRadius: 30, backgroundColor:'blue'}}
      />}
      {user && <Text>Modifier la photo</Text>}
      {user && <Text>nom généré</Text>}

      {user && <Text>Name : {user.name}</Text>}
      {user && <Text>Email : {user.email}</Text>}
      {user && <Text>Status : {user.status}</Text>}
      {user && <Text>Organisation : faire organisation</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  }
});
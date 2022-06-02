import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, StyleSheet, FlatList, Platform, TextInput, Text, Image } from 'react-native';
import UserItem from '../components/UserItem';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomFeather from '../components/CustomFeather';
import { API_URL } from 'react-native-dotenv'
const API = "https://checkpcs.com/api"
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from '@react-navigation/native';


export default function OtherUserScreen({ id }) {
  const [user, setUser] = useState()
  
  useEffect(() => {
      fetchUser();
  }, [])

  const fetchUser = async () => {
    fetch(`${API}/card/${id}`, {
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

  

  const onPress = (event) => {
    event.preventDefault()
    fetchAddConv()

  }
  const fetchAddConv = async () => {
    fetch(`${API}/ChatRoomUser/NewConv`, {
        method: 'Post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
            'credentials': 'include'
        },
        body: JSON.stringify({ id: id })
    })
    .then(async (res) => { 
        try {
            const jsonRes = await res.json();
            if (res.status !== 200) {
              console.log(jsonRes)
            } else {
              
              
              
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
          style={{ width: 150, height: 150, borderRadius: 30, backgroundColor:'blue'}}
      />}
      
      <View style={styles.para}>
        {user && <Text style={styles.text}>Name : {user.name}</Text>}
        {user && <Text style={styles.text}>Status : {user.status}</Text>}
        
      </View>
      <View style={styles.button}>
        <CustomButton text={'Blocked'} onPress={onPress}/>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    width:"100%",
    height: "100%",
    alignItems: "center",
  },
  button :{

  },
  para: {
    padding: 20,
  },
  text: {
    padding: 20,
    
  }
});
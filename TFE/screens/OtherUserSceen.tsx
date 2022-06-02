import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, StyleSheet, FlatList, Platform, TextInput, Text, Image, Alert } from 'react-native';
import UserItem from '../components/UserItem';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomFeather from '../components/CustomFeather';
import { API_URL } from 'react-native-dotenv'
const API = "https://checkpcs.com/api"
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from '@react-navigation/native';


export default function OtherUserScreen({ }) {
  const [user, setUser] = useState()
  const route = useRoute();
  
  useEffect(() => {
      fetchUser();
  }, [])

  const fetchUser = async () => {
    fetch(`${API}/card/${route.params?.id}`, {
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
    fetchBlock()

  }
  const fetchBlock = async () => {
    fetch(`${API}/BlockUser/block`, {
        method: 'Post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
            'credentials': 'include'
        },
        body: JSON.stringify({ id: route.params?.id })
    })
    .then(async (res) => { 
        try {
            const jsonRes = await res.json();
            if (res.status !== 200) {
              console.log(jsonRes, "lol")
            } else {
              
                console.log(jsonRes)
                
                fetchDeleteChat()
                Alert.alert("user blocked and delete")
                navigation.navigate('Home')
            }
        } catch (err) {
            console.log(err);
        };
    })
    .catch(err => {
        console.log(err);
    });
  };

  const fetchDeleteChat = async () => {
    fetch(`${API}/ChatRoom/deleteChatRoom`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
            'credentials': 'include'
        },
        body: JSON.stringify({ id: route.params?.SubChatRoomId })
    })
    .then(async (res) => { 
        try {
            const jsonRes = await res.json();
            if (res.status !== 200) {
              console.log(jsonRes)
            } else {
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
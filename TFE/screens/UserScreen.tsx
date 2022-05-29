import React, { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, StyleSheet, FlatList, Platform, TextInput, Text, Image } from 'react-native';
import UserItem from '../components/UserItem';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import CustomFeather from '../components/CustomFeather';
import { API_URL } from 'react-native-dotenv'
const API = API_URL
import * as ImagePicker from "expo-image-picker";


export default function UsersScreen() {
  const [user, setUser] = useState()
  const [image, setImage] = useState()
  useEffect(() => {
      fetchUser();
  }, [])

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.cancelled) {
      
      const fetchAddPics = async () => {
        fetch(`${API}/addPics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
                'credentials': 'include'
            },
            body: JSON.stringify({ pics: result.uri })
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
      fetchAddPics()
    }
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

  return (
    <View style={styles.page}>
      {user && <Image 
          source={{ uri: user.imageUri}}
          style={{ width: 30, height: 30, borderRadius: 30, backgroundColor:'blue'}}
      />}
      <CustomButton text={'modify pics'} onPress={pickImage}/>
      
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
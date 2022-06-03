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


export default function UsersScreen() {
  const [user, setUser] = useState()
  
  useEffect(() => {
      fetchUser();
  }, [])
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
                  //console.log(jsonRes)
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
          style={{ width: 150, height: 150, borderRadius: 30, backgroundColor:'blue'}}
      />}
      <View style={styles.button}>
        <CustomButton text={'modify pics'} onPress={pickImage}/>
      </View>
      
      <View style={styles.para}>
        {user && <Text style={styles.text}>Name : {user.name}</Text>}
        {user && <Text style={styles.text}>Email : {user.email}</Text>}
        {user && <Text style={styles.text}>Status : {user.status}</Text>}
        {user && <Text style={styles.text}>Organisation : faire organisation</Text>}
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
import {  useNavigation, useNavigationState } from '@react-navigation/native';
import React, { useEffect, useState} from 'react'
import {  View, Switch, Text, Image, useWindowDimensions, Pressable,TextInput,  Alert,Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import * as SecureStore from 'expo-secure-store';
import CustomInput from '../CustomInput';
import CustomButton from '../CustomButton';
import {API_URL} from 'react-native-dotenv'
const API = "https://checkpcs.com/api"


export default function AddConvItem({modalVisible, setModalVisible}) {
    const [text, onChangeText] = useState("");
    const navigation = useNavigation();
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
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
          body: JSON.stringify({ name: text })
      })
      .then(async (res) => { 
          try {
              const jsonRes = await res.json();
              if (res.status !== 200) {
                console.log(jsonRes)
              } else {
                setModalVisible(false);
                onChangeText("")
                if (jsonRes === "you user block you") {
                  Alert.alert("the user block you")
                }
                if (jsonRes && jsonRes !== "you user block you") {
                  if (!jsonRes.SubChatRooms) {
                    Alert.alert("no user")
                  }
                  else {
                    navigation.navigate("ChatRoom", { id: jsonRes.SubChatRooms[0].id, chat: jsonRes.UserChatRooms.find((x)=> x.UserId !== user.id) });
                  }
                  
                }
                
                
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
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ 
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={styles.modalText}>New Conv</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >  
                  <Text style={styles.textStyle}>Cancel</Text>
                  
                </Pressable>
              </View>
              <View style={{ 
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <CustomInput placeholder='add conv' value={text} setValue={onChangeText} secureTextEntry={false}/>
                
              </View>
              <CustomButton text={'Add'} onPress={onPress}/>
              
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    centeredView: {
      
      justifyContent: "center",
      alignItems: "center",
      marginTop: 0
    },
    modalView: {
      width: "100%",
      height: "95%",
      marginTop: "30%",
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      borderRadius: 30,
      padding: 10,
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
});  
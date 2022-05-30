import {  useNavigation, useNavigationState } from '@react-navigation/native';
import React, { useEffect, useState} from 'react'
import {  View, Switch, Text, Image, useWindowDimensions, Pressable,TextInput,  Alert,Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import * as SecureStore from 'expo-secure-store';
import { API_URL } from 'react-native-dotenv'
import CustomInput from '../CustomInput';
import CustomButton from '../CustomButton';
const API = API_URL



export default function SettingGroupItem({ modalVisible, setModalVisible, group }) {
    const [name, setName] = useState("");
    const [subName, setSubName] = useState(group.name);
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
    const pickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
      
      
  
      if (!result.cancelled) {
        
        const fetchAddPics = async () => {
          fetch(`${API}/ChatRoom/addPics`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
                  'credentials': 'include'
              },
              body: JSON.stringify({ pics: result.uri, id: group.id })
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
    
  
    const onPress = (event) => {
      event.preventDefault()
      fetchAddUser()
  
    }
    const onPress1 = (event) => {
      event.preventDefault()
      fetchRenamaGroup()
  
    }
    const onPress2 = (event) => {
      event.preventDefault()
      fetchDeleteGroup()
  
    }
    const fetchAddUser = async () => {
      fetch(`${API}/UserChatRoom/addUserGroup`, {
          method: 'Post',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
              'credentials': 'include'
          },
          body: JSON.stringify({ name:name, ChatRoomId: group.id })
      })
      .then(async (res) => { 
          try {
              const jsonRes = await res.json();
              if (res.status !== 200) {
                console.log(jsonRes)
              } else {
                setName("")
              }
          } catch (err) {
              console.log(err);
          };
      })
      .catch(err => {
          console.log(err);
      });
    };

    const fetchDeleteGroup = async () => {
      fetch(`${API}/ChatRoom/deleteChatRoom`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
              'credentials': 'include'
          },
          body: JSON.stringify({ id: group.id })
      })
      .then(async (res) => { 
          try {
              const jsonRes = await res.json();
              if (res.status !== 200) {
                console.log(jsonRes)
              } else {
                setName("")
              }
          } catch (err) {
              console.log(err);
          };
      })
      .catch(err => {
          console.log(err);
      });
    };
    
    const fetchRenamaGroup = async () => {
      fetch(`${API}/ChatRoom/renameGroup`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
              'credentials': 'include'
          },
          body: JSON.stringify({ groupname: subName, groupid: group.id })
      })
      .then(async (res) => { 
          try {
              const jsonRes = await res.json();
              if (res.status !== 200) {
                console.log(jsonRes)
              } else {
                setName("")
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
                    <Text style={styles.modalText}>Group settings</Text>
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
                    <CustomInput placeholder='Add User' value={name} setValue={setName} secureTextEntry={false}/>
                </View>
                <CustomButton text={'Add'} onPress={onPress}/>
                
                <CustomButton text={'modify pics'} onPress={pickImage}/>
                <View style={{ 
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <CustomInput placeholder='Change name group' value={subName} setValue={setSubName} secureTextEntry={false}/>
                    
                </View>
                <CustomButton text={'Add'} onPress={onPress1}/>
                <CustomButton text={'Delete'} onPress={onPress2}/>
                
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
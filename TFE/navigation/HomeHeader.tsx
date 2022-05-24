import {  useNavigation } from '@react-navigation/native';
import React, { useEffect, useState} from 'react'
import {  View, Switch, Text, Image, useWindowDimensions, Pressable,TextInput,  Alert,Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import * as SecureStore from 'expo-secure-store';
import { API_URL } from "@env";
const API = API_URL


const HomeHeader = () => {
    const { width } = useWindowDimensions();
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState()
    const [text, onChangeText] = useState("");
    const navigation = useNavigation();
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    
    useEffect(() => {
      fetchUser();
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
          body: JSON.stringify({ name: text })
      })
      .then(async (res) => { 
          try {
              const jsonRes = await res.json();
              if (res.status !== 200) {
                console.log(jsonRes)
              } else {
                setModalVisible(!modalVisible);
                onChangeText("")
                navigation.navigate("ChatRoom", { id: jsonRes.SubChatRooms[0].id, chat: jsonRes.UserChatRooms.find((x)=> x.UserId !== user.id) });
                
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
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
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
                <Switch
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                    
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
                <TextInput
                style={styles.input}
                onChangeText={onChangeText}
                value={text}
                />
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={onPress}
                >  
                  <Text style={styles.textStyle}>Add</Text>
                    
                </Pressable>
              </View>
              
            </View>
          </View>
        </Modal>
        <View style={{ 
         flexDirection: 'row',
         alignItems: 'center',
         justifyContent: "center",
        }}>
          {user && <Image 
            source={{ uri: user.imageUri}}
            style={{ width: 30, height: 30, borderRadius: 30, backgroundColor:'blue'}}
          />}
          <Text style={{fontWeight: 'bold', color: 'black' , backgroundColor:'red'}}>Chat</Text>
          <Pressable
            onPress={() => setModalVisible(true)}
            style={{backgroundColor:'green'}}
          >
            <Feather
              name="edit"
              size={24}
              color="black"
            />
          </Pressable>
  
        </View>
      </View>
    )
};
  
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

export default HomeHeader;
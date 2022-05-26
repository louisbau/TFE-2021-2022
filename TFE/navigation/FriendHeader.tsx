import React, { useEffect, useState, useContext } from "react";
import { View, Image, Text, useWindowDimensions, Platform, Modal, Pressable, StyleSheet } from "react-native";
import CustomInput from "../components/CustomInput";
import CustomFeather from "../components/CustomFeather";
import CustomButton from "../components/CustomButton";
import { API_URL } from "@env";
const API = API_URL
import * as SecureStore from 'expo-secure-store';

const FriendHeader = ( ) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [friend, setFriend] = useState("")
    const onPress = (event) => {
        event.preventDefault()
        fetchAddFriend()
        setModalVisible(!modalVisible)
    }
    

    const fetchAddFriend = async () => {
        fetch(`${API}/FriendShips/addFriendship`, {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
                'credentials': 'include'
            },
            body: JSON.stringify({ name:friend })
        })
        .then(async (res) => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                console.log(jsonRes)
                } else {
                setFriend("")
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
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                

                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={{ 
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text style={styles.modalText}>Add a Friends</Text>
                            <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}
                            >  
                                <Text style={styles.textStyle}>Cancel</Text>
                            
                            </Pressable>
                        </View>
                        <CustomInput placeholder='add Friend' value={friend} setValue={setFriend} secureTextEntry={false}/>
                        <CustomButton text={'a Friend '} onPress={onPress}/>
                        
                    </View>
                </View>
                
            </Modal>
            <View
            style={{
                flexDirection: "row",
                justifyContent: "center",
            }}
            >

                <Text style={{ marginLeft: 10, fontWeight: "bold" }}>
                    Friend
                </Text>
                <CustomFeather name="edit-2" size={24} onPress={() => setModalVisible(true)} color="black"/>
                
            </View>
        </View>
    );
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

export default FriendHeader;
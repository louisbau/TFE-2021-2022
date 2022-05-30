import {  useNavigation, useNavigationState } from '@react-navigation/native';
import React, { useEffect, useState} from 'react'
import {  View, Switch, Text, Image, useWindowDimensions, Pressable,TextInput,  Alert,Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import CustomFeather from '../components/CustomFeather';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from 'react-native-dotenv'
const API = API_URL
import AddGroupItem from '../components/AddGroupItem';
import AddConvItem from '../components/AddConvItem';

const HomeHeader = ({ nav }) => {
    const [modalVisible, setModalVisible] = useState(false);
    
    
    
    
    const index = useNavigationState(state => state.routes);
    const Tab = index[0].state ? index[0].state.index : 0
    
    
    return (
        <View>
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
                {Tab ? <AddGroupItem modalVisible={modalVisible} setModalVisible={setModalVisible}/> : <AddConvItem modalVisible={modalVisible} setModalVisible={setModalVisible}/> }
              </Modal>
            </View>
            <View style={styles.row}>
                <Text style={styles.head}>{Tab ? "Group" : "Chats"}</Text>
                <View style={styles.feather}>
                    <CustomFeather name="edit" size={24} onPress={() => setModalVisible(true)} color="black"/>
                </View>
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
    row: {
      flexDirection: 'row',
      alignItems:'center',
      alignContent:'center',
      marginTop: 4,
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
    },
    feather: {
      width:'25%',
      alignItems: 'flex-end'
    }, 
    head: {
      fontWeight: 'bold', 
      color: 'black',
      textAlign:'center',
      width: '100%',
      fontSize: 20,
    },
});

export default HomeHeader;
import React, {useContext, useState, useEffect}from 'react';
import { Text, Image, View, Pressable, Platform, FlatList, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import styles from './styles';
import { API_URL } from 'react-native-dotenv'
import * as SecureStore from 'expo-secure-store';
import ListSubChatItem from '../ListSubChatItem';
import CustomFeather from '../CustomFeather';
const API =  "https://checkpcs.com/api"
import SettingGroupItem from '../SettingGroupItem';
import AddSubItem from '../AddSubItem';

export default function GroupItem({ group, setGroup }) {
  const [userId, setUserId] = useState();
  const [role, setRole] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [IsOnEdit, setIsOnEdit] = useState(false);
  const Groupe = userId ? group.Users.find((x) => x.UserId === userId) : false
  const IsAdminGroupe = Groupe ? (Groupe.role === "admin" ? true : false) : false
  useEffect(() => {
    fetchAuthentification()
  }, [])
  const fetchAuthentification = async () => {
    fetch(`${API}/authentification`, {
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
              setRole(jsonRes.role) 
              setUserId(jsonRes.UserId)
            } else {
              setRole(jsonRes.role) 
              setUserId(jsonRes.UserId)
              
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
    setModalVisible(true)

  }
  const onPress1 = (event) => {
    event.preventDefault()
    setModalVisible1(true)
    

  }
  const onPress2 = (event) => {
    event.preventDefault()
    setIsOnEdit(!IsOnEdit)
  }

  
  return (
    <View style={styles.container}>
      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
      >
          <SettingGroupItem modalVisible={modalVisible} setModalVisible={setModalVisible} group={group}/>
      </Modal>
      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible1}
          onRequestClose={() => {
            setModalVisible(!modalVisible1);
          }}
      >
          <AddSubItem modalVisible={modalVisible1} setModalVisible={setModalVisible1} group={group} setGroup={setGroup}/>
      </Modal>
      <View style={styles.containerList}>
        <Image source={{ uri: group.imageUri}} style={styles.image} />
        <View style={styles.rightContainer}>
          <View style={styles.row}>
            <Text style={styles.name}>{group.name}</Text>
            {IsAdminGroupe && <CustomFeather name="plus" size={24} onPress={onPress1} color="black"/>}
            {IsAdminGroupe && <CustomFeather name="edit-2" size={24} onPress={onPress2} color="black"/>}
            {IsAdminGroupe && <CustomFeather name="settings" size={24} onPress={onPress} color="black"/>}
          </View>
        </View>
      </View>
      <View style={styles.containerList}>
        <FlatList 
          data={group.SubChatRooms}
          renderItem={({ item }) => <ListSubChatItem list={item} isAdmin={IsAdminGroupe} IsOnEdit={IsOnEdit}/>}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          // horizontal; allow horizental display (exemple stories)
        />
      </View>
    </View>
  );
}
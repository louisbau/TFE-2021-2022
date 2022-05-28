import React, {useContext, useState, useRef}from 'react';
import { Text, Image, View, Pressable, Platform, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import styles from './styles';
import { API_URL } from "@env";
import * as SecureStore from 'expo-secure-store';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import CustomButton from '../CustomButton';
import CustomInput from '../CustomInput';
const API =  API_URL

export default function ListSubChatItem({ list, isAdmin, IsOnEdit }) {
  const navigation = useNavigation();
  const [isRename, setIsRename] = useState(false);
  const swipeableRef = useRef(null);
  const [name, setName] = useState(list.name);
  const onPress = async (event) => {
    event.preventDefault()
    navigation.navigate("ChatGroup", { id: list.id, chat: list });
  }

  const onPress1 = async (event) => {
    event.preventDefault()
    setIsRename(!isRename)
  }
  const onPress2 = async (event) => {
    event.preventDefault()
    fetchRenameSub()
    setIsRename(!isRename)
  }
  const swipeFromRightOpen = async () => {
    swipeableRef.current.close();
    fetchDeleteSub()
  };

  const fetchRenameSub = async () => {
    fetch(`${API}/SubChatRoom/renameSub`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
            'credentials': 'include'
        },
        body: JSON.stringify({ subname: name, subnameid: list.id })
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

  const fetchDeleteSub = async () => {
    fetch(`${API}/SubChatRoom/deleteSubRoom`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
            'credentials': 'include'
        },
        body: JSON.stringify({ id: list.id })
    })
    .then(async (res) => { 
        try {
            const jsonRes = await res.json();
            if (res.status !== 200) {
              console.log('lol')
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
  }
  const rightSwipeActions = () => {
    return (
      <View
        style={{
          backgroundColor: '#ff8303',
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}
      >
        <Text
          style={{
            color: '#1b1a17',
            paddingHorizontal: 10,
            fontWeight: '600',
            paddingVertical: 20,
          }}
        >
          Delete
        </Text>
      </View>
    );
  };

  return (
    <Swipeable
      renderRightActions={rightSwipeActions}
      onSwipeableRightOpen={swipeFromRightOpen}
      ref={swipeableRef}
      enabled={IsOnEdit}
    >
      {!IsOnEdit && (<Pressable onPress={onPress} style={styles.container}>
        <View style={styles.rightContainer}>
          <View style={styles.row}>
            <Text style={styles.name}>{list.name}</Text>
          </View>
        </View>
      </Pressable>)}
      {IsOnEdit &&
       <View style={styles.rightContainer}>
          <View style={styles.row}>
            {isRename ? <CustomInput placeholder='' value={name} setValue={setName} secureTextEntry={false}/> : <Text style={styles.name}>{list.name}</Text>}
            {isRename && <CustomButton text={'OK'} onPress={onPress2}/>}
            <CustomButton text={'Rename'} onPress={onPress1}/>
          </View>
        </View>}
    </Swipeable>
    
  );
}
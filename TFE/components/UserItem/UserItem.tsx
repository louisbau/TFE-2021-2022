import React, {useContext, useState}from 'react';
import { Text, Image, View, Pressable, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import styles from './styles';
import { API_URL } from "@env";
import * as SecureStore from 'expo-secure-store';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
const API =  API_URL

export default function UserItem({ user, isMe }) {
  const navigation = useNavigation();
  
  const onPress = async (event) => {
    event.preventDefault()
    console.log(user)
  }

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{ uri: user.imageUri}} style={styles.image} />
    </Pressable>
  );
}
import React, {useContext, useState}from 'react';
import { Text, Image, View, Pressable, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import styles from './styles';
import { API_URL } from "@env";
import * as SecureStore from 'expo-secure-store';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
const API =  API_URL

export default function GroupItem({ group }) {
  const navigation = useNavigation();
  const context = useContext(AppContext)
  const onPress = async (event) => {
    event.preventDefault()
    console.log('yes')
  }

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{ uri: group.imageUri}} style={styles.image} />
      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{group.name}</Text>
        </View>
      </View>
    </Pressable>
  );
}
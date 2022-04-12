import React from 'react';
import { Text, Image, View, Pressable, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import styles from './styles';
const API_URL = Platform.OS === 'ios' ? 'http://172.20.10.5:5000/api' : 'http://172.20.10.5:5000/api';

export default function UserItem({ user }) {
  const navigation = useNavigation();

  const onPress = async () => {

    // TODO if there is already a chat room between these 2 users
    // then redirect to the existing chat room
    // otherwise, create a new chatroom with these users.

    // Create a chat room
  }

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image source={{ uri: user.imageUri}} style={styles.image} />

      <View style={styles.rightContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>{user.name}</Text>
        </View>
      </View>
    </Pressable>
  );
}
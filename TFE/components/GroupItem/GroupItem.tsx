import React, {useContext, useState}from 'react';
import { Text, Image, View, Pressable, Platform, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import styles from './styles';
import { API_URL } from "@env";
import * as SecureStore from 'expo-secure-store';
import { AppContext } from '../context/AppContext';
import ListSubChatItem from '../ListSubChatItem';
import axios from 'axios';
const API =  API_URL

export default function GroupItem({ group }) {
  
  
  
  
  return (
    <View style={styles.container}>
      <View style={styles.containerList}>
        <Image source={{ uri: group.imageUri}} style={styles.image} />
        <View style={styles.rightContainer}>
          <View style={styles.row}>
            <Text style={styles.name}>{group.name}</Text>
          </View>
        </View>
      </View>
      <View style={styles.containerList}>
        <FlatList 
          data={group.SubChatRooms}
          renderItem={({ item }) => <ListSubChatItem list={item}/>}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          // horizontal; allow horizental display (exemple stories)
        />
      </View>
    </View>
  );
}
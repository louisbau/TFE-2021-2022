import React, { useEffect, useState, useContext } from "react";
import { View, Image, Text, useWindowDimensions, Platform, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
// const API_URL = Platform.OS === 'ios' ? 'http://192.168.1.44:5000/api' : 'http://192.168.1.44:5000/api';
import { AppContext } from "../components/context/AppContext";
import CustomFeather from "../components/CustomFeather";
import { useNavigation } from '@react-navigation/core';
/**
 * Component that is used has the header of the chatroomscreen 
 */

const ChatRoomHeader = ({ id, chat }) => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const onPress = (event) => {
    event.preventDefault()
    navigation.navigate("Call");

  }
  const onPressUser = (event) => {
    event.preventDefault()
    console.log(chat)
    navigation.navigate("OtherUser", { id: chat.UserId, SubChatRoomId: chat.ChatRoomUsers[0].SubChatRoomId });
  }

  
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Pressable onPress={onPressUser}>
        <Image
          source={{
            uri: chat && chat.imageUri
          }}
          style={{ width: 30, height: 30, borderRadius: 30 }}
        />
      </Pressable>
      
      <Text style={{ marginLeft: 10, fontWeight: "bold" }}>
        {chat && chat.pseudo}
      </Text>
      <CustomFeather name="phone" size={24} onPress={onPress} color="black"/>
      <CustomFeather name="video" size={24} onPress={onPress} color="black"/>
    </View>
  );
};

export default ChatRoomHeader;
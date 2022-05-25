import React, { useEffect, useState, useContext } from "react";
import { View, Image, Text, useWindowDimensions, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
// const API_URL = Platform.OS === 'ios' ? 'http://192.168.1.44:5000/api' : 'http://192.168.1.44:5000/api';
import { AppContext } from "../components/context/AppContext";
import CustomFeather from "../components/CustomFeather";

const ChatRoomHeader = ({ id, chat }) => {
  const { width } = useWindowDimensions();
  console.log(chat,id,'lol')
  const onPress = (event) => {
    event.preventDefault()
    console.log('call or video')

  }
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
      }}
    >
      <Image
        source={{
          uri: chat.imageUri
        }}
        style={{ width: 30, height: 30, borderRadius: 30 }}
      />
      <Text style={{ marginLeft: 10, fontWeight: "bold" }}>
        {chat.pseudo}
      </Text>
      <CustomFeather name="phone" size={24} onPress={onPress} color="black"/>
      <CustomFeather name="video" size={24} onPress={onPress} color="black"/>
    </View>
  );
};

export default ChatRoomHeader;
import React, { useEffect, useState, useContext } from "react";
import { View, Image, Text, useWindowDimensions, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
// const API_URL = Platform.OS === 'ios' ? 'http://192.168.1.44:5000/api' : 'http://192.168.1.44:5000/api';
import { AppContext } from "../components/context/AppContext";

const ChatGroupHeader = ({ id, group }) => {
  const { width } = useWindowDimensions();
  console.log(group)
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: width - 25,
        marginLeft: 25,
        padding: 10,
        alignItems: "center",
      }}
    >
      <Image
        source={{
          uri: group.imageUri
        }}
        style={{ width: 30, height: 30, borderRadius: 30 }}
      />
      <Text style={{ flex: 1, marginLeft: 10, fontWeight: "bold" }}>
        {group.name}
      </Text>
      <Feather
        name="edit-2"
        size={24}
        color="black"
        style={{ marginHorizontal: 50 }}
      />
    </View>
  );
};

export default ChatGroupHeader;
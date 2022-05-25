import React, { useEffect, useState, useContext } from "react";
import { View, Image, Text, useWindowDimensions, Platform } from "react-native";

import CustomFeather from "../components/CustomFeather";

const ChatGroupHeader = ({ id, group }) => {
  const { width } = useWindowDimensions();
  const onPress = (event) => {
    event.preventDefault()
    console.log('call or video')

  }
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Image
        source={{
          uri: group.imageUri
        }}
        style={{ width: 30, height: 30, borderRadius: 30 }}
      />
      <Text style={{ fontWeight: "bold" }}>
        {group.name}
      </Text>
      <CustomFeather name="phone" size={24} onPress={onPress} color="black"/>
      <CustomFeather name="video" size={24} onPress={onPress} color="black"/>
    </View>
  );
};

export default ChatGroupHeader;
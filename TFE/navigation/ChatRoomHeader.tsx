import React, { useEffect, useState, useContext } from "react";
import { View, Image, Text, useWindowDimensions, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
// const API_URL = Platform.OS === 'ios' ? 'http://192.168.1.44:5000/api' : 'http://192.168.1.44:5000/api';
import { AppContext } from "../components/context/AppContext";

const ChatRoomHeader = ({ id, chat }) => {
  const { width } = useWindowDimensions();
  const context = useContext(AppContext)
  const otherUser = context.UserId && chat.Users.find((x) => x.id !== context.UserId)
  /*
  const room = context.app && context.app.find((x) => x[0].id === id)
  const user = context.UserId && chat
  */
  /**useEffect(() => {
    if (!id) {
      return;
    }

    const fetchUsers = async () => {
      const fetchedUsers = (await DataStore.query(ChatRoomUser))
        .filter((chatRoomUser) => chatRoomUser.chatroom.id === id)
        .map((chatRoomUser) => chatRoomUser.user);

      // setUsers(fetchedUsers);

      const authUser = await Auth.currentAuthenticatedUser();
      setUser(
        fetchedUsers.find((user) => user.id !== authUser.attributes.sub) || null
      );
    };
    fetchUsers();
  }, []);**/
  /*
  useEffect(() => {
    if (!id) {
        return;
      
    }

    const fetchChat = async () => {
        fetch(`${API_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                    setUser(jsonRes);
                    console.log(jsonRes+ 'lol')
                } else {
                    setUser(jsonRes);
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };
    fetchChat();
  }, [])
  */
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
          uri: chat.imageUri ? chat.imageUri : otherUser.imageUri,
        }}
        style={{ width: 30, height: 30, borderRadius: 30 }}
      />
      <Text style={{ flex: 1, marginLeft: 10, fontWeight: "bold" }}>
        {chat.name ? chat.name : otherUser.name}
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

export default ChatRoomHeader;
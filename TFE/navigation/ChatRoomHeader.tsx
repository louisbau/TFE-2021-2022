import React, { useEffect, useState } from "react";
import { View, Image, Text, useWindowDimensions, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
const API_URL = Platform.OS === 'ios' ? 'http://192.168.1.44:5000/api' : 'http://192.168.1.44:5000/api';

const ChatRoomHeader = ({ id }) => {
  const { width } = useWindowDimensions();
  const [user, setUser] = useState();

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
      {user && <Image
        source={{
          uri: user[1].imageUri,
        }}
        style={{ width: 30, height: 30, borderRadius: 30 }}
      />}
      {user && <Text style={{ flex: 1, marginLeft: 10, fontWeight: "bold" }}>
        {user[1].name}
      </Text>}
      <Feather
        name="camera"
        size={24}
        color="black"
        style={{ marginHorizontal: 10 }}
      />
      <Feather
        name="edit-2"
        size={24}
        color="black"
        style={{ marginHorizontal: 10 }}
      />
    </View>
  );
};

export default ChatRoomHeader;
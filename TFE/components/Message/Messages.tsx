import React, {useContext, useState, useEffect}from 'react'
import { View, Text, StyleSheet,Image, Keyboard, Alert } from 'react-native'
import AudioPlayer from "../AudioPlayer";
import Filter from "bad-words";
import { useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/core";
const blue = "lightblue";
const green = "lightgreen";
import { box } from "tweetnacl";
import {
  decrypt,
  getMySecretKey,
  stringToUint8Array,
} from "../../utils/crypto";
import CustomFeather from '../CustomFeather';
import { API_URL } from 'react-native-dotenv'
const API = "https://checkpcs.com/api"
import * as SecureStore from 'expo-secure-store';

const Messages = ({ message, user, isMeUserId, setOnReply }) => {
    const UserMessageID = message.UserChatRoomId
    const isMeUserChatID = user.find((x) => x.UserId === isMeUserId).ChatRoomUsers[0].UserChatRoomId
    const UserMessage = user.find((x) => x.ChatRoomUsers[0].UserChatRoomId === UserMessageID)
    const isMe = UserMessageID === isMeUserChatID
    const [decryptedContent, setDecryptedContent] = useState("");
    const [replyMessage, setReplyMessage] = useState();
    const [id, setId] = useState(null);
    const [reason, setReason] = useState(null);
    let filter = new Filter();

    const fetchReport = async () => {
        fetch(`${API}/ReportMessage/message`, {
            method: 'Post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
                'credentials': 'include'
            },
            body: JSON.stringify({ id:id, reason: reason })
        })
        .then(async (res) => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                  console.log(jsonRes)
                } else {
                  
                  onChangeText("")
                  navigation.navigate("ChatRoom", { id: jsonRes.SubChatRooms[0].id, chat: jsonRes.UserChatRooms.find((x)=> x.UserId !== user.id) });
                  
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };
    
    // const [soundURI, setSoundURI] = useState(null);
    const { width } = useWindowDimensions();
    const navigation = useNavigation()
    useEffect(() => {
        if (message.reference) {
            fetchMessage()
        }
    }, []);
    const fetchMessage = async () => {
        fetch(`${API}/Message/reference/${message.reference}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
                'credentials': 'include'
            }
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                
                if (res.status !== 200) {
                    setReplyMessage(jsonRes);
                } else {
                    setReplyMessage(jsonRes);
                    //console.log(jsonRes)
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };
    useEffect(() => {
        if (!message?.content || !isMeUserChatID?.publicKey) {
            if (!message.isCrypted) {
                
                setDecryptedContent(message.content);
                return;
            }
            else{
                const decryptMessage = async () => {
                    const myKey = await getMySecretKey(navigation);
                    if (!myKey) {
                    return;
                    }
                    // decrypt message.content
                    else {
                        const sharedKey = box.before(stringToUint8Array(UserMessage.publicKey), myKey);
                        const decrypted = decrypt(sharedKey, message.content);
                        setDecryptedContent(decrypted.content);
                    }
                    
                };
                decryptMessage()
            }
        }
    
        
    
        
    }, [message, user]);

    const onPressReply = async (event) => {
        event.preventDefault()
        if (message.image) {
            setOnReply(['image', message])
        }
        if (message.audio) {
            setOnReply(['audio', message])
        }
        if (!!decryptedContent) {
            setOnReply([filter.clean(decryptedContent), message])
        }
    }

    const onPressReport = () => {
        setId(message.id)
        fetchReport()
        Alert.alert("message report")
    }
    
    return (
        <View style={[styles.container, isMe ? styles.rightContainer : styles.leftContainer]}>
            <View style={[styles.container, isMe ? styles.rightMessageColor : styles.leftMessageColor]}>
                {replyMessage && <Text style={{ backgroundColor:"grey" }}>{filter.clean(replyMessage.content)}</Text>}
                {message.image && (
                    <View style={{ marginBottom: message.content ? 10 : 0 }}>
                        <Image
                            source={{ uri: message.image }}
                            style={{ width: width * 0.7, aspectRatio: 4 / 3 }}
                            resizeMode="contain"
                        />
                    </View>
                )}
                {message.audio && <AudioPlayer soundURI={message.audio} />}
                
                {!!decryptedContent && (
                    <Text style={{ color: isMe ? "black" : "white" }}>
                        {filter.clean(decryptedContent)}
                    </Text>
                )}
            </View>
            <View>
                {user && <Image source={{ uri: UserMessage.imageUri }} style={styles.image} />}
                {user && <Text>{UserMessage.pseudo}</Text>}
                
                <CustomFeather name="corner-down-right" size={24} onPress={onPressReply} color="black"/>
                <CustomFeather name="alert-triangle" size={24} onPress={onPressReport} color="black"/>

            </View>
        </View>
        
  )
}

const styles = StyleSheet.create({
    container : {
        padding:10,
        margin: 10,
        borderRadius: 10,
        maxWidth: '75%',
    },
    leftContainer: {
        marginLeft: 10,
        marginRight: 'auto'
    },
    rightContainer: {
        marginLeft: 'auto',
        marginRight: 10,
    },
    leftMessageColor: {
        backgroundColor: blue,
    },
    rightMessageColor: {
        backgroundColor: green,
    },
    image: {
        height: 20,
        width: 20,
        borderRadius: 30,
        marginRight: 10,
    }
});

export default Messages;
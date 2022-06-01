import React, { useState, useContext, useEffect, useRef } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    Pressable, 
    KeyboardAvoidingView, 
    Platform,
    Image,
    Alert,
    Keyboard
} from 'react-native';
import { useNavigation } from "@react-navigation/core";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { SocketContext } from '../context/socket';
import * as ImagePicker from "expo-image-picker";
import uuid from 'react-native-uuid';
import EmojiSelector from "react-native-emoji-selector";
import { Audio, AVPlaybackStatus } from "expo-av";
import AudioPlayer from "../AudioPlayer";
import { SimpleLineIcons, Feather, MaterialCommunityIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import { TypingAnimation } from "react-native-typing-animation";
import { API_URL } from 'react-native-dotenv'
const API = "https://checkpcs.com/api"
import { box } from "tweetnacl";
import {
  encrypt,
  getMySecretKey,
  stringToUint8Array,
} from "../../utils/crypto";


const MessageInput = ({ subChatRoomId, userChatRoomId, setMessage, IsCrypted, onReply, setOnReply, typing, setTyping, nameTyping }) => {
    const [content, setContent] = useState('');
    const [users, setUser] = useState();
    const [image, setImage] = useState(null);
    const [audio, setAudio] = useState(null);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [recording, setRecording] = useState(null);
    const socket = useContext(SocketContext);
    const navigation = useNavigation();
    useEffect(() => {
      
      fetchListUser();
    }, [])
    
    const onChange = (e)=>{
      setContent(e)
      
      if (e === "") {
        socket.emit('StopTyping', {subChatRoomId: subChatRoomId, userChatRoomId: userChatRoomId})
      }
      else {
        socket.emit('Typing', {subChatRoomId: subChatRoomId, userChatRoomId: userChatRoomId})
      }
    }
    useEffect(() => {
      (async () => {
        if (Platform.OS !== "web") {
          const libraryResponse =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          const photoResponse = await ImagePicker.requestCameraPermissionsAsync();
          await Audio.requestPermissionsAsync();
  
          if (
            libraryResponse.status !== "granted" ||
            photoResponse.status !== "granted"
          ) {
            alert("Sorry, we need camera roll permissions to make this work!");
          }
        }
      })();
    }, []);

    const fetchListUser = async () => {
      fetch(`${API}/SubChatRoom/list`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
              'credentials': 'include'
          },
          body: JSON.stringify({ subChatRoomId: subChatRoomId, userChatRoomId: userChatRoomId })
      })
      .then(async (res) => { 
          try {
              const jsonRes = await res.json();
              if (res.status !== 200) {
                console.log(jsonRes)
                
              } else {
                setUser(jsonRes)
              }
          } catch (err) {
              console.log(err);
          };
      })
      .catch(err => {
          console.log(err);
      });
    };
    

    const sendMessageToUser = async (user) => {
      // send message
      let error = false
      let encryptedMessage = content;
      if (IsCrypted) {
        const ourSecretKey = await getMySecretKey(navigation);
        if (!ourSecretKey) {
          console.log("error 99")
          return;
        }
        console.log(ourSecretKey)
        if (!user.publicKey) {
          error = true
          Alert.alert(
            "The user haven't set his keypair yet",
            "Until the user generates the keypair, you cannot securely send him messages"
          );
          
        }
        else {
          console.log("private key", user.publicKey);
        
          const sharedKey = box.before(
            stringToUint8Array(user.publicKey),
            ourSecretKey
          );
          console.log("shared key", sharedKey);
      
          encryptedMessage = encrypt(sharedKey, { content });
        }
    
        
      }
      
      const referenceId = onReply ? onReply[1].id : null
      if (!error) {
        try {
          await axios.post(`${API}/Message`, {
              content: encryptedMessage,
              image,
              audio,
              SubChatRoomId: subChatRoomId,
              forUserId: user.id,
              isCrypted: IsCrypted,
              UserChatRoomId: userChatRoomId,
              reference: referenceId
          }, {
            headers: {
              'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
              'credentials': 'include'
            }
          }).then(async (response) => { 
            const data = response.data
            
            setMessage(data)
            //console.log(data)
            
        });
        } catch (error) {
          alert(error);
        }

      }
    
    
  
      // updateLastMessage(newMessage);
    };

    const getBlob = async (uri: string ,name:string) => {
      const response = await fetch(uri);
      const data = await response.blob();
      return new File([data], name, {
        type: data.type || 'image/jpeg',
      });
    };

    async function startRecording() {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
  
        console.log("Starting recording..");
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
        console.log("Recording started");
      } catch (err) {
        console.error("Failed to start recording", err);
      }
    }
  
    async function stopRecording() {
      console.log("Stopping recording..");
      if (!recording) {
        return;
      }
  
      setRecording(null);
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
  
      const uri = recording.getURI();
      console.log("Recording stopped and stored at", uri);
      if (!uri) {
        return;
      }
      setAudio(uri);
    }
    
    const sendAudio = async () => {
      if (!audio) {
        return;
      }
      const uriParts = audio.split(".");
      const extenstion = uriParts[uriParts.length - 1];
      /*
      const blob = await getBlob(audio);
      const { key } = await Storage.put(`${uuidv4()}.${extenstion}`, blob, {
        progressCallback,
      });
      */
      // send message
      const referenceId = onReply ? onReply[1].id : null
      try {
        await axios.post(`${API}/Message`, {
            content,
            image,
            audio,
            SubChatRoomId: subChatRoomId,
            UserChatRoomId: userChatRoomId,
            reference: referenceId
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
            'credentials': 'include'
          }
        }).then(async (response) => { 
          const data = response.data
          
          setMessage(data)
          //console.log(data)
          
      });
      } catch (error) {
        alert(error);
      }
      
      resetFields();
      
    };


    const sendMessage = async () => {
        
        await Promise.all(
          users.map((user) => sendMessageToUser(user))
        );
        
        resetFields();
    }

    const resetFields = () => {
      setContent("");
      setIsEmojiPickerOpen(false);
      setImage(null);
      setProgress(0);
      setAudio(null);
      setOnReply()
    };


    const pickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
  
      if (!result.cancelled) {
        setImage(result.uri);
      }
    };


    const takePhoto = async () => {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
      });
  
      if (!result.cancelled) {
        setImage(result.uri);
      }
    };
    const progressCallback = (progress) => {
      setProgress(progress.loaded / progress.total);
    };
  
    const sendImage = async () => {
        if (!image) {
            return;
        }
        try {
          const referenceId = onReply ? onReply[1].id : null
          await axios.post(`${API}/Message`, {
              content,
              image,
              audio,
              SubChatRoomId: subChatRoomId,
              UserChatRoomId: userChatRoomId,
              reference: referenceId
          }, {
            headers: {
              'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
              'credentials': 'include'
            }
          }).then(async (response) => { 
            const data = response.data
            
            setMessage(data)
            //console.log(data)
            
        });
        } catch (error) {
          alert(error);
        }
        resetFields();

    }
    
    const onPlusClicked = () => {
        console.warn("On plus clicked");
    }

    const onPress = () => {
        socket.emit("StopTyping", {subChatRoomId: subChatRoomId, userChatRoomId: userChatRoomId})
        setTyping(false)
        if (content) {
            sendMessage();
        } else if (image) {
            sendImage()
        } else if (audio) {
            sendAudio();
        } else {
            onPlusClicked();
        }
    }

    return (
        <KeyboardAvoidingView 
            style={[styles.root, { height: isEmojiPickerOpen ? "50%" : "auto" }]} 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}
        >
            {typing && (
              <View
                style={{
                  backgroundColor: "#f2f2f2",
                  padding: 5,
                  flexDirection: "row",
                  alignSelf: "stretch",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  {/* <Text>{typing.user}</Text> */}
                  <Text>{nameTyping}<TypingAnimation dotMargin={3} style={{margin:0, paddingBottom:12}}/></Text>
                </View>
              </View>
            )}
            {onReply && (
              <View
                style={{
                  backgroundColor: "#f2f2f2",
                  padding: 5,
                  flexDirection: "row",
                  alignSelf: "stretch",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text>Reply to: {onReply[0]}</Text>
                </View>
                <Pressable onPress={() => setOnReply()}>
                  <AntDesign
                    name="close"
                    size={24}
                    color="black"
                    style={{ margin: 5 }}
                  />
                </Pressable>
              </View>
            )}
            {image && (
                <View style={styles.sendImageContainer}>
                    <Image
                        source={{ uri: image }}
                        style={{ width: 100, height: 100, borderRadius: 10 }}
                    />
                    <View
                        style={{
                            flex: 1,
                            justifyContent: "flex-start",
                            alignSelf: "flex-end",
                        }}
                    >
                        <View
                            style={{
                                height: 5,
                                borderRadius: 5,
                                backgroundColor: "#3777f0",
                                width: `${progress * 100}%`,
                            }}
                        />
                    </View>

                    <Pressable onPress={() => setImage(null)}>
                        <AntDesign
                            name="close"
                            size={24}
                            color="black"
                            style={{ margin: 5 }}
                        />
                    </Pressable>
                </View>
            )}
            {audio && <AudioPlayer soundURI={audio} />}
            <View style={styles.row}>
                <View style={styles.inputContainer}>
                    <Pressable
                        onPress={() =>
                            setIsEmojiPickerOpen((currentValue) => !currentValue)
                        }
                    >
                        <SimpleLineIcons
                            name="emotsmile"
                            size={24}
                            color="#595959"
                            style={styles.icon}
                        />
                    </Pressable>

                    <TextInput
                        style={styles.input}
                        value={content}
                        onChangeText={(content) => onChange(content)}
                        placeholder="Signal message..."
                    />

                    <Pressable onPress={pickImage}>
                        <Feather
                            name="image"
                            size={24}
                            color="#595959"
                            style={styles.icon}
                        />
                    </Pressable>

                    <Pressable onPress={takePhoto}>
                        <Feather
                            name="camera"
                            size={24}
                            color="#595959"
                            style={styles.icon}
                        />
                    </Pressable>
                    <Pressable onPressIn={startRecording} onPressOut={stopRecording}>
                        <MaterialCommunityIcons
                            name={recording ? "microphone" : "microphone-outline"}
                            size={24}
                            color={recording ? "red" : "#595959"}
                            style={styles.icon}
                        />
                    </Pressable>

                </View>

                <Pressable onPress={onPress} style={styles.buttonContainer}>
                    {content || image || audio ? (
                        <Ionicons name="send" size={18} color="white" />
                    ) : (
                        <AntDesign name="plus" size={24} color="white" />
                    )}
                </Pressable>
            </View>
            {isEmojiPickerOpen && (
                <EmojiSelector
                    onEmojiSelected={(emoji) =>
                      setContent((currentMessage) => currentMessage + emoji)
                    }
                    columns={8}
                />
            )}
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
  root: {
    padding: 10,
  },
  row: {
    flexDirection: "row",
  },
  inputContainer: {
    backgroundColor: "#f2f2f2",
    flex: 1,
    marginRight: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#dedede",
    alignItems: "center",
    flexDirection: "row",
    padding: 5,
  },
  input: {
    flex: 1,
    marginHorizontal: 5,
  },
  icon: {
    marginHorizontal: 5,
  },
  buttonContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#3777f0",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 35,
  },

  sendImageContainer: {
    flexDirection: "row",
    marginVertical: 10,
    alignSelf: "stretch",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 10,
  },
});
  
export default MessageInput
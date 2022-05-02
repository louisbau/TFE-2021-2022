import React, { useState, useContext, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    Pressable, 
    KeyboardAvoidingView, 
    Platform,
    Image
} from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { AppContext } from "../context/AppContext";
import * as ImagePicker from "expo-image-picker";
import uuid from 'react-native-uuid';
import EmojiSelector from "react-native-emoji-selector";

import { SimpleLineIcons, Feather, MaterialCommunityIcons, AntDesign, Ionicons } from '@expo/vector-icons';
import { API_URL } from "@env";

const MessageInput = ({ chatRoomId }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [audio, setAudio] = useState(null);
    const context = useContext(AppContext);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const [soundURI, setSoundURI] = useState(null);
    const [recording, setRecording] = useState(null);

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

    const getBlob = async (uri: string ,name:string) => {
      const response = await fetch(uri);
      const data = await response.blob();
      return new File([data], name, {
        type: data.type || 'image/jpeg',
      });
    };

    const sendMessage = async () => {
    // send message
        try {
            await axios.post(`${API_URL}/Message`, {
                content,
                image,
                audio,
                ChatRoomId: chatRoomId
            }, {
              headers: {
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
              }
            });
          } catch (error) {
            alert(error);
          }
        resetFields();
        context.readAll(chatRoomId)
        context.readMessage(chatRoomId)
        context.readGlobale()
    }

    const resetFields = () => {
      setContent("");
      setIsEmojiPickerOpen(false);
      setImage(null);
      setProgress(0);
      setSoundURI(null);
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
          await axios.post(`${API_URL}/Message`, {
              content,
              image,
              audio,
              ChatRoomId: chatRoomId
          }, {
            headers: {
              'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
            }
          });
        } catch (error) {
          alert(error);
        }
        resetFields();
        context.readAll(chatRoomId);
        context.readMessage(chatRoomId);
        context.readGlobale();

    }
    
    const onPlusClicked = () => {
        console.warn("On plus clicked");
    }

    const onPress = () => {
        if (content) {
            sendMessage();
        } else if (image) {
            sendImage()
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
                        onChangeText={setContent}
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

                </View>

                <Pressable onPress={onPress} style={styles.buttonContainer}>
                    {content || image || soundURI ? (
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
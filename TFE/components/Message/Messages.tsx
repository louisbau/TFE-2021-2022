import React, {useContext, useState}from 'react'
import { View, Text, StyleSheet,Image } from 'react-native'
import AudioPlayer from "../AudioPlayer";
import { useWindowDimensions } from "react-native";
import { AppContext } from '../context/AppContext';
const blue = "lightblue";
const green = "lightgreen";


const Messages = ({ message, user }) => {
    //console.log(user)
    const context = useContext(AppContext)
    //const user = context.userList && context.userList.find((x) => x.id === message.UserId)
    const isMe = context.UserId && message.UserId === context.UserId;
    // const [soundURI, setSoundURI] = useState(null);
    const { width } = useWindowDimensions();
    return (
        <View style={[styles.container, isMe ? styles.rightContainer : styles.leftContainer]}>
            
            <View style={[styles.container, isMe ? styles.rightMessageColor : styles.leftMessageColor]}>
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
                
                {!!message.content && (
                    <Text style={{ color: isMe ? 'black' : 'white'}}>
                        {message.content}
                    </Text>
                )}
            </View>
            <View>
                {user && <Image source={{ uri: user.imageUri }} style={styles.image} />}
                {user && <Text>{user.name}</Text>}
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
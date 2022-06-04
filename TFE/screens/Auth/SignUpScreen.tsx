import React, { useState } from "react";
import {  View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert, Modal, Pressable } from 'react-native';
import { API_URL } from 'react-native-dotenv'

import { useRoute, useNavigation } from '@react-navigation/core';
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
const API = "https://checkpcs.com/api"
import { WebView } from 'react-native-webview';
import Checkbox from 'expo-checkbox';
import Terms from "./Terms";
import Privacies from "./Privacies";


/**
 * Component that is used to allow the user to sign up in the application and to accepte terms
 */


export default function SignUp() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigation = useNavigation();
    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [isTerms, setIsTerms] = useState(true);

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const onLogin = () => {
        navigation.navigate('SignIn');
    }

    const terms = () => {
        setModalVisible1(!modalVisible1)
        setModalVisible(!modalVisible)
        
    }
    const policie = () => {
        setIsTerms(false)
        setModalVisible1(!modalVisible1)
        setModalVisible(!modalVisible)
    }

    const isConditionAccepte = () => {
        setToggleCheckBox(true)
        setModalVisible(!modalVisible)
        onSignUp()
    }
    const onSignUp = () => {
        
        if (password !== newPassword && password.length <= 9) {
            return Alert.alert('not same password ')
        }
        const payload = {
            email,
            name,
            password,
        };
        fetch(`${API}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'credentials': 'include'
            },
            body: JSON.stringify(payload),
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                
                if (res.status !== 200) {
                    setIsError(true);
                    setMessage(jsonRes.message);
                } else {
                    setIsError(false);
                    setMessage(jsonRes.message);
                    navigation.navigate('SignIn');
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    }

    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible1}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible1(!modalVisible1);
                }}
            >
                
                {isTerms ? <Terms /> : <Privacies />}
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible1(!modalVisible1)}
                >
                    <Text style={styles.textStyle}>Close</Text>
                </Pressable>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.row}>
                            <Text style={styles.text1}>By using our app you agree to our </Text>
                        </View>
                        <View style={styles.row}>
                            <TouchableOpacity onPress={() => terms()}>
                                <Text style={styles.link1}>Terms and Conditions</Text>
                            </TouchableOpacity>
                            <Text style={styles.text1}>and </Text>
                            <TouchableOpacity onPress={() => policie()}>
                                <Text style={styles.link1}>Privacy Policy</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.row}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => isConditionAccepte()}
                            >
                                <Text style={styles.textStyle}>Accept</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible1(!modalVisible1)}
                            >
                                <Text style={styles.textStyle}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <Image source={require('../../assets/images/opentalk_logo.jpg')} style={styles.image} />
            <Text style={styles.heading}>Create Account</Text>
            <CustomInput placeholder='Name' value={name} setValue={setName} secureTextEntry={false}/>
            <CustomInput placeholder='Email' value={email} setValue={setEmail} secureTextEntry={false}/>
            <CustomInput placeholder='Password' value={password} setValue={setPassword} secureTextEntry/>
            <CustomInput placeholder='Password again' value={newPassword} setValue={setNewPassword} secureTextEntry/>
            <CustomButton text={'SIGN UP'} onPress={() => setModalVisible(true)}/>
            <View style={styles.row}>
                <Text>Already have an account? </Text>
                <TouchableOpacity onPress={onLogin}>
                    <Text style={styles.link}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
        
    )
}

const styles = StyleSheet.create({
    container : {
        width: '100%',
        height: '100%',
        padding: 15,
        alignItems: 'center',
        marginTop: 50,
    },
    text: {
        fontWeight: 'bold',
        color: 'white'
    },
    heading: {
        fontSize: 40,
        fontWeight: 'bold',
        padding: 15,
        color: 'black',
        textAlign: 'center',
    },
    image: {
        width: 200,
        height: 100,
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        marginTop: 7,
    },
    link: {
        fontWeight: 'bold',
        //color: theme.colors.primary,
    },
    link1: {
        fontWeight: 'bold',
        fontSize: 10
        //color: theme.colors.primary,
    },
    text1: {
        fontSize: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      }
});
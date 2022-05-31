import React, { useContext, useEffect, useState} from 'react'

import { createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem, 
} from "@react-navigation/drawer";

import { ContactStackNavigator } from "./StackNavigator";
import TabNavigator from "./TabNavigator";
import UsersScreen from '../screens/UserScreen';
import HomeHeader from "./HomeHeader";
import * as SecureStore from 'expo-secure-store';
import { API_URL } from 'react-native-dotenv'
import {  View, Switch, Text, Image, useWindowDimensions, Pressable,TextInput,  Alert,Modal, StyleSheet } from 'react-native';
const API = API_URL
const Drawer = createDrawerNavigator();

import AsyncStorage from "@react-native-async-storage/async-storage";
import { PRIVATE_KEY } from '../utils/crypto';

const DrawerNavigator = ({ navigation, nav }) => {
    const [isEnabledTheme, setIsEnabledTheme] = useState(false);
    const toggleSwitchTheme = () => setIsEnabledTheme(previousState => !previousState);
    const [isEnabledDispo, setIsEnabledDispo] = useState(false);
    const toggleSwitchDispo = () => setIsEnabledDispo(previousState => !previousState);
    const [user, setUser] = useState()
    
    const logout = (props) => {
        SecureStore.deleteItemAsync('token')
        AsyncStorage.removeItem(PRIVATE_KEY)
        props.navigation.navigate('SignIn')
    }
    useEffect(() => {
        fetchUser();
    }, [])
    const fetchUser = async () => {
        fetch(`${API}/card`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`,
                'credentials': 'include'
            }
        })
        .then(async (res) => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                  setUser(jsonRes)
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
    return (
        <Drawer.Navigator
            useLegacyImplementation
            drawerContent={props => {
                return (
                <DrawerContentScrollView {...props} style={{top: 0, bottom: 0, padding:10}}>
                    {user && <DrawerItem style={{padding:10}} labelStyle={{fontSize: 18, color:'black'}} label={"User : "+user.name} onPress={() => props.navigation.navigate("User")} />}
                    {user && <DrawerItem style={{padding:10}} labelStyle={{fontSize: 18, color:'black'}} label="Friend" onPress={() => props.navigation.navigate("Friend")} />}
                    {user && <DrawerItem style={{padding:10}} labelStyle={{fontSize: 18, color:'black'}} label="Settings" onPress={() => props.navigation.navigate("Setting")} />}
                    {user && <DrawerItem style={{padding:10}} labelStyle={{fontSize: 18, color:'black'}} label="Agenda" onPress={() => props.navigation.navigate("Agenda")} />}
                    {user && <DrawerItem style={{padding:10}} labelStyle={{fontSize: 18, color:'black'}} label="Sign out" onPress={()=>logout(props)} />}
                    {/* <View style={{ 
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isEnabledDispo ? "#f5dd4b" : "#f4f3f4"}
                            onValueChange={toggleSwitchDispo}
                            value={isEnabledDispo}
                        />
                        <Text>
                            {isEnabledDispo ? ': Disponible' : '  : Indisponible'} COMMING SOON
                        </Text>
                    </View> */}
                    
                    
                </DrawerContentScrollView>
                )
            }}
        >
            <Drawer.Screen name="Tab" component={TabNavigator} options={{headerTitle: () => <HomeHeader nav={nav}/>}}/>
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
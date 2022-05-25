import React, { useEffect, useState} from 'react'

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
import { API_URL } from "@env";
import {  View, Switch, Text, Image, useWindowDimensions, Pressable,TextInput,  Alert,Modal, StyleSheet } from 'react-native';
const API = API_URL
const Drawer = createDrawerNavigator();



const DrawerNavigator = ({ navigation, nav }) => {
    const [isEnabledTheme, setIsEnabledTheme] = useState(false);
    const toggleSwitchTheme = () => setIsEnabledTheme(previousState => !previousState);
    const [isEnabledDispo, setIsEnabledDispo] = useState(false);
    const toggleSwitchDispo = () => setIsEnabledDispo(previousState => !previousState);
    const [user, setUser] = useState()
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
                <DrawerContentScrollView {...props}>
                    {user && <DrawerItem label={user.name} onPress={() => props.navigation.navigate("User")} />}
                    <View style={{ 
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Text>
                            {isEnabledDispo ? 'Disponible : ' : 'Indisponible : '}
                        </Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isEnabledDispo ? "#f5dd4b" : "#f4f3f4"}
                            onValueChange={toggleSwitchDispo}
                            value={isEnabledDispo}
                        />
                    </View>
                    <View style={{ 
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Text>
                            {isEnabledTheme ? 'White : ' : 'Black : '}
                        </Text>
                        <Switch
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={isEnabledTheme ? "#f5dd4b" : "#f4f3f4"}
                            onValueChange={toggleSwitchTheme}
                            value={isEnabledTheme}
                        />
                    </View>
                    {user && <DrawerItem label="SignIn" onPress={() => props.navigation.navigate("SignIn")} />}
                    
                    
                </DrawerContentScrollView>
                )
            }}
        >
            <Drawer.Screen name="Tab" component={TabNavigator} options={{headerTitle: () => <HomeHeader nav={nav}/>}}/>
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
import React, {useState, useEffect, useContext} from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ChatRoomScreen from '../screens/ChatRoomScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatRoomHeader from './ChatRoomHeader';
import * as SecureStore from 'expo-secure-store';
import ChatGroupScreen from '../screens/ChatGroupScreen';
import ChatGroupHeader from './ChatGroupHeader';

import SignIn from '../screens/Auth/SignInScreen';
import SignUp from '../screens/Auth/SignUpScreen';
import ForgotPassword from '../screens/Auth/ForgotPasswordScreen';
import ResetPassword from '../screens/Auth/ResetPasswordScreen';
import DrawerNavigator from "./DrawerNavigator";
import TabNavigator from "./TabNavigator";
import UsersScreen from "../screens/UserScreen";
import FriendsScreen from "../screens/FriendsScreen";
import FriendHeader from "./FriendHeader";
//import CallScreen from "../screens/CallScreen";
import Settings from "../screens/Settings";
import AgendaScreen from "../screens/AgendaScreen";
import Terms from "../screens/Auth/Terms";
import Privacies from "../screens/Auth/Privacies";
import OtherUserScreen from "../screens/OtherUserSceen";

const Stack = createStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#9AC4F8",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
};



const MainStackNavigator = ({ nav }) => {
    return (
        <Stack.Navigator screenOptions={screenOptionStyle}>
            <>
                <Stack.Group screenOptions={{ headerShown: false }}>
                    <Stack.Screen 
                        name="SignIn" 
                        component={SignIn} 
                    />
                    <Stack.Screen 
                        name="SignUp" 
                        component={SignUp} 
                    />
                    <Stack.Screen 
                        name="ForgotPassword" 
                        component={ForgotPassword} 
                    />
                    <Stack.Screen 
                        name="ResetPassword" 
                        component={ResetPassword} 
                    />
                </Stack.Group>
                <Stack.Group>
                    <Stack.Screen 
                        name="Home" 
                        component={DrawerNavigator}
                        options={{headerShown: false}}
                    />
                    <Stack.Screen 
                        name="ChatRoom" 
                        component={ChatRoomScreen}         
                        options={({ route }) => ({
                            headerTitle: () => <ChatRoomHeader id={route.params?.id} chat={route.params?.chat} />,
                            headerBackTitleVisible: false,
                        })}
                    /> 
                    <Stack.Screen 
                        name="ChatGroup" 
                        component={ChatGroupScreen}         
                        options={({ route }) => ({
                            headerTitle: () => <ChatGroupHeader id={route.params?.id} group={route.params?.chat} />,
                            headerBackTitleVisible: false,
                        })}
                    /> 
                    
                </Stack.Group>
                <Stack.Screen 
                    name="User" 
                    component={UsersScreen}
                />
                <Stack.Screen 
                    name="Friend" 
                    component={FriendsScreen}
                    options={() => ({
                        headerTitle: () => <FriendHeader />
                    })}
                />
                {/* <Stack.Screen name="Call" component={CallScreen} /> */}
                <Stack.Screen name="Setting" component={Settings} />
                <Stack.Screen name="Agenda" component={AgendaScreen} />
                <Stack.Screen name="Terms" component={Terms} />
                <Stack.Screen name="Privacies" component={Privacies} />
                <Stack.Screen name="OtherUser" component={OtherUserScreen} />
            </>
                
                 
            
        </Stack.Navigator>
    );
};



export { MainStackNavigator };
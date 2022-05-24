import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ChatRoomScreen from '../screens/ChatRoomScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatRoomHeader from './ChatRoomHeader';

import ChatGroupScreen from '../screens/ChatGroupScreen';
import ChatGroupHeader from './ChatGroupHeader';

import SignIn from '../screens/Auth/SignInScreen';
import SignUp from '../screens/Auth/SignUpScreen';
import ForgotPassword from '../screens/Auth/ForgotPasswordScreen';
import ResetPassword from '../screens/Auth/ResetPasswordScreen';
import DrawerNavigator from "./DrawerNavigator";

const Stack = createStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#9AC4F8",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
};


const MainStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={screenOptionStyle}>
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
        </Stack.Navigator>
    );
};

const ContactStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Contact" component={Contact} />
    </Stack.Navigator>
  );
};

export { MainStackNavigator, ContactStackNavigator };
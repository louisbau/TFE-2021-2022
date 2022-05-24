

import { NavigationContainer, DefaultTheme, DarkTheme, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import { ColorSchemeName, StyleSheet } from 'react-native';
import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import ChatRoomScreen from '../screens/ChatRoomScreen';
import HomeScreen from '../screens/HomeScreen';
import SignIn from '../screens/Auth/SignInScreen';
import SignUp from '../screens/Auth/SignUpScreen';
import ForgotPassword from '../screens/Auth/ForgotPasswordScreen';
import ResetPassword from '../screens/Auth/ResetPasswordScreen';
import ChatRoomHeader from './ChatRoomHeader';
import GroupScreen from '../screens/GroupScreen';
import ChatGroupScreen from '../screens/ChatGroupScreen';

import ChatGroupHeader from './ChatGroupHeader';
import HomeHeader from './HomeHeader';
import UsersScreen from '../screens/UserScreen';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ?  DefaultTheme : DarkTheme}>
      <RootNavigator />
      
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function Home() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ headerTitle: () => <HomeHeader /> }}/>
      <Tab.Screen name="GroupScreen" component={GroupScreen} options={{ headerTitle: () => <HomeHeader /> }}/>
    </Tab.Navigator>
  );
}




function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="User" component={UsersScreen} />
    </Drawer.Navigator>
  );
}


function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Group>
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
          component={Home}
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
      
      
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      
    </Stack.Navigator>
  );
}




const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0
  },
  modalView: {
    width: "100%",
    height: "95%",
    marginTop: "30%",
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 30,
    padding: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});


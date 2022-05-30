import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import GroupScreen from '../screens/GroupScreen';
import { MainStackNavigator, ContactStackNavigator } from './StackNavigator'
import UsersScreen from '../screens/UserScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Feather } from '@expo/vector-icons'; 
const Tab = createBottomTabNavigator();
import { ImageBackground, View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';


const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabel: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeScreen') {
            iconName = "Chats"
          } else if (route.name === 'GroupScreen') {
            iconName = "Groups"
          }

          // You can return any component that you like here!
          return <Text>{iconName}</Text>;
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeScreen') {
            iconName = focused
              ? 'message-square'
              : 'message-square';
          } else if (route.name === 'GroupScreen') {
            iconName = focused ? 'users' : 'users';
          }

          // You can return any component that you like here!
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
        <Tab.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}}/>
        <Tab.Screen name="GroupScreen" component={GroupScreen} options={{headerShown: false}}/>
    </Tab.Navigator>
  );
}

export default BottomTabNavigator
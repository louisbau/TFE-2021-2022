import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import GroupScreen from '../screens/GroupScreen';
import { MainStackNavigator, ContactStackNavigator } from './StackNavigator'

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
        <Tab.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}}/>
        <Tab.Screen name="GroupScreen" component={GroupScreen} options={{headerShown: false}}/>
    </Tab.Navigator>
  );
}

export default BottomTabNavigator
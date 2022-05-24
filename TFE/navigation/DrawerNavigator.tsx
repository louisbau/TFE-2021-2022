import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import { ContactStackNavigator } from "./StackNavigator";
import TabNavigator from "./TabNavigator";
import UsersScreen from '../screens/UserScreen';
import HomeHeader from "./HomeHeader";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="User" component={TabNavigator} options={{headerTitle: () => <HomeHeader />}}/>
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
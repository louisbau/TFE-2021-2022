

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, {useContext} from 'react'
import { ColorSchemeName, View, Text, Image, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons'; 

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

import ChatRoomScreen from '../screens/ChatRoomScreen';
import HomeScreen from '../screens/HomeScreen';
import SignIn from '../screens/Auth/SignInScreen';
import SignUp from '../screens/Auth/SignUpScreen';
import ForgotPassword from '../screens/Auth/ForgotPasswordScreen';
import ResetPassword from '../screens/Auth/ResetPasswordScreen';
import UsersScreen from '../screens/UserScreen';
import ChatRoomHeader from './ChatRoomHeader';
import { AppContext } from '../components/context/AppContext';

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
          component={HomeScreen} 
          options={{ headerTitle: HomeHeader }} 
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
          name="UsersScreen" 
          component={UsersScreen}         
          options={{ 
            headerBackTitleVisible: false,
          }} 
        />
      </Stack.Group>
      
      
      
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      
    </Stack.Navigator>
  );
}


const HomeHeader = (props) => {
  const { width } = useWindowDimensions();
  const context = useContext(AppContext);
  return (
    <View style={{ 
      flexDirection: 'row',
      justifyContent: 'space-between', 
      width,
      padding: 10,
      alignItems: 'center',
    }}>
      {context.user.imageUri && <Image 
        source={{ uri: context.user.imageUri}}
        style={{ width: 30, height: 30, borderRadius: 30}}
      />}
      <Text style={{flex: 1, textAlign: 'center', marginLeft: 50, fontWeight: 'bold', color: 'black'}}>TFE</Text>
      <Feather name="camera" size={24} color="black" style={{ marginHorizontal: 10}} />
      <Feather name="edit-2" size={24} color="black" style={{ marginHorizontal: 10}} />
    </View>
  )
};


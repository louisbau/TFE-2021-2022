import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import React, { createRef } from 'react'
import { MainStackNavigator } from './navigation/StackNavigator';
import DrawerNavigator from './navigation/DrawerNavigator';
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const navigationRef = createRef()
  const nav = () => navigationRef.current

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      // <SafeAreaProvider>
      //   <AppContextProvider>
      //     <Navigation colorScheme={colorScheme} />
      //   </AppContextProvider>
      //   <StatusBar />
      // </SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <MainStackNavigator nav={nav}/>
      </NavigationContainer>

    );
  }
}

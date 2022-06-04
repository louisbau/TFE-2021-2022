import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { getRandomBytes }from 'expo-random';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import React, { createRef } from 'react'
import { MainStackNavigator } from './navigation/StackNavigator';
import DrawerNavigator from './navigation/DrawerNavigator';
import { NavigationContainer } from "@react-navigation/native";
import { box } from "tweetnacl";
import { generateKeyPair, encrypt, decrypt } from "./utils/crypto";
import { SocketContext, socket } from './components/context/socket';


// const obj = { hello: "world" };
// const pairA = generateKeyPair();
// const pairB = generateKeyPair();

// const sharedA = box.before(pairB.publicKey, pairA.secretKey);
// const encrypted = encrypt(sharedA, obj);

// const sharedB = box.before(pairA.publicKey, pairB.secretKey);
// const decrypted = decrypt(sharedB, encrypted);
// console.log(obj, sharedA, encrypted, decrypted);
/**
 * this is the main component 
 */

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
      <SocketContext.Provider value={socket}>
        <NavigationContainer ref={navigationRef}>
          <MainStackNavigator nav={nav}/>
        </NavigationContainer>
      </SocketContext.Provider>
      

    );
  }
}

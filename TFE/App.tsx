import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { MainStackNavigator } from './navigation/StackNavigator';
import DrawerNavigator from './navigation/DrawerNavigator';
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

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
      <NavigationContainer>
        <MainStackNavigator />
      </NavigationContainer>

    );
  }
}

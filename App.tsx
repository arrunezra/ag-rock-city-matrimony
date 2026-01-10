/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

 
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
//import { GluestackUIProvider } from "@gluestack-ui/themed";
import '@/global.css';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
 import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
 import { KeyboardProvider } from "react-native-keyboard-controller";
import { ThemeProvider } from './components/ui/ThemeProvider/ThemeProvider';

function App() {
  
  return (
    
    // <GluestackUIProvider mode="dark">
    //   <SafeAreaProvider>
    //   <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
    //   <AppContent />
    // </SafeAreaProvider>
    // </GluestackUIProvider>
         <ThemeProvider>
          <SafeAreaProvider>
            <KeyboardProvider>
               <AuthProvider>
                  <AppNavigator />
              </AuthProvider>
            </KeyboardProvider>
          </SafeAreaProvider>
        </ThemeProvider>
   
  );
}

 

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

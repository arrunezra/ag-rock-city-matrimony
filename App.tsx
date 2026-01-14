/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */



import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { Pressable, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ThemeProvider } from './components/ui/ThemeProvider/ThemeProvider';
import { useEffect, useState } from 'react';
import { PermissionTypes, requestPermission } from './src/utils/permissionHandler';
import { openSettings } from 'react-native-permissions';

function App() {
  const [isAllPermissionGranted, setIsAllPermissionGranted] = useState(false);
  useEffect(() => {
    const checkPermission = async () => {
      const storagePermission = await requestPermission(PermissionTypes.STORAGE);
      const cameraPermission = await requestPermission(PermissionTypes.CAMERA);
      setIsAllPermissionGranted(storagePermission && cameraPermission);
    };
    checkPermission();
  }, [])
  return (

    // <GluestackUIProvider mode="dark">
    //   <SafeAreaProvider>
    //   <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
    //   <AppContent />
    // </SafeAreaProvider>
    // </GluestackUIProvider>

    // <Text style={{ fontSize: 20, color: 'red' }}>App</Text>
    <ThemeProvider>
      <SafeAreaProvider>
        <KeyboardProvider>
          <AuthProvider>
            {isAllPermissionGranted ? <AppNavigator /> : <Pressable onPress={() => openSettings()}> <Text style={{
              fontSize: 20, color: 'red', textAlign: 'center',
              marginTop: 200
            }}>Permission Not Granted</Text></Pressable>}
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

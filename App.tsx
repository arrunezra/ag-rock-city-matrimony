/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */



import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import { ActivityIndicator, Pressable, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
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
import { AlertProvider } from './src/context/AlertContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LookupProvider } from './src/context/LookupContext';

function App() {
  const [isAllPermissionGranted, setIsAllPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkPermission = async () => {
      const storagePermission = await requestPermission(PermissionTypes.STORAGE);
      const cameraPermission = await requestPermission(PermissionTypes.CAMERA);
      setIsAllPermissionGranted(storagePermission && cameraPermission);
      setLoading(false);
    };
    checkPermission();
  }, [])
  if (loading) {
    return (
      <View  >
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  return (

    // <GluestackUIProvider mode="dark">
    //   <SafeAreaProvider>
    //   <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
    //   <AppContent />
    // </SafeAreaProvider>
    // </GluestackUIProvider>

    // <Text style={{ fontSize: 20, color: 'red' }}>App</Text>
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <KeyboardProvider>
            <AuthProvider>
              <AlertProvider>
                <LookupProvider>
                  {isAllPermissionGranted ? <AppNavigator /> : <Pressable onPress={() => openSettings()}> <Text style={{
                    fontSize: 20, color: 'red', textAlign: 'center',
                    marginTop: 200
                  }}>Permission Not Granted</Text></Pressable>}
                </LookupProvider>
              </AlertProvider>
            </AuthProvider>
          </KeyboardProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>

  );
}



const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, backgroundColor: '#fff' },
  errorText: { fontSize: 18, textAlign: 'center', color: '#1A1A1A', marginBottom: 24, fontWeight: '500' },
  button: { backgroundColor: '#007AFF', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});

export default App;

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import {
  Box,
  Center,
  VStack,
  Text,
  Spinner,
  HStack
} from '@/src/components/common/GluestackUI';

export default function LoadingScreen() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance Fade
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Infinite Heartbeat Pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Box className="absolute inset-0 z-[200] flex-1 bg-black/40">
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <Center className="flex-1">

          {/* Main Modal Container */}
          <Box
            className="bg-background-0 p-10 rounded-[40px] shadow-2xl border border-outline-100"
            style={styles.modalShadow}
          >
            <VStack className="items-center gap-6">

              {/* Animated Loader Section */}
              <Box className="relative items-center justify-center">
                <Animated.View
                  style={{
                    transform: [{ scale: pulseAnim }],
                    opacity: 0.15,
                    position: 'absolute',
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: '#dc2626', // Your primary red
                  }}
                />
                <Box className="bg-background-50 p-5 rounded-full shadow-sm border border-outline-50">
                  <Spinner size="large" className="text-primary-600" />
                </Box>
              </Box>

              {/* Minimalist Text */}
              <VStack className="items-center gap-1">
                <Text className="text-xl font-bold text-typography-900 tracking-tight">
                  Processing
                </Text>
                <HStack className="items-center gap-1">
                  <Box className="w-1 h-1 rounded-full bg-primary-500" />
                  <Text className="text-xs text-typography-500 font-medium uppercase tracking-[2px]">
                    Please wait
                  </Text>
                  <Box className="w-1 h-1 rounded-full bg-primary-500" />
                </HStack>
              </VStack>

            </VStack>
          </Box>
        </Center>
      </Animated.View>
    </Box>
  );
}

const styles = StyleSheet.create({
  modalShadow: {
    // Native Elevation for Android, Shadow props for iOS
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
});
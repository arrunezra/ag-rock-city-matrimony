import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { Box, VStack, Heading, Text, Button, ButtonText, Center } from '@/src/components/common/GluestackUI';
import { Animated, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { RefreshCw } from 'lucide-react-native';

interface FailedScreenProps {
    title?: string;
    description?: string;
    onRetry?: () => void; // Renamed from onReset for clarity
    buttonText?: string;
    onPress?: () => void;
}


interface FailedScreenProps {
    isVisible?: boolean;
    title?: string;
    description?: string;
    onRetry?: () => void;
    buttonText?: string;
    onPress?: () => void;
}

export default function FailedScreen({
    isVisible,
    title = "Oops! Something went wrong",
    description = '',//"We're having trouble connecting to the server. Please check your internet and try again.",
    onRetry,
    buttonText = "Try Again"
}: FailedScreenProps) {

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        if (isVisible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            fadeAnim.setValue(0);
        }
    }, [isVisible]);
    if (!isVisible) return null;

    return (
        <Box className="flex-1 absolute inset-0 z-[100]">
            {/* 1. Warning Gradient Background */}
            <LinearGradient
                colors={['#ef4444', '#7f1d1d', '#1e1b4b']} // Red-500 -> Dark Red -> Deep Indigo/Black
                locations={[0, 0.5, 1]}
                style={{ flex: 1 }}
            >
                <Center className="flex-1 px-8">
                    <Animated.View
                        style={{
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                            width: '100%',
                            alignItems: 'center'
                        }}
                    >
                        <VStack space="xl" className="items-center w-full">

                            {/* 2. Lottie Error Animation */}
                            <Box className="w-72 h-72">
                                <LottieView
                                    source={require('../../assets/animations/failed.json')}
                                    autoPlay
                                    loop={true}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            </Box>

                            {/* 3. Text Content with Glassmorphism */}
                            <VStack space="md" className="items-center">
                                <Heading size="xl" className="text-center text-white font-extraBold tracking-tight">
                                    {title}
                                </Heading>

                                {description && <Box className="bg-black/20 p-5 rounded-3xl border border-white/10">
                                    <Text className="text-center text-red-100 text-md leading-6">
                                        {description}
                                    </Text>
                                </Box>}
                            </VStack>

                            {/* 4. Retry Button */}
                            {onRetry && (
                                <Button
                                    size="xl"
                                    onPress={onRetry}
                                    className="bg-white hover:bg-red-50 rounded-2xl w-full h-16 mt-6 shadow-2xl active:scale-95 transition-all"
                                >
                                    <Box className="flex-row items-center justify-center">
                                        <RefreshCw size={20} color="#dc2626" className="mr-2" />
                                        <ButtonText className="font-bold text-red-600 text-lg">
                                            {buttonText}
                                        </ButtonText>
                                    </Box>
                                </Button>
                            )}

                            {/* Back to Home / Cancel Option */}
                            <TouchableOpacity className="mt-4 py-2">
                                <Text className="text-white/60 font-medium">Go back to previous screen</Text>
                            </TouchableOpacity>

                        </VStack>
                    </Animated.View>
                </Center>
            </LinearGradient>
        </Box>
    );
}
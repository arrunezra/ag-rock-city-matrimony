import React from 'react';
import LottieView from 'lottie-react-native';
import { Box, VStack, Heading, Text, Button, ButtonText } from '@/src/components/common/GluestackUI';

interface FailedScreenProps {
    title?: string;
    description?: string;
    onRetry?: () => void; // Renamed from onReset for clarity
    buttonText?: string;
}

export default function FailedScreen({
    title = "Oops! Something went wrong",
    description = "We're having trouble connecting to the server. Please check your internet and try again.",
    onRetry,
    buttonText = "Try Again"
}: FailedScreenProps) {
    return (
        <Box className="flex-1 bg-white justify-center px-6">
            <VStack className="items-center gap-6">
                {/* Lottie Animation - Use an error or connection-lost json */}
                <Box className="w-64 h-64">
                    <LottieView
                        source={require('../../assets/animations/failed.json')}
                        autoPlay
                        loop={false} // Error animations usually look better played once
                        style={{ width: '100%', height: '100%' }}
                    />
                </Box>

                <VStack className="items-center gap-2">
                    <Heading size="xl" className="text-center text-red-600">
                        {title}
                    </Heading>
                    <Text className="text-center text-typography-500 text-md px-4">
                        {description}
                    </Text>
                </VStack>

                {onRetry && (
                    <Button
                        size="lg"
                        className="bg-red-500 hover:bg-red-600 rounded-full w-full h-14 mt-8 shadow-md"
                        onPress={onRetry}
                    >
                        <ButtonText className="font-bold text-lg text-white">
                            {buttonText}
                        </ButtonText>
                    </Button>
                )}
            </VStack>
        </Box>
    );
}
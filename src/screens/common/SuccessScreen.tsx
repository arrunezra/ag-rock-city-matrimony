import React from 'react';
import LottieView from 'lottie-react-native';
import { Box, VStack, Heading, Text, Button, ButtonText } from '@/src/components/common/GluestackUI';

export default function SuccessScreen({ onDone }: { onDone: () => void }) {
  return (
    <Box className="flex-1 bg-white justify-center px-6">
      <VStack className="items-center gap-6">
        {/* Lottie Animation */}
        <Box className="w-64 h-64">
          <LottieView
            source={require('../../assets/animations/success.json')}
            autoPlay
            loop={false}
            style={{ width: '100%', height: '100%' }}
          />
        </Box>

        <VStack className="items-center gap-2">
          <Heading size="2xl" className="text-center text-typography-900">
            All Set!
          </Heading>
          <Text className="text-center text-typography-500 text-lg">
            Your profile has been created. Your perfect match is just a click away.
          </Text>
        </VStack>

        <Button 
          size="lg" 
          className="bg-cyan-500 rounded-full w-full h-14 mt-8" 
          onPress={onDone}
        >
          <ButtonText className="font-bold text-xl">Go to Home</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}
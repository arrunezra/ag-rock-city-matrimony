import React, { useEffect, useState } from 'react';
import { Actionsheet, ActionsheetBackdrop, ActionsheetContent, ActionsheetDragIndicator, ActionsheetDragIndicatorWrapper, Box, Button, ButtonText, Center, Divider, Heading, HStack, Input, InputField, Select, SelectInput, SelectTrigger, Text, VStack } from '@/src/components/common/GluestackUI';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export const SearchActionsheet = ({ isOpen, onClose, initialFilters, onApply }: any) => {

    // 1. Use ONLY ONE state for the age range to keep things in sync
    const [ageRange, setAgeRange] = useState([
        initialFilters?.min_age || 21,
        initialFilters?.max_age || 35
    ]);

    // 2. Sync state if initialFilters changes (optional but good practice)
    useEffect(() => {
        if (isOpen) {
            setAgeRange([initialFilters.min_age, initialFilters.max_age]);
        }
    }, [isOpen]);

    // Handler for manual typing
    const handleManualInput = (val: string, index: number) => {
        const num = parseInt(val, 10);
        const newRange = [...ageRange];

        if (!isNaN(num)) {
            newRange[index] = num;
            setAgeRange(newRange);
        } else if (val === '') {
            newRange[index] = 0; // Allow clearing the input temporarily
            setAgeRange(newRange);
        }
    };
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);
    // Inside your component:
    const shakeOffset = useSharedValue(0);

    const triggerShake = () => {
        // Moves left and right quickly 5 times
        shakeOffset.value = withSequence(
            withTiming(-10, { duration: 50 }),
            withRepeat(withTiming(10, { duration: 50 }), 5, true),
            withTiming(0, { duration: 50 })
        );
    };

    const animatedShakeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shakeOffset.value }],
    }));

    return (
        <Actionsheet isOpen={isOpen} onClose={onClose}>
            <ActionsheetBackdrop />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ width: '100%' }}
            >
                <ActionsheetContent className="pb-8">
                    <ActionsheetDragIndicatorWrapper><ActionsheetDragIndicator /></ActionsheetDragIndicatorWrapper>

                    <ScrollView className="w-full" contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
                        <VStack space="xl">
                            <Heading size="lg">Personalize your search</Heading>

                            <VStack space="md">
                                <HStack className="justify-between items-center">
                                    <Text className="font-bold text-typography-500 text-lg">Age Range</Text>

                                    <VStack className='items-end'>
                                        {/* 2. The "Done" Button: Appears only when typing */}
                                        {isKeyboardVisible && (
                                            <Pressable onPress={() => Keyboard.dismiss()} className="pb-2">
                                                <Text className="text-cyan-600 font-bold text-sm">DONE</Text>
                                            </Pressable>
                                        )}



                                        <Animated.View style={animatedShakeStyle}>
                                            <HStack space="sm" className="items-center">
                                                <Input
                                                    className={`w-20 h-12 rounded-xl bg-background-50 ${ageRange[0] < 18 ? 'border-red-500' : 'border-outline-200'}`}
                                                >
                                                    <InputField
                                                        keyboardType="number-pad"
                                                        value={ageRange[0].toString()}
                                                        onChangeText={(t) => {
                                                            const val = parseInt(t) || 0;
                                                            if (val > 0 && val < 18) triggerShake(); // Trigger shake if too young
                                                            setAgeRange([val, ageRange[1]]);
                                                        }}
                                                    />
                                                </Input>
                                                <Text>-</Text>
                                                <Input className="w-20 h-12 rounded-xl">
                                                    <InputField
                                                        className="text-center font-bold text-cyan-600"
                                                        keyboardType="number-pad"
                                                        value={ageRange[1].toString()}
                                                        onChangeText={(t) => setAgeRange([ageRange[0], parseInt(t) || 0])}
                                                    />
                                                </Input>
                                            </HStack>
                                        </Animated.View>
                                    </VStack>
                                </HStack>

                                <Divider />

                                {/* 2. Marital Status & Children */}
                                <VStack space="md">
                                    <Text className="font-bold text-typography-500">Status</Text>
                                    <HStack space="xs" className="flex-wrap">
                                        {['Never Married', 'Divorced', 'Widowed'].map((status) => (
                                            <Pressable key={status} className="px-4 py-2 rounded-full border border-outline-200 bg-background-50">
                                                <Text size="sm">{status}</Text>
                                            </Pressable>
                                        ))}
                                    </HStack>
                                    <HStack className="items-center justify-between">
                                        <Text size="sm">Has Children?</Text>
                                        <HStack space="md">
                                            <Pressable><Text className="text-cyan-600 font-bold">Yes</Text></Pressable>
                                            <Pressable><Text className="text-typography-500">No</Text></Pressable>
                                        </HStack>
                                    </HStack>
                                </VStack>

                                <Divider />

                                {/* 3. Religion & Community */}
                                <VStack space="md">
                                    <Text className="font-bold text-typography-500">Background</Text>
                                    <HStack space="md">
                                        <VStack className="flex-1" space="xs">
                                            <Text size="xs" className="pl-1">Religion</Text>
                                            <Select><SelectTrigger className="h-11 rounded-lg"><SelectInput placeholder="Hindu" /></SelectTrigger></Select>
                                        </VStack>
                                        <VStack className="flex-1" space="xs">
                                            <Text size="xs" className="pl-1">Mother Tongue</Text>
                                            <Select><SelectTrigger className="h-11 rounded-lg"><SelectInput placeholder="Tamil" /></SelectTrigger></Select>
                                        </VStack>
                                    </HStack>
                                    <Input className="h-11 rounded-lg"><InputField placeholder="Search Community/Caste" /></Input>
                                    <Input className="h-11 rounded-lg"><InputField placeholder="Enter City" /></Input>
                                </VStack>
                            </VStack>

                            <Button
                                className="w-full rounded-2xl h-14 bg-cyan-500 shadow-lg"
                                onPress={() => onApply({ min_age: ageRange[0], max_age: ageRange[1] })}
                            >
                                <ButtonText className="text-white font-bold text-lg">Search Now</ButtonText>
                            </Button>
                        </VStack>
                    </ScrollView>
                </ActionsheetContent>
            </KeyboardAvoidingView>
        </Actionsheet>
    );
};
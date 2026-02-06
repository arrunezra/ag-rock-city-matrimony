import React from 'react';
import { Box, VStack, HStack, Text, Heading, Avatar, AvatarImage, AvatarFallbackText } from '@/src/components/common/GluestackUI';
import { Pressable } from 'react-native';
import { AddIcon, CheckIcon, EditIcon, Icon, StarIcon } from '@/components/ui/icon';
import { API_BASE_URL_DEV_Profiles_Thumbs } from '@/src/utils/environment';

const UserTopProfile = ({ profile, onEdit, onAddPhoto }: any) => {
    const profileImage = API_BASE_URL_DEV_Profiles_Thumbs + '/' + profile?.profileThumb;
    console.log('profileImage', profileImage);
    return (
        <VStack className="px-4 py-6 bg-white gap-6">
            {/* 1. Header Info: Avatar + Identity */}
            <HStack space="md" className="items-center">
                {/* Avatar with Overlay Plus/Edit Button */}
                {/* Avatar with Overlay */}
                <Box className="relative">
                    <Avatar size="xl" className="border-2 border-outline-100 bg-background-200 " >
                        <AvatarFallbackText> {profile?.firstName} {profile?.lastName}</AvatarFallbackText>
                        <AvatarImage
                            source={{
                                uri: profileImage,
                            }}
                        />
                        <Pressable
                            onPress={onAddPhoto}
                            className="absolute bottom-0 right-0 bg-cyan-500 p-1.5 rounded-full border-2 border-white shadow-sm active:opacity-80"
                        >
                            <Icon as={AddIcon} color="white" size="xs" />
                        </Pressable>
                    </Avatar>

                </Box>

                {/* User Identity */}
                <VStack className="flex-1">
                    <HStack className="items-center gap-1">
                        <Heading size="lg" className="text-typography-900">
                            {profile?.firstName} {profile?.lastName}
                        </Heading>
                        {/* Verified/Blue Tick */}
                        <Box className="bg-blue-500 rounded-full p-0.5">
                            <Icon as={CheckIcon} size="2xs" color="white" />
                        </Box>
                    </HStack>
                    <Text size="sm" className="text-typography-500">
                        {profile?.userid || 'SH51627923'}
                    </Text>
                    <Text size="sm" className="text-typography-400 font-medium">
                        {profile?.account_type || 'Free Account'}
                    </Text>
                </VStack>
            </HStack>

            {/* 2. Primary Action Buttons */}
            <HStack space="md" className="w-full">
                <Pressable
                    onPress={onEdit}
                    className="flex-1 flex-row justify-center items-center gap-2 bg-background-50 border border-outline-200 py-3 rounded-xl active:bg-background-100"
                >
                    <Icon as={EditIcon} size="sm" className="text-typography-700" />
                    <Text className="font-bold text-typography-700">Edit Profile</Text>
                </Pressable>

                {/* <Pressable
                    onPress={onUpgrade}
                    className="flex-1 flex-row justify-center items-center gap-2 bg-cyan-500 py-3 rounded-xl shadow-sm active:bg-cyan-600"
                >
                    <Icon as={StarIcon} size="sm" color="white" />
                    <Text className="font-bold text-white">Upgrade Now</Text>
                </Pressable> */}
            </HStack>
        </VStack>
    );
};

export default UserTopProfile;

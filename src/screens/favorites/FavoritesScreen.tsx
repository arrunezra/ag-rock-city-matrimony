import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, Pressable, RefreshControl } from 'react-native';

import { Box, HStack, Text, Center, Spinner, VStack, Button, ButtonText } from '@/src/components/common/GluestackUI';
import profileService from '@/src/services/profileService';
import { ProfileCard } from '../profile/ProfileCard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from '@/src/components/common/IconUI';
import { Heart, HeartIcon, Star } from 'lucide-react-native';
import { StarIcon } from '@/components/ui/icon';

const FavoritesScreen = () => {
    // 1. Add a safety check for navigation
    const navigation = useNavigation<any>();

    const [activeTab, setActiveTab] = useState('liked');
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = useCallback(async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const res = await profileService.getFavorites(activeTab);
            //console.log(`Data for ${activeTab}:`, res.data); // CHECK THIS IN YOUR TERMINAL
            if (res && res.success) {
                setProfiles(res.data || []);
            }
        } catch (error) {
            // console.error("Load Favorites Error:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [activeTab]);

    useFocusEffect(
        useCallback(() => {
            // 2. ONLY run if navigation exists
            if (navigation) {
                loadData(true);
            }
        }, [activeTab, navigation])
    );


    const handleTabChange = (tab: string) => {
        setProfiles([]); // Clear current list to prevent render conflicts
        setActiveTab(tab);
    };
    return (
        <Box className="flex-1 bg-background-50">
            <Box className="px-5 py-4 bg-white border-b border-outline-100 shadow-sm">
                <HStack className="bg-secondary-100 p-1 rounded-full items-center justify-center">

                    {/* LIKED TAB (Emerald Green Active) */}
                    <Pressable
                        className="flex-1" // Ensures equal width
                        onPress={() => handleTabChange('liked')}
                    >
                        {activeTab === 'liked' ? (
                            <LinearGradient
                                // Using your specific green palette
                                colors={['#10b981', '#059669', '#047857']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="rounded-full"
                                style={{
                                    borderRadius: 999, // High number ensures it's always "full"
                                    padding: 4,
                                    overflow: 'hidden' // Critical for keeping the gradient inside the circle
                                }}
                            >
                                <HStack className="py-2.5 items-center justify-center gap-2">
                                    <Box className="bg-white/20 p-1 rounded-full">
                                        <Icon as={StarIcon} color="white" size="lg" />
                                    </Box>
                                    <Text className="text-white font-bold text-sm tracking-wide">
                                        {"Liked"}
                                    </Text>
                                </HStack>
                            </LinearGradient>
                        ) : (
                            // Inactive State for Liked
                            <HStack className="py-2.5 items-center justify-center gap-2 rounded-full">
                                <Icon as={StarIcon} color="#94a3b8" size="lg" />
                                <Text className="text-secondary-400 font-semibold text-sm">
                                    {"Liked"}
                                </Text>
                            </HStack>
                        )}
                    </Pressable>

                    {/* Separator - Subtle line between tabs for definition */}
                    {activeTab !== 'liked' && activeTab !== 'accepted' && (
                        <Box className="h-4 w-px bg-secondary-200" />
                    )}

                    {/* MATCHES TAB (Wine Red Active) */}
                    <Pressable
                        className="flex-1" // Ensures equal width
                        onPress={() => handleTabChange('accepted')}
                    >
                        {activeTab === 'accepted' ? (
                            <LinearGradient
                                colors={['#be123c', '#9f1239', '#881337']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                // 1. Use className for layout
                                className="rounded-full items-center justify-center"
                                // 2. Use style for the actual rounding to ensure clipping
                                style={{
                                    borderRadius: 999, // High number ensures it's always "full"
                                    padding: 5,
                                    overflow: 'hidden' // Critical for keeping the gradient inside the circle
                                }}
                            >
                                <HStack className="py-2.5 items-center justify-center gap-2">
                                    <Box className="bg-white/20 p-1 rounded-full">
                                        <Icon as={HeartIcon} color="white" size="lg" />
                                    </Box>
                                    <Text
                                        className="text-white font-bold text-sm tracking-tight"
                                        numberOfLines={1} // Forces text to stay in one row
                                        ellipsizeMode="tail"
                                    >
                                        {"Connected"}
                                    </Text>
                                </HStack>
                            </LinearGradient>
                        ) : (
                            // Inactive State for Matches
                            <HStack className="py-2.5 items-center justify-center gap-2 rounded-full">
                                <Icon as={HeartIcon} color="#94a3b8" size="lg" />
                                <Text className="text-secondary-400 font-semibold text-sm">
                                    {"Connected"}
                                </Text>
                            </HStack>
                        )}
                    </Pressable>

                </HStack>
            </Box>

            {loading && profiles.length === 0 ? (
                <Center className="flex-1">
                    <Spinner size="large" />
                    <Text className="mt-2">Loading...</Text>
                </Center>
            ) : (
                <FlatList
                    // 1. Ensure data is always an array and filter out nulls
                    data={profiles || []}

                    // 2. Extremely safe key extractor
                    keyExtractor={(item: any, index) => {
                        return item?.profile_id ? String(item.profile_id) : `temp-${index}`;
                    }}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => loadData(true)} />
                    }
                    renderItem={({ item }) => {
                        // 3. Return null if item is broken to prevent full app crash
                        if (!item || !item.profile_id) return null;

                        return (
                            <Box className="mb-4">
                                <ProfileCard
                                    profile={item}
                                    onPress={() => navigation.navigate('ProfileDetail', { profile_id: item.profile_id })}
                                    onActionComplete={() => loadData(true)}
                                    comingFrom={activeTab}
                                />
                            </Box>
                        );
                    }}
                    removeClippedSubviews={false}
                    ListEmptyComponent={
                        <Center className="mt-20 px-10">
                            <Text className="text-center text-typography-400">
                                {"No records found."}
                            </Text>
                        </Center>
                    }
                />
            )}
        </Box>
    );
};

export default FavoritesScreen;
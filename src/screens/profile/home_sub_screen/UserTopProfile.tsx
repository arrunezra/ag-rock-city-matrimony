import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Box, VStack, HStack, Text, Heading, Avatar, AvatarImage, AvatarFallbackText, Center } from '@/src/components/common/GluestackUI';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { AddIcon, CheckIcon, EditIcon, Icon, StarIcon } from '@/components/ui/icon';
import { API_BASE_URL_DEV_Profiles_Thumbs } from '@/src/utils/environment';
import { getExtension } from '@/src/utils/common';
import LinearGradient from 'react-native-linear-gradient';
import { Briefcase, Camera, CheckCircle, CheckCircle2, ChevronRight, CreditCard, Edit3, Eye, GraduationCap, Heart, HeartHandshake, MapPin, Share2, Star, TrendingUp, Users, Zap } from 'lucide-react-native';
import profileService from '@/src/services/profileService';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LookupContext } from '@/src/context/LookupContext';

const UserTopProfile = ({ user, onEdit, onAddPhoto, onPayment }: any) => {
    //console.log('user==', user)
    const navigation = useNavigation<any>();
    const { lookups } = useContext(LookupContext);

    const [profiles, setProfiles] = useState<any>('');
    const [summary, setSummary] = useState<any>();
    // 1. Memoize the URL to avoid useEffect entirely if possible
    // Or, if you need a state, name it specifically to avoid clashing with your list profiles
    const profilePicUrl = useMemo(() =>
        setProfiles(getExtension(user?.profilePic, 'addthumnail')),
        [user?.profilePic]
    );

    // 2. Optimized Fetch Function
    const fetchSummaryDetails = useCallback(async () => {
        // Optional: Add a loading state for the summary if needed
        try {
            const response = await profileService.fetchSummaryDetails({
                profile_id: user?.profile_id,
                role: 'Profile',
                view_mode: 'COUNT',
                filter_by: ''
            });

            if (response?.success) {
                setSummary(response.summary);
            }
        } catch (error) {
            console.error("Summary Fetch Error:", error);
        }
    }, [user?.profile_id]); // Only recreate if user ID changes

    // 3. Combined Lifecycle Hook
    useFocusEffect(
        useCallback(() => {
            // useFocusEffect covers both initial mount and coming back to the screen
            fetchSummaryDetails();
            return () => {
                // Cleanup logic if needed
            };
        }, [fetchSummaryDetails])
    );
    const fullName = user?.firstName
        ? `${user.firstName} ${user.lastName || ''}`.trim()
        : "Guest User";

    return (
        <VStack className="px-5 py-8 bg-[#f8fafc] gap-8">
            {/* Profile Card Overlay */}
            <HStack space="lg" className="items-center bg-white p-3 rounded-[32px] shadow-sm border border-slate-100">
                <Box className="relative">
                    <Pressable onPress={onAddPhoto} className="active:scale-95 transition-transform">
                        <Box className="p-1 rounded-full bg-indigo-50 border border-indigo-100">
                            <Avatar size="2xl" className="rounded-full bg-slate-200">
                                <AvatarFallbackText className="font-bold text-slate-600" >
                                    {fullName}
                                </AvatarFallbackText>
                                {profiles && (
                                    <AvatarImage source={{ uri: profiles }} />
                                )}
                            </Avatar>
                        </Box>
                        {/* 2026 Floating Action Button */}
                        <Box
                            className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-md border border-slate-50"
                            style={{ elevation: 4 }}
                        >
                            <Center className="bg-indigo-600 p-1.5 rounded-full">
                                <Icon as={Camera} size="xs" color="white" />
                            </Center>
                        </Box>
                    </Pressable>
                </Box>

                <VStack className="flex-1">
                    <HStack items-center space="xs">
                        <Heading size="xl" className="text-slate-900 font-black ">
                            {fullName}
                        </Heading>
                        <Icon as={CheckCircle2} size="sm" className="text-blue-500 fill-blue-50" />
                    </HStack>

                    <Box className="bg-slate-100 self-start px-2.5 py-1 rounded-lg mt-1">
                        <Text size="xs" className="text-slate-600 font-bold tracking-tighter uppercase">
                            ID: {user?.role === 'member' ? user?.profile_id : user?.userid}
                        </Text>
                    </Box>

                    {/* <HStack items-center space="xs" className="mt-2">
                        <Box className="w-2 h-2 rounded-full bg-emerald-500" />
                        <Text size="sm" className="text-slate-500 font-semibold italic">
                            {user?.account_type || "Premium Plus"}
                        </Text>
                    </HStack> */}
                </VStack>
            </HStack>

            {/* Action Buttons Row */}
            <HStack space="md" className="w-full px-4 items-center">

                {/* Edit Profile - Secondary Style */}
                <TouchableOpacity
                    onPress={onEdit}
                    activeOpacity={0.7}
                    className="flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
                >
                    <View className="h-14 flex-row items-center justify-center px-4">
                        {/* Using a darker slate for the icon and text to ensure visibility */}
                        <Edit3 size={18} color="#475569" strokeWidth={2.5} />
                        <Text className="ml-2 font-bold text-slate-600 text-sm">
                            Edit Profile
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Pay Securely - Primary Style */}
                {summary?.is_subscribed == false && <TouchableOpacity
                    onPress={() => onPayment(summary?.subscription_amount ?? 0)}
                    activeOpacity={0.9}
                    style={{ elevation: 8 }}
                    className="flex-[1.5] overflow-hidden rounded-2xl shadow-lg shadow-emerald-500/40"
                >
                    <LinearGradient
                        colors={['#10b981', '#059669']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="h-14 flex-row items-center justify-center px-4"
                    >
                        <CreditCard size={18} color="white" strokeWidth={2.5} />
                        <Text className="ml-2 text-white font-black text-sm tracking-wide uppercase">
                            Pay Securely
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
                }
            </HStack>

            {/* Add this below the Edit Profile button */}
            {/* <HStack space="md" className="mx-6 mt-6">
                <Box className="flex-1 p-4 rounded-3xl bg-indigo-50 border border-indigo-100 items-center">
                    <Text className="text-indigo-600 font-black text-lg">12</Text>
                    <Text className="text-indigo-400 text-[10px] uppercase font-bold">Requests</Text>
                </Box>
                <Box className="flex-1 p-4 rounded-3xl bg-emerald-50 border border-emerald-100 items-center">
                    <Text className="text-emerald-600 font-black text-lg">48</Text>
                    <Text className="text-emerald-400 text-[10px] uppercase font-bold">Matches</Text>
                </Box>
            </HStack> */}

            <VStack className="flex-1 bg-white px-6 pt-4 pb-10">

                {/* 1. Quick Stats: The "Activity Bento Grid" */}
                <Box className="mb-8">
                    {/* Top Row: Matches & Views */}
                    <HStack space="md" className="mb-4">
                        {/* Matches Card */}
                        <VStack className="flex-1 p-5 rounded-[32px] bg-indigo-50/50 border border-indigo-100 items-center relative">
                            <TouchableOpacity className='items-center ' onPress={() => {

                                if (summary?.is_subscribed) {
                                    navigation.navigate('SummryListView', {
                                        filter: 'Likes'
                                    });
                                } else {
                                    onPayment(summary?.subscription_amount ?? 0)
                                }
                            }}          >
                                <Center className="w-10 h-10 rounded-2xl bg-indigo-100 mb-2">
                                    <Icon as={Users} size="sm" className="text-indigo-600" />
                                </Center>
                                <Text className="text-indigo-900 font-black text-xl">{summary?.likes} </Text>
                                <Text className="text-indigo-400 text-[9px] font-bold uppercase tracking-widest">Likes</Text>
                            </TouchableOpacity>
                        </VStack>

                        {/* Views Card */}

                        <VStack className="flex-1 p-5 rounded-[32px] bg-emerald-50/50 border border-emerald-100 items-center relative">
                            <TouchableOpacity className='items-center ' onPress={() => {

                                if (summary?.is_subscribed) {
                                    navigation.navigate('SummryListView', {
                                        filter: 'Views'
                                    });
                                } else {
                                    onPayment(summary?.subscription_amount ?? 0)
                                }

                            }}>
                                <Center className="w-10 h-10 rounded-2xl bg-emerald-100 mb-2">
                                    <Icon as={Eye} size="sm" className="text-emerald-600" />
                                </Center>
                                <Text className="text-emerald-900 font-black text-xl">{summary?.views}</Text>
                                <Text className="text-emerald-400 text-[9px] font-bold uppercase tracking-widest">Views</Text>
                                {/* Micro-badge for new views */}
                                <Box className="absolute top-4 right-4 bg-emerald-500 w-2 h-2 rounded-full border-2 border-white" />
                            </TouchableOpacity>
                        </VStack>
                    </HStack>

                    {/* Bottom Row: Accepted & Requests */}
                    <HStack space="md">
                        {/* Accepted Card */}
                        {/* Accepted Card - Now in Royal Violet */}
                        <VStack className="flex-1 p-5 rounded-[32px] bg-purple-50/50 border border-purple-100 items-center">
                            <TouchableOpacity className='items-center ' onPress={() => {
                                if (summary?.is_subscribed) {
                                    navigation.navigate('SummryListView', {
                                        filter: 'Accepted'
                                    });
                                } else {
                                    onPayment(summary?.subscription_amount ?? 0)
                                }

                            }}>
                                <Center className="w-10 h-10 rounded-2xl bg-purple-100 mb-2 shadow-sm shadow-purple-200">
                                    {/* Using a star or check-ribbon for a 'Success' feel */}
                                    <Icon as={CheckCircle2} size="sm" className="text-purple-600" />
                                </Center>
                                <Text className="text-purple-900 font-black text-xl">{summary?.accepted}</Text>
                                <Text className="text-purple-400 text-[9px] font-bold uppercase tracking-widest">Accepted</Text>

                                {/* Optional: Add a tiny "growth" indicator */}
                                {/* <HStack className="items-center mt-1">
                                    <Icon as={TrendingUp} size={'md'} className="text-purple-400 mr-1" />
                                    <Text className="text-purple-400 font-bold text-[8px]">+3 Today</Text>
                                </HStack> */}
                            </TouchableOpacity>
                        </VStack>

                        {/* Requests Card - With Activity Batch */}
                        <VStack className="flex-1 p-5 rounded-[32px] bg-rose-50/50 border border-rose-100 items-center relative">
                            {/* The "Batch" (Notification Badge) */}
                            {/* <Box className="absolute -top-2 -right-1 bg-rose-600 px-2 py-0.5 rounded-lg shadow-sm border-2 border-white">
                                <Text className="text-white font-black text-[8px]">12 NEW</Text>
                            </Box> */}
                            <TouchableOpacity className='items-center ' onPress={() => {

                                if (summary?.is_subscribed) {
                                    navigation.navigate('SummryListView', {
                                        filter: 'Requests'
                                    });
                                } else {
                                    onPayment(summary?.subscription_amount ?? 0)
                                }


                            }}>
                                <Center className="w-10 h-10 rounded-2xl bg-rose-100 mb-2">
                                    <Icon as={HeartHandshake} size="sm" className="text-rose-600" />
                                </Center>
                                <Text className="text-rose-900 font-black text-xl">{summary?.requests}</Text>
                                <Text className="text-rose-400 text-[9px] font-bold uppercase tracking-widest">Requests</Text>
                            </TouchableOpacity>
                        </VStack>
                    </HStack>
                </Box>

                {/* 4. The 'Visual Floor' */}
                {/* <Box className="mt-auto mb-10 p-8 rounded-[40px] bg-slate-50/80 border border-dashed border-slate-200">
                    <VStack space="xl" className="items-center">
                        <Center className="w-12 h-12 rounded-full bg-white shadow-sm">
                            <Icon as={Heart} size="sm" className="text-rose-400" />
                        </Center>

                        <VStack className="items-center" space="xs">
                            <Text className="text-slate-500 text-[15px] italic text-center font-medium leading-6">
                                "Let all that you do be done in love."
                            </Text>
                            <Text className="font-black text-slate-400 text-[10px] uppercase tracking-[2px]">
                                — 1 Corinthians 16:14
                            </Text>
                        </VStack>

                        <Pressable className="mt-2 px-8 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm active:scale-95 transition-all">
                            <HStack space="xs" className="items-center">
                                <Icon as={Share2} size="xs" className="text-slate-600" />
                                <Text className="text-slate-600 font-black text-[10px] uppercase tracking-widest">
                                    Share Profile
                                </Text>
                            </HStack>
                        </Pressable>
                    </VStack>
                </Box> */}


                <Box className="mt-auto mb-10  relative">
                    {/* 1. The Radiant Glow Layer (Soft Backlight) */}
                    <LinearGradient
                        colors={['#10b981', '#3b82f6', '#6366f1']} // Emerald to Blue to Indigo
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            position: 'absolute',
                            inset: -1,
                            borderRadius: 40,
                            opacity: 0.3,
                        }}
                    />

                    {/* 2. The Main Minimalist Box */}
                    <Box className="bg-white rounded-[38px] p-10 shadow-2xl shadow-slate-200 items-center">
                        <VStack space="xl" className="items-center">

                            {/* 3. Floating Heart Icon with Micro-Glow */}
                            <Box className="relative mb-2">
                                <Center className="w-14 h-14 rounded-[22px] bg-slate-50 border border-slate-100 shadow-sm">
                                    <Icon as={Heart} size="sm" className="text-rose-500" />
                                </Center>
                                {/* Subtle pulse dot */}
                                <Box className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                            </Box>

                            {/* 4. The Message Layer */}
                            <VStack className="items-center" space="md">
                                <Text className="text-slate-400 font-black text-[9px] uppercase tracking-[5px]">
                                    Daily Verse
                                </Text>

                                <Text className="text-slate-800 text-[20px] text-center font-bold leading-8 tracking-tight">
                                    "Let all that you do{"\n"}
                                    <Text className="text-emerald-600 italic">be done in love.</Text>"
                                </Text>
                                <Box className="mt-4 px-3 py-1 rounded-full bg-slate-100/50">
                                    <Text className="font-bold text-slate-500 text-[10px] uppercase tracking-widest">
                                        1 Corinthians 16:14
                                    </Text>
                                </Box>

                            </VStack>

                            {/* 5. Clean Signature (Replaces the Action Stage) */}
                            <VStack className="items-center mt-4">
                                <Text className="text-slate-300 font-black text-[8px] uppercase tracking-[3px]">
                                    {lookups.appName} Roct City AG Church
                                </Text>
                            </VStack>
                        </VStack>
                    </Box>
                </Box>


            </VStack>
        </VStack >
    );
};

export default UserTopProfile;

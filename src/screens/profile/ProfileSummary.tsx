import { View, Text, RefreshControl, TouchableOpacity, Pressable, StatusBar } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Box, Heading, HStack, Image, VStack } from '@/src/components/common/GluestackUI';
import LinearGradient from 'react-native-linear-gradient';
import { Icon, UserCheck, Users, CheckCircle } from '@/src/components/common/IconUI';
import { AlertCircle, Check, ChevronRight, MapPin, Phone, UserX } from 'lucide-react-native';
import DashboardSkeleton from '../staff/DashboardSkeleton';
import { MotiView } from 'moti';
import profileService from '@/src/services/profileService';
import { API_BASE_URL_DEV_Profiles_Thumbs } from '@/src/utils/environment';
import { getExtension } from '@/src/utils/common';
import FastImage from '@d11/react-native-fast-image';
import HeaderSession from '../common/HeaderSession';

const ProfileSummary = ({ navigation }: any) => {
    const [data, setData] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = useCallback(async () => {
        setRefreshing(true);
        try {
            const res = await profileService.getDashboardData();

            if (res.success) setData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setRefreshing(false);
        }
    }, []);
    const getStatusColor = (isActive: number, isVerified: number): string => {
        // Active and verified
        if (isActive === 1 && isVerified === 1) {
            //return isVerified === 0 ? '#3b82f6' : '#22c55e'
            return '#22c55e'

        }

        // Active but not verified
        if (isActive === 1 && isVerified !== 1) return '#E8AD69';

        // Inactive
        if (isActive === 0) return '#ef4444'; // Red

        // Default fallback (should rarely hit this)
        return '#E8AD69';
    };
    return (
        <VStack className="flex-1 bg-white">
            {/* 1. Global Status Settings (Top Level) */}
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* 2. The Header (Fixed at the top, handling the Safe Area) */}
            <HeaderSession
                title="Control Center"
                theme='emerald'
                //subTitle="System Overview"
                showRightIcon={false}
                leftIconType="menu"
                onLeftPress={() => navigation.openDrawer()}
            />
            <KeyboardAwareScrollView
                className="flex-1 bg-slate-50 p-4"
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchDashboardData} tintColor="#6366f1" />
                }
            >
                <VStack space="xl" className="pb-10">

                    {/* --- HEADER: Total Users --- */}
                    <LinearGradient
                        colors={['#4f46e5', '#7c3aed']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ borderRadius: 32, padding: 24, shadowColor: '#4f46e5', shadowOpacity: 0.3, shadowRadius: 10 }}
                    >
                        <HStack className="justify-between items-center">
                            <VStack>
                                <Text className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Global Profiles</Text>
                                <Heading size="4xl" className="text-white mt-1">{data?.summary?.total_count || 0}</Heading>
                                <Text className="text-indigo-200 text-xs mt-1">Total Registered profiles</Text>
                            </VStack>
                            <Box className="bg-white/20 p-4 rounded-3xl">
                                <Icon as={Users} className="text-white" size="xl" />
                            </Box>
                        </HStack>
                    </LinearGradient>

                    {/* --- STATS GRID: Active/Inactive & Verified/Unverified --- */}
                    <VStack space="md">
                        <HStack space="md">
                            {/* Active */}
                            <Box className="flex-1 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                                <HStack space="sm" className="items-center mb-2">
                                    <Box className="p-2 bg-emerald-50 rounded-xl"><Icon as={UserCheck} size="xs" className="text-emerald-600" /></Box>
                                    <Text className="text-slate-400 text-[10px] font-bold uppercase">Active</Text>
                                </HStack>
                                <Text className="text-2xl font-bold text-slate-800">{data?.summary?.active_count || 0}</Text>
                            </Box>
                            {/* Inactive */}
                            <Box className="flex-1 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                                <HStack space="sm" className="items-center mb-2">
                                    <Box className="p-2 bg-rose-50 rounded-xl"><Icon as={UserX} size="xs" className="text-rose-600" /></Box>
                                    <Text className="text-slate-400 text-[10px] font-bold uppercase">Inactive</Text>
                                </HStack>
                                <Text className="text-2xl font-bold text-slate-800">{data?.summary?.inactive_count || 0}</Text>
                            </Box>
                        </HStack>

                        <HStack space="md">
                            {/* Verified - NEW COLUMN */}
                            <Box className="flex-1 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                                <HStack space="sm" className="items-center mb-2">
                                    <Box className="p-2 bg-blue-50 rounded-xl"><Icon as={CheckCircle} size="xs" className="text-blue-600" /></Box>
                                    <Text className="text-slate-400 text-[10px] font-bold uppercase">Verified</Text>
                                </HStack>
                                <Text className="text-2xl font-bold text-slate-800">{data?.summary?.verified_count || 0}</Text>
                            </Box>
                            {/* Unverified - NEW COLUMN */}
                            <Box className="flex-1 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                                <HStack space="sm" className="items-center mb-2">
                                    <Box className="p-2 bg-amber-50 rounded-xl"><Icon as={AlertCircle} size="xs" className="text-amber-600" /></Box>
                                    <Text className="text-slate-400 text-[10px] font-bold uppercase">Pending</Text>
                                </HStack>
                                <Text className="text-2xl font-bold text-slate-800">{data?.summary?.unverified_count || 0}</Text>
                            </Box>
                        </HStack>
                    </VStack>

                    {/* --- RECENT USERS LIST --- */}
                    <VStack space="md">
                        <HStack className="justify-between items-center px-1 mb-4">
                            <Heading size="md" className="text-slate-900 font-bold tracking-tight">
                                Recent Profiles
                            </Heading>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('staffProfileSummaryView')}
                                activeOpacity={0.7}
                            >
                                <Box className="bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-100/50">
                                    <HStack space="xs" className="items-center">
                                        <Text className="text-indigo-600 font-bold text-md">View All</Text>
                                        {/* Adding a small chevron makes it look more clickable */}
                                        <Icon as={ChevronRight} size="xs" className="text-indigo-600" />
                                    </HStack>
                                </Box>
                            </TouchableOpacity>
                        </HStack>

                        {refreshing || !data ? (
                            <DashboardSkeleton />
                        ) : (
                            data?.profile?.map((item: any, index: number) => {
                                const statusColor = getStatusColor(item.IsActive, item.IsVerified);

                                return (
                                    <MotiView
                                        key={item.userid}
                                        from={{ opacity: 0, translateY: 10 }}
                                        animate={{ opacity: 1, translateY: 0 }}
                                        transition={{ type: 'timing', delay: index * 50 }}
                                    >
                                        <Pressable
                                            onPress={() => {


                                                navigation.navigate("Main", {
                                                    screen: "ProfileDetail",
                                                    params: { profile_id: item.profile_id }
                                                })
                                            }}
                                            className="mb-4 overflow-hidden rounded-[30px] bg-white border border-slate-100 shadow-sm"
                                            style={{ borderLeftWidth: 8, borderLeftColor: statusColor }}
                                        >
                                            <VStack className="p-4">
                                                {/* --- TOP SECTION: Profile & Basic Info --- */}
                                                <HStack space="md" className="items-center">
                                                    <Box className="relative">
                                                        {/* <FastImage
                                                        source={{ uri: getExtension(item.file_name, 'addthumnail') }}
                                                        className="h-14 w-14 rounded-2xl bg-slate-100"

                                                    /> */}
                                                        <FastImage
                                                            source={{
                                                                uri: getExtension(item.file_name, 'addthumnail'),
                                                                priority: FastImage.priority.normal,
                                                                cache: FastImage.cacheControl.immutable,
                                                            }}

                                                            style={{ width: 56, height: 56, borderRadius: 32 }}
                                                            resizeMode={FastImage.resizeMode.cover}
                                                        />


                                                        {item.IsVerified === 1 && (
                                                            <Box className="absolute -right-2 -top-2 bg-blue-500 rounded-full p-1 border-2 border-white">
                                                                <Check size={10} color="white" />
                                                            </Box>
                                                        )}
                                                    </Box>

                                                    <VStack className="flex-1">
                                                        <HStack className="justify-between items-start">
                                                            <Text className="font-bold text-slate-900 text-lg leading-tight flex-1" numberOfLines={1}>
                                                                {item.full_name || `${item.first_name} ${item.last_name}`}
                                                            </Text>
                                                            {/* EXACT POSITION FOR USERID: Top Right of the text area */}
                                                            <Text className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                                                #{item.userid}
                                                            </Text>
                                                        </HStack>
                                                        <Text className="text-xs text-slate-500 font-medium">{item.email}</Text>
                                                    </VStack>

                                                    <Box className="bg-slate-50 p-2 rounded-full ml-1">
                                                        <ChevronRight size={16} color="#94a3b8" />
                                                    </Box>
                                                </HStack>

                                                {/* --- MIDDLE SECTION: The Address/Location --- */}
                                                <HStack className="mt-3 items-center space-x-1">
                                                    <MapPin size={12} color="#64748b" />
                                                    <Text className="text-[11px] text-slate-500 flex-1" numberOfLines={1}>
                                                        {item.address}, {item.city_name}, {item.state_name}
                                                    </Text>
                                                </HStack>

                                                {/* --- FOOTER SECTION: The "Missing Data" Grid --- */}
                                                <Box className="mt-4 pt-4 border-t border-slate-50">
                                                    <HStack className="justify-between flex-wrap">
                                                        {/* DOB & Gender */}
                                                        <VStack className="w-[30%]">
                                                            <Text className="text-[9px] uppercase font-bold text-slate-400">Identity</Text>
                                                            <Text className="text-[11px] text-slate-700 font-semibold">{item.dob}</Text>
                                                            <Text className="text-[10px] text-slate-500">{item.gender}</Text>
                                                        </VStack>

                                                        {/* Contact */}
                                                        <VStack className="w-[35%]">
                                                            <Text className="text-[9px] uppercase font-bold text-slate-400">Contact</Text>
                                                            <Text className="text-[11px] text-slate-700 font-semibold">{item.phone}</Text>
                                                            <Text className="text-[10px] text-slate-500">{item.marital_status}</Text>
                                                        </VStack>

                                                        {/* Account Status */}
                                                        <VStack className="w-[30%] items-end">
                                                            <Text className="text-[9px] uppercase font-bold text-slate-400">Status</Text>
                                                            <Box
                                                                style={{ backgroundColor: `${statusColor}15` }}
                                                                className="px-2 py-0.5 rounded-md mt-0.5"
                                                            >
                                                                <Text style={{ color: statusColor }} className="text-[9px] font-black uppercase">
                                                                    {item.IsActive === 1 ? 'Active' : 'In-Active'}
                                                                </Text>
                                                            </Box>
                                                        </VStack>
                                                    </HStack>
                                                </Box>
                                            </VStack>
                                        </Pressable>
                                    </MotiView>
                                );
                            })
                        )}
                    </VStack>
                </VStack>
            </KeyboardAwareScrollView >
        </VStack>
    );
};

export default ProfileSummary

import React, { Activity, useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, FlatList, Linking, Pressable, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { Box, VStack, HStack, Text, Heading, Spinner, Divider, Center, Link, LinkText, ButtonText, Button, Avatar, AvatarFallbackText, AvatarImage } from '@/src/components/common/GluestackUI';
import api from '@/src/api/api';
import { Icon, Globe, MapPin, ChevronLeft } from '@/src/components/common/IconUI';
import { ChevronRight, Church, Phone, ShieldCheck, User2Icon } from 'lucide-react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList } from '@/src/types/navigation';

export default function ChurchDashboard({ navigation }: any) {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const fetchStats = async () => {
        try {
            const res = await api.post('/church/churchmanagment.php', { action: 'fetch_stats' });
            if (res.data.success) setStats(res.data);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchStats(); }, []);
    const handleOpenPreview = (item: any) => {

    }
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        // Call your fetch function (e.g., fetchDashboardStats)
        await fetchStats();
        setRefreshing(false);
    }, []);

    // 1. Header Component (The Summary Cards)
    const Header = () => (
        <Box className="pt-10 pb-4 px-4 bg-background-50">
            {/* Title Section with Gradient-like text feel */}
            <VStack className="mb-6 px-1">
                <Text className="text-primary-600 font-bold uppercase tracking-[3px] text-[10px] mb-1">
                    Administrative Hub
                </Text>
                <Heading size="2xl" className="text-primary-900 font-black tracking-tighter">
                    System Overview
                </Heading>
            </VStack>

            {/* 1. HERO CARD: Ultra-Modern Glass Effect */}
            <TouchableOpacity onPress={() => navigation.navigate('Main', {
                screen: 'ChurchManagement'
            })}>
                <Box
                    className="bg-primary-600 p-8 rounded-[40px] shadow-2xl mb-6 relative overflow-hidden"
                    style={{ elevation: 10 }}
                >
                    <VStack className="z-10">
                        <HStack className="items-center" space="xs">
                            <Box className="w-1.5 h-1.5 rounded-full bg-primary-300 animate-pulse" />
                            <Text className="text-primary-100 font-bold uppercase tracking-widest text-[10px]">
                                Live Registry Count
                            </Text>
                        </HStack>
                        <HStack className="items-baseline" space="xs">
                            <Heading size="4xl" className="text-white font-black text-6xl tracking-tighter">
                                {stats?.total || 0}
                            </Heading>
                            <Text className="text-primary-200 font-bold text-sm">Churches</Text>
                        </HStack>
                    </VStack>

                    {/* Background Decorative Element */}
                    {/* <Box className="absolute -right-10 -bottom-10 bg-white/10 w-40 h-40 rounded-full"  > 
                </Box> */}
                    <Box className="absolute -right-4 -bottom-4 opacity-10">
                        <Icon as={Church} size="xl" className="text-white w-24 h-24" />
                    </Box>
                </Box>
            </TouchableOpacity>
            {/* 2. STATUS TILES: Specific Active & Inactive Results */}
            <HStack space="md" className="mb-8 px-1">

                {/* ACTIVE CHURCHES CARD */}
                <Box className="bg-emerald-50 p-5 rounded-[30px] flex-1 border border-emerald-100 shadow-sm relative overflow-hidden">
                    <VStack space="xs">
                        <HStack space="xs" className="items-center">
                            <Box className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200" />
                            <Text className="text-emerald-700 font-black uppercase tracking-widest text-[9px]">
                                Active
                            </Text>
                        </HStack>

                        <Heading size="3xl" className="text-emerald-900 font-black tracking-tighter">
                            {stats?.active_count || 0}
                        </Heading>

                        <Text className="text-emerald-600 font-bold text-[10px] uppercase">
                            Currently Live
                        </Text>
                    </VStack>
                    {/* Subtle Decorative Icon */}
                    <Box className="absolute -right-2 -bottom-2 opacity-10">
                        <Icon as={ShieldCheck} size="xl" className="text-emerald-900 w-12 h-12" />
                    </Box>
                </Box>

                {/* INACTIVE CHURCHES - SUBTLE NEUTRAL THEME */}
                <Box className="bg-white p-5 rounded-[28px] flex-1 border border-outline-100 shadow-sm relative overflow-hidden">
                    <VStack space="xs">
                        <HStack space="xs" className="items-center">
                            {/* Muted indicator instead of bright amber */}
                            <Box className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <Text className="text-typography-500 font-bold uppercase tracking-widest text-[9px]">
                                Inactive
                            </Text>
                        </HStack>

                        <Heading size="3xl" className="text-primary-900 font-black tracking-tighter">
                            {stats?.inactive_count || 0}
                        </Heading>

                        {/* Subtle background for the status badge instead of the whole card */}
                        <Box className="bg-slate-100 self-start px-2 py-0.5 rounded-md">
                            <Text className="text-slate-600 font-bold text-[9px] uppercase">Offline</Text>
                        </Box>
                    </VStack>
                </Box>

            </HStack>

            {/* 3. DENOMINATION BENTO LIST */}
            <Box className="bg-white/60 rounded-[32px] p-2 border border-outline-100 shadow-sm mb-8">
                <Heading size="xs" className="my-3 ml-4 text-typography-500 uppercase tracking-[2px] font-bold">
                    Denominations
                </Heading>
                <VStack space="xs">
                    {stats?.by_denomination?.map((item: any, index: number) => (
                        <HStack
                            key={item.label}
                            className={`p-4 rounded-[20px] items-center justify-between ${index % 2 === 0 ? 'bg-white' : 'bg-transparent'}`}
                        >
                            <HStack space="md" className="items-center">
                                <Center className="w-8 h-8 rounded-full bg-primary-50">
                                    <Text className="text-primary-600 font-bold text-xs">{item.label.charAt(0)}</Text>
                                </Center>
                                <Text className="font-bold text-typography-800 text-sm">{item.label}</Text>
                            </HStack>
                            <Box className="bg-primary-700 px-4 py-1.5 rounded-full">
                                <Text className="text-white font-black text-[10px]">{item.value}</Text>
                            </Box>

                        </HStack>
                    ))}
                </VStack>
            </Box>

            <Divider className="mb-8 border-outline-50 opacity-50" />

            {/* 4. RECENT ACTIVITY HEADER */}
            <HStack className="justify-between items-center mb-5 px-2">
                <VStack>
                    <Heading size="md" className="text-primary-900 font-black tracking-tight">Recent Activity</Heading>
                    <Text size="xs" className="text-typography-400 font-bold uppercase tracking-tighter">Last 10 records</Text>
                </VStack>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('Main', {
                            screen: 'ChurchManagement'
                        })}
                    className="bg-primary-50 px-4 py-2 rounded-full border border-primary-100 active:scale-95"
                >
                    <HStack space="xs" className="items-center">
                        <Text size="xs" className="text-primary-700 font-black uppercase">View All</Text>
                        <Icon as={ChevronRight} size="xs" className="text-primary-700" />
                    </HStack>
                </TouchableOpacity>
            </HStack>
        </Box>
    );

    if (loading) return <Center className="flex-1"><Spinner size="large" /></Center>;

    // 1. YOUR SKELETON ITEM
    const SkeletonItem = () => {
        const pulseAnim = useRef(new Animated.Value(0.4)).current;

        useEffect(() => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
                ])
            ).start();
        }, []);

        return (
            <Animated.View style={{ opacity: pulseAnim }}>
                <Box className="mx-4 p-4 mb-3 bg-white rounded-2xl border border-outline-100 shadow-sm">
                    <HStack space="md" className="items-center">
                        <Box className="w-12 h-12 rounded-full bg-background-200" />
                        <VStack space="xs" className="flex-1 justify-center">
                            <Box className="w-3/4 h-4 rounded bg-background-200" />
                            <Box className="w-1/2 h-3 rounded bg-background-200" />
                        </VStack>
                        <Box className="w-8 h-8 rounded-full bg-background-100" />
                    </HStack>
                </Box>
            </Animated.View>
        );
    };

    // 2. THE ANIMATED DATA CARD
    const AnimatedCard = ({ item, index, handleOpenPreview }: any) => {
        const translateY = useRef(new Animated.Value(20)).current;
        const opacity = useRef(new Animated.Value(0)).current;

        useEffect(() => {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 400,
                delay: index * 100, // Stagger effect
                easing: Easing.out(Easing.back(1.5)),
                useNativeDriver: true,
            }).start();

            Animated.timing(opacity, {
                toValue: 1,
                duration: 400,
                delay: index * 100,
                useNativeDriver: true,
            }).start();
        }, []);

        return (
            <Animated.View style={{ opacity, transform: [{ translateY }] }}>
                <Box className="mx-4 mb-3 overflow-hidden rounded-2xl bg-white border border-outline-50 shadow-sm active:opacity-90">
                    <HStack className="items-stretch">
                        <Box className={`w-1.5 ${item.active_status === 'Active' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                        <HStack space="md" className="flex-1 p-4 items-center">
                            <TouchableOpacity onPress={() => handleOpenPreview(item)}>
                                <Avatar size="md" className="border-2 border-white bg-primary-100 shadow-sm">
                                    {item?.profile_image ? (
                                        <AvatarImage source={{ uri: item.profile_image }} />
                                    ) : (
                                        <AvatarFallbackText className="text-primary-700 font-bold">{item.church_name}</AvatarFallbackText>
                                    )}
                                </Avatar>
                            </TouchableOpacity>
                            <VStack className="flex-1">
                                <Text className="font-extrabold text-typography-900 text-sm leading-tight">{item.church_name}</Text>
                                <Text size="xs" className="text-typography-400 font-medium mb-1">{item.pastor_name}</Text>
                            </VStack>
                            <TouchableOpacity className="w-8 h-8 rounded-full bg-background-50 items-center justify-center">
                                <Icon as={Phone} size="xs" className="text-primary-600" />
                            </TouchableOpacity>
                        </HStack>
                    </HStack>
                </Box>
            </Animated.View>
        );
    };

    // 3. MAIN COMPONENT RENDER
    // In your ChurchDashboard return statement:
    return (
        <Box className="flex-1 bg-background-50">
            {loading && !refreshing ? (
                <VStack className="pt-4">
                    <HeaderSkeleton /> {/* Add your Hero Skeleton here */}
                    {[1, 2, 3, 4, 5].map((i) => <SkeletonItem key={i} />)}
                </VStack>
            ) : (
                <FlatList
                    data={stats?.recent_churches || []}
                    keyExtractor={(item) => item.id.toString()}
                    ListHeaderComponent={Header}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0891b2" />
                    }
                    renderItem={({ item, index }) => (
                        <AnimatedCard
                            item={item}
                            index={index}
                            handleOpenPreview={handleOpenPreview}
                        />
                    )}
                />
            )}
        </Box>
    );
};

const HeaderSkeleton = () => {
    return (
        <Box className="pt-10 pb-4 px-4 bg-background-50">
            {/* Title Skeleton */}
            <VStack className="mb-6 px-1" space="xs">
                <Box className="w-32 h-3 rounded bg-background-200" />
                <Box className="w-56 h-8 rounded-lg bg-background-300" />
            </VStack>

            {/* Hero Card Skeleton */}
            <Box className="bg-background-200 p-8 rounded-[40px] mb-6 h-44 justify-center" />

            {/* Status Tiles Skeleton */}
            <HStack space="md" className="mb-8 px-1">
                <Box className="bg-white p-5 rounded-[30px] flex-1 border border-outline-100 h-28" />
                <Box className="bg-white p-5 rounded-[30px] flex-1 border border-outline-100 h-28" />
            </HStack>
        </Box>
    );
};
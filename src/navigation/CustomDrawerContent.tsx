import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Box, VStack, HStack, Avatar, AvatarImage, Text, Divider, AvatarFallbackText, Center, Heading } from '@/src/components/common/GluestackUI';
import { Pressable, TouchableOpacity } from 'react-native';
import { AddIcon, Icon } from '@/components/ui/icon';
import { LogOutIcon, UsersIcon } from '../components/common/IconUI';
import { useAuth } from '@/src/context/AuthContext';
import { API_BASE_URL_DEV_Profiles_Thumbs } from '../utils/environment';
import { AvatarBadge } from '@/components/ui/avatar';
import { Camera, CheckIcon, ChevronRight, LayoutDashboard, LogOut, Settings, ShieldCheck } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import { getExtension } from '../utils/common';
import LinearGradient from 'react-native-linear-gradient';

export default function CustomDrawerContent(props: any) {
    const { state, userRole, navigation, user, logout } = props;
    // Add a timestamp to force the Avatar to re-render when the image changes

    const currentYear = new Date().getFullYear();
    const activeRouteName = state.routeNames[state.index];
    const [profile, setProfile] = useState<any>('');

    useFocusEffect(
        useCallback(() => {
            setProfile(getExtension(user?.profilePic, 'addthumnail'))
        }, [])
    );


    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: '#fdfdfd' }}>

            <Box className="relative pb-10">
                <LinearGradient
                    colors={['#1b4b3dff', '#38ca99ff']} // Deep midnight to indigo
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        height: 160,
                        borderBottomLeftRadius: 60,
                    }}
                />

                {/* 2. The Floating Stage (No border, just pure shadow depth) */}
                <Box
                    className="mx-6 bg-white rounded-[40px] p-6 shadow-2xl shadow-indigo-900/40"
                    style={{ marginTop: -80, elevation: 20 }}
                >
                    <VStack space="xl">
                        <HStack space="lg" className="items-center">
                            {/* Unique Hexagonal or Rounded-Square Avatar Frame */}
                            <TouchableOpacity onPress={() => {
                                navigation.navigate('Main', { screen: 'ShowProfileGallery' })
                            }}>
                                <Box className="relative">
                                    <Box className="p-1 rounded-[24px] bg-slate-100 border-2 border-slate-50">
                                        <Avatar size="xl" className="rounded-[20px] bg-indigo-50">
                                            <AvatarFallbackText className="font-bold text-indigo-700">{user?.firstName}</AvatarFallbackText>
                                            {profile && <AvatarImage source={{ uri: profile }} />}
                                        </Avatar>
                                    </Box>
                                    {/* 2026 Minimalist Camera Trigger */}
                                    <Pressable
                                        onPress={() => {
                                            navigation.navigate('Main', { screen: 'ShowProfileGallery' })
                                            //navigation.navigate('ShowProfileGallery')
                                        }}
                                        className="absolute -bottom-1 -right-1 bg-white p-2 rounded-2xl shadow-lg border border-slate-100 active:bg-slate-50"
                                    >
                                        <Icon as={Camera} size="sm" className="text-slate-600" />
                                    </Pressable>
                                </Box>
                            </TouchableOpacity>
                            <VStack className="flex-1">
                                <HStack space="xs" className="items-center">
                                    <Heading
                                        size="md"
                                        className="text-slate-900 font-black tracking-tighter uppercase flex-shrink"
                                    // Add flex-shrink so it knows to wrap rather than push the icon out
                                    >
                                        {user?.firstName || user?.lastName
                                            ? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()
                                            : 'Guest User'}
                                    </Heading>

                                    {/* Verification Icon */}
                                    <Center className="bg-blue-100 w-5 h-5 rounded-full flex-shrink-0">
                                        <Icon as={CheckIcon} size={'md'} className="text-blue-600" />
                                    </Center>
                                </HStack>
                                <Text className="text-slate-400 font-medium text-xs mb-2">Member ID: #8829</Text>

                                {/* Pill-style status */}
                                <Box className="bg-indigo-600 self-start px-3 py-1 rounded-full shadow-md shadow-indigo-200">
                                    <Text className="text-white font-black uppercase text-[8px] tracking-[1px]">
                                        Verified Account
                                    </Text>
                                </Box>
                            </VStack>
                        </HStack>

                        {/* Sub-identity row (Email moved out of the main block for breathing room) */}
                        <Box className="bg-slate-50 rounded-2xl p-3 border border-slate-100/50">
                            <HStack space="sm" className="items-center">
                                <Box className="w-2 h-2 rounded-full bg-emerald-500" />
                                <Text className="text-slate-600 font-bold text-[11px] italic">
                                    {user?.email}
                                </Text>
                            </HStack>
                        </Box>
                    </VStack>
                </Box>
            </Box>

            {/* 2. Menu Items Section */}
            <Box className="px-2 flex-1">
                <DrawerItemList {...props} />

                <Divider className="my-4 mx-4 bg-slate-100" />

                {/* Custom Styled Settings Item */}
                <Pressable
                    className="mx-2 p-3 rounded-2xl active:bg-indigo-50"
                    onPress={() => navigation.navigate('Main', { screen: 'MemberSettings' })}
                >
                    <HStack className="items-center justify-between">
                        <HStack space="md" items-center>
                            <Center className="w-8 h-8 rounded-xl bg-slate-100">
                                <Icon as={Settings} size="sm" className="text-slate-600" />
                            </Center>
                            <Text className="font-bold text-slate-700">Settings</Text>
                        </HStack>
                        <Icon as={ChevronRight} size="xs" className="text-slate-300" />
                    </HStack>
                </Pressable>
            </Box>

            {/* 3. Footer Section */}
            <Box className="relative mt-auto pt-10">


                {/* 2. The Floating Utility Stage */}
                <Box
                    className="mx-6 bg-white rounded-[40px] p-6 shadow-2xl shadow-emerald-900/20"
                    style={{
                        marginTop: -100, // Pulls the logout stage onto the gradient
                        elevation: 20
                    }}
                >
                    <VStack space="xl">
                        {/* Logout Action Row */}


                        {/* Branding/App Info Row */}
                        <Box className="bg-slate-50 rounded-2xl p-4 ">
                            <VStack space="xs" className="items-center">
                                <Text className="text-slate-900 font-black text-[10px] tracking-[2px]">
                                    ROCT CITY <Text className="text-emerald-600">AG CHURCH</Text>
                                </Text>
                                <HStack space="xs" className="items-center">
                                    <Text className="text-[9px] font-bold text-slate-400">V 1.0.3</Text>
                                    <Box className="w-1 h-1 rounded-full bg-slate-300" />
                                    <Text className="text-[9px] font-bold text-slate-400">© 2026</Text>
                                </HStack>
                            </VStack>
                        </Box>
                    </VStack>
                </Box>
            </Box>
        </DrawerContentScrollView>

    );
}
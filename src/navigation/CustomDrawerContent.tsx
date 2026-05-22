import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Box, VStack, HStack, Avatar, AvatarImage, Text, Divider, AvatarFallbackText, Center, Heading } from '@/src/components/common/GluestackUI';
import { Alert, Pressable, TouchableOpacity } from 'react-native';
import { Icon } from '@/components/ui/icon';
import { Camera, CheckIcon, ChevronRight, LogOut, Settings } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useContext, useEffect, useState } from 'react';
import { getCurrentYear, getExtension } from '../utils/common';
import LinearGradient from 'react-native-linear-gradient';
import { LookupContext } from '../context/LookupContext';
import { useAuth } from '../context/AuthContext';

export default function CustomDrawerContent(props: any) {
    const { state, userRole, navigation, logout } = props;
    const { user } = useAuth();

    // Add a timestamp to force the Avatar to re-render when the image changes
    const { lookups } = useContext(LookupContext);

    const currentYear = new Date().getFullYear();
    const activeRouteName = state.routeNames[state.index];
    const [profile, setProfile] = useState<any>('');

    useFocusEffect(
        useCallback(() => {
            if (user?.role == 'member')
                setProfile(getExtension(user?.profilePic, 'addthumnail'))
            else setProfile(getExtension(user?.profilePic, 'url'))

        }, [user])
    );

    // useEffect(() => {
    //     if (user.role == 'member')
    //         setProfile(getExtension(user?.profilePic, 'addthumnail'))
    //     else setProfile(getExtension(user?.profilePic, 'url'))

    // }, [])


    const fullName = user?.firstName
        ? `${user.firstName} ${user.lastName || ''}`.trim()
        : "Guest User";

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, backgroundColor: '#fdfdfd' }}>
            <VStack className="justify-between h-full flex-1">

                {/* TOP SECTION: Profile Header + Drawer Nav Links */}
                <Box>
                    {/* 1. Header Hero Stage */}
                    <Box className="relative pb-10">
                        <LinearGradient
                            colors={['#1b4b3dff', '#38ca99ff']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                height: 160,
                                borderBottomLeftRadius: 60,
                            }}
                        />

                        {/* Floating User Card */}
                        <Box
                            className="mx-6 bg-white rounded-[40px] p-4 shadow-2xl shadow-indigo-900/40"
                            style={{ marginTop: -80, elevation: 20 }}
                        >
                            <VStack space="xl">
                                <HStack space="lg" className="items-center">
                                    <TouchableOpacity onPress={() => {
                                        //if(user?.role == 'member') navigation.navigate('Main', { screen: 'ShowProfileGallery' })

                                        navigation.navigate('Main', { screen: user?.role == 'member' ? 'ShowProfileGallery' : 'ProfileUpload' })
                                    }}>
                                        <Box className="relative">
                                            <Box className="p-1 rounded-[24px] bg-slate-100 border-2 border-slate-50">
                                                <Avatar size="xl" className="rounded-[20px] bg-indigo-50">
                                                    <AvatarFallbackText className="font-bold text-indigo-700">{fullName}</AvatarFallbackText>
                                                    {profile && <AvatarImage source={{ uri: profile }} />}
                                                </Avatar>
                                            </Box>
                                            <Pressable
                                                onPress={() => navigation.navigate('Main', { screen: user?.role == 'member' ? 'ShowProfileGallery' : 'ProfileUpload' })}
                                                className="absolute -bottom-1 -right-1 bg-white p-2 rounded-2xl shadow-lg border border-slate-100 active:bg-slate-50"
                                            >
                                                <Icon as={Camera} size="sm" className="text-slate-600" />
                                            </Pressable>
                                        </Box>
                                    </TouchableOpacity>
                                    <VStack className="flex-1">
                                        <HStack space="xs" className="items-center">
                                            <Heading size="md" className="text-slate-900 font-black tracking-tighter flex-shrink">
                                                {fullName}
                                            </Heading>
                                            <Center className="bg-blue-100 w-5 h-5 rounded-full flex-shrink-0">
                                                <Icon as={CheckIcon} size={'md'} className="text-blue-600" />
                                            </Center>
                                        </HStack>
                                        <Text className="text-slate-400 font-medium text-xs mb-2"> ID: {user?.role === 'member' ? user?.profile_id : user?.userid}</Text>

                                        {user?.role !== 'member' && (
                                            <Box className="bg-salt-50 self-start px-3 py-1 rounded-full shadow-md shadow-salt-200 border-slate-100/50">
                                                <Text className="text-black font-black uppercase text-[8px] tracking-[1px]">
                                                    Role: {user?.role}
                                                </Text>
                                            </Box>
                                        )}
                                    </VStack>
                                </HStack>

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

                    {/* 2. Menu Items Navigation Links */}
                    <Box className="px-2">
                        <DrawerItemList {...props} />

                        <Divider className="my-4 mx-4 bg-slate-100" />

                        {/* Settings shows only for member roles here */}
                        {user?.role === 'member' && (
                            <Pressable
                                className="mx-2 p-3 rounded-2xl active:bg-indigo-50"
                                onPress={() => navigation.navigate('Main', { screen: 'MemberSettings' })}
                            >
                                <HStack className="items-center justify-between">
                                    <HStack space="md" className="items-center">
                                        <Center className="w-8 h-8 rounded-xl bg-slate-100">
                                            <Icon as={Settings} size="sm" className="text-slate-600" />
                                        </Center>
                                        <Text className="font-bold text-slate-700">Settings</Text>
                                    </HStack>
                                    <Icon as={ChevronRight} size="xs" className="text-slate-300" />
                                </HStack>
                            </Pressable>
                        )}
                    </Box>
                </Box>

                {/* BOTTOM SECTION: Branding Card with Logout Below It */}
                <Box className="pb-6 mt-auto">
                    {/* Logout Button Placed Below the Footer Card */}
                    <Pressable
                        className="mx-8 mt-5 p-3 mb-10 rounded-2xl active:bg-red-50 bg-slate-50 border border-slate-100"
                        onPress={() => logout()}
                    >
                        <HStack className="items-center justify-between">
                            <HStack space="md" className="items-center">
                                <Center className="w-8 h-8 rounded-xl bg-red-100">
                                    <Icon as={LogOut} size="sm" className="text-red-600" />
                                </Center>
                                <Text className="font-bold text-slate-700">Logout</Text>
                            </HStack>
                            <Icon as={ChevronRight} size="xs" className="text-slate-400" />
                        </HStack>
                    </Pressable>
                    {/* The Floating Footer Card (Branding Only) */}
                    <Box className="mx-6 bg-white rounded-[40px] p-5 shadow-2xl shadow-emerald-900/10 border border-slate-50">
                        <Box className="bg-slate-50 rounded-2xl p-4">
                            <VStack space="xs" className="items-center">
                                <Text className="text-slate-900 font-black text-[10px] tracking-[2px]">
                                    <Text className="text-emerald-600"> {lookups.appName}</Text>
                                </Text>
                                <HStack space="xs" className="items-center">
                                    <Text className="text-[9px] font-bold text-slate-400">V {lookups.appVersion}</Text>
                                    <Box className="w-1 h-1 rounded-full bg-slate-300" />
                                    <Text className="text-[9px] font-bold text-slate-400">© {getCurrentYear()}</Text>
                                </HStack>
                            </VStack>
                        </Box>
                    </Box>


                </Box>

            </VStack>
        </DrawerContentScrollView>

    );
}
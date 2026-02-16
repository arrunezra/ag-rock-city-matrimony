import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { Box, VStack, HStack, Avatar, AvatarImage, Text, Divider, AvatarFallbackText } from '@/src/components/common/GluestackUI';
import { Pressable } from 'react-native';
import { AddIcon, Icon } from '@/components/ui/icon';
import { LogOutIcon } from '../components/common/IconUI';
import { useAuth } from '@/src/context/AuthContext';
import { API_BASE_URL_DEV_Profiles_Thumbs } from '../utils/environment';
import { AvatarBadge } from '@/components/ui/avatar';

export default function CustomDrawerContent(props: any) {
    const { userRole, navigation, user, logout, onEdit } = props;
    const profileImage = API_BASE_URL_DEV_Profiles_Thumbs + '/' + user?.profileThumb;
    const currentYear = new Date().getFullYear();

    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            <Box className="bg-primary-600 px-4 py-10 rounded-xl mb-4">
                <HStack className="items-center gap-4">
                    <Box className="relative">
                        <Avatar size="xl" className="border-2 border-outline-100 bg-background-200 " >
                            <AvatarFallbackText> {user?.firstName} {user?.lastName}</AvatarFallbackText>
                            <AvatarImage
                                source={{
                                    uri: profileImage,
                                }}
                            />
                            <Pressable
                                onPress={onEdit}
                                className="absolute bottom-0 right-0 bg-cyan-500 p-1.5 rounded-full border-2 border-white shadow-sm active:opacity-80"
                            >
                                <Icon as={AddIcon} color="white" size="xs" />
                            </Pressable>
                        </Avatar>

                    </Box>


                    <VStack className="flex-1">
                        <Text className="text-white font-bold text-xl no-underline">
                            {user?.firstName + ' ' + user?.lastName || 'Guest User'}
                        </Text>
                        <Text className="text-primary-100 text-sm italic">
                            {user?.email || 'Not logged in'}
                        </Text>
                    </VStack>
                </HStack>
            </Box>

            {/* Default Drawer Items (Auto-generated from Drawer.Screens above) */}
            <DrawerItemList {...props} />

            <Divider className="my-4" />

            {/* Manual / Fixed Items */}
            <DrawerItem
                label="Settings"
                onPress={() => navigation.navigate('Settings')}
            />
            <Box className="mt-auto p-4">
                <Pressable
                    className="flex-row items-center p-3 rounded bg-red-50 active:opacity-70 w-full"
                    onPress={logout}
                >
                    <Icon as={LogOutIcon} className="text-red-600 mr-2" />
                    <Text className="text-red-600 font-bold">Logout</Text>
                </Pressable>
            </Box>

            {/* 3. Footer Section with Copyright Box */}
            <VStack className="p-4 gap-3 bg-background-50">


                {/* Separate Copyright Box */}
                <Box className="bg-white border border-outline-100 p-3 rounded-2xl shadow-sm">
                    <Text className="text-center text-[10px] text-typography-500 leading-4">
                        © {currentYear} My Shaadi.{"\n"}
                        All rights reserved.{"\n"}
                        <Text className="font-bold text-typography-400">Version 1.0.3</Text>
                    </Text>
                </Box>
            </VStack>


        </DrawerContentScrollView>

    );
}
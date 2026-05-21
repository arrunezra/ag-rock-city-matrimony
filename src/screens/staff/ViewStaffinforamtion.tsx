import { Avatar, AvatarFallbackText, AvatarImage, Badge, Box, Button, ButtonText, Heading, HStack, VStack } from '@/src/components/common/GluestackUI';
import { Hash, Icon, Phone, User } from '@/src/components/common/IconUI';
import StaffService from '@/src/services/StaffService';
import { ArrowLeft, Briefcase, Calendar, ChevronRight, Church, Edit3Icon, Hexagon, Home, Mail, MapPin, Navigation, Smartphone, UserCheck } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useCallback, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Linking } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import LinearGradient from 'react-native-linear-gradient';
import LoadingScreen from '../common/LoadingScreen';
import NotFoundScreen from '../common/NotFoundScreen';
import { useAuth } from '@/src/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { getExtension } from '@/src/utils/common';
const InfoRow = ({ label, value, icon: IconComponent, color = "#0891b2", isMultiline = false }: any) => (
    <HStack className="items-center gap-5 py-2">
        {/* Icon with soft tinted background */}
        <Box
            style={{ backgroundColor: `${color}10` }}
            className="h-12 w-12 items-center justify-center rounded-2xl border border-slate-100"
        >
            <Icon as={IconComponent} size="sm" style={{ color: color }} />
        </Box>

        <VStack className="flex-1">
            <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[1.5px] mb-0.5">
                {label}
            </Text>
            <Text
                className={`text-slate-900 font-bold ${isMultiline ? 'text-sm leading-5' : 'text-base'}`}
            >
                {value || "Not Set"}
            </Text>
        </VStack>

        <Icon as={ChevronRight} size="xs" className="text-slate-300" />
    </HStack>
);
const GlassTile = ({ label, value }: any) => (
    <Box className="bg-slate-50 border border-slate-100 p-5 rounded-[24px]">
        <VStack>
            <Text className="text-cyan-600 text-[9px] font-black uppercase tracking-widest mb-1">
                {label}
            </Text>
            <Text className="text-slate-800 text-base font-extrabold tracking-tight">
                {value || "Not Specified"}
            </Text>
        </VStack>
    </Box>
);
const ViewStaffinforamtion = ({ navigation, route }: any) => {
    const { id } = route.params; // Get the ID from navigation
    const { user } = useAuth();

    //console.log('ViewStaffinforamtion id=', id);
    const [formData, setFormData] = useState({
        id: id,
        firstName: '',
        lastName: '',
        staffId: '',
        department: '',
        designation: '',
        church_id: '',
        mobileNo: '',
        email: '',
        address: '',
        role: '',
        joiningDate: new Date(),
        joiningDateLabel: '',
        altMobileNo: '',
        state: null,
        city: null,
        selected_pastor: '',
        selected_address: '',
        church_name: '',
        alrenativeMobileNo: '',
        city_name: '',
        state_name: '',
        church_address: '',
        pastor_name: '',
        updated_at: '',
        activeStatus: '',
    });
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<any>('');

    useFocusEffect(
        useCallback(() => {
            //console.log(getExtension(user?.profilePic, 'url'))
            setProfile(getExtension(user?.profilePic, 'url'))
        }, [])
    );
    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                setIsLoading(true);
                const response = await StaffService.fetchStaffById(id);
                console.log('fetchStaffById', response);
                if (response) {
                    setFormData(response.data);
                }
            } catch (error) {
                console.error('Error fetching staff data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStaffData();
    }, [id]);
    if (isLoading) {
        return <LoadingScreen />
    }
    if (!formData) return <NotFoundScreen />

    return (
        <Box className="flex-1 bg-[#f8fafc]">
            <Box className="flex-1 bg-[#f8fafc]">
                <KeyboardAwareScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                    {/* --- Header & Round Avatar --- */}
                    <Box className="relative h-[320px] justify-center items-center">
                        <LinearGradient
                            colors={['#0097b2', '#00bcd4', '#f8fafc']}
                            className="absolute inset-0"
                        />
                        <Box className="absolute top-12 left-6 z-10">
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={() => {
                                    navigation.navigate("StaffDashboard");
                                }}
                                className="h-11 w-11 bg-white/20 rounded-full items-center justify-center border border-white/40 backdrop-blur-md"
                            >
                                <Icon
                                    as={ArrowLeft}
                                    size="md"
                                    className="text-white"
                                />
                            </TouchableOpacity>
                        </Box>
                        <VStack className="items-center mt-4">
                            {/* Outer Ring: Removed padding to allow the image to hit the edges */}
                            <Box className="h-32 w-32 rounded-full bg-white shadow-2xl shadow-cyan-900/40 border-[3px] border-white relative items-center justify-center overflow-hidden">

                                {/* Avatar: Set to fill 100% of the parent box */}
                                <Avatar className="h-full w-full rounded-full">
                                    <AvatarFallbackText className="font-bold text-2xl">
                                        {formData.firstName}{formData.lastName}
                                    </AvatarFallbackText>
                                    {profile && <AvatarImage source={{ uri: profile }} className="h-full w-full" />}
                                    {/* <AvatarImage
                                        source={{ uri: 'https://agrcdev.jeasuns.com/agrcdev/php/uploads/profiles/thumbs/AG0126-94693_1769585743_thumbnail.jpg' }}
                                        className="h-full w-full"
                                    /> */}
                                </Avatar>

                                {/* Status Badge: Placed precisely on the edge */}
                                <Box
                                    className={`absolute bottom-2 right-2 h-6 w-6 rounded-full border-[3px] border-white z-10 ${formData.activeStatus === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                                        }`}
                                />
                            </Box>

                            <VStack className="items-center mt-5">
                                <Heading className="text-[24px] text-slate-900  font-black tracking-tight leading-tight">
                                    {formData.firstName} {formData.lastName}
                                </Heading>
                                <Text className="text-cyan-600 font-bold uppercase text-[14px] tracking-[2px] mt-1">
                                    {formData.designation || 'ADMINISTRATOR'}
                                </Text>
                            </VStack>
                        </VStack>
                    </Box>

                    {/* --- Content Area --- */}
                    <VStack className="px-6 gap-6 -mt-10 pb-40">

                        {/* Personal & Contact Card */}
                        <Box className="bg-white p-7 rounded-[40px] shadow-xl shadow-slate-200/50 border border-white">
                            <VStack className="gap-6">
                                <TouchableOpacity
                                    onPress={() => {
                                        if (formData.mobileNo) Linking.openURL(`tel:${formData.mobileNo}`);
                                    }}
                                >
                                    <InfoRow label="Primary Mobile" value={formData.mobileNo} icon={Phone} color="#0891b2" />
                                </TouchableOpacity>

                                {/* alrenativeMobileNo */}
                                {formData.alrenativeMobileNo && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (formData.alrenativeMobileNo) Linking.openURL(`tel:${formData.alrenativeMobileNo}`);
                                        }}
                                    >
                                        <InfoRow label="Alternative Mobile" value={formData.alrenativeMobileNo} icon={Smartphone} color="#0d9488" />
                                    </TouchableOpacity>
                                )}

                                {/* city_name & state_name */}
                                <InfoRow
                                    label="Location"
                                    value={formData.city_name ? `${formData.city_name}, ${formData.state_name}` : "Not Set"}
                                    icon={MapPin}
                                    color="#4f46e5"
                                />

                                {/* address */}
                                <InfoRow label="Residential Address" value={formData.address} icon={Home} color="#64748b" isMultiline />
                            </VStack>
                        </Box>

                        {/* Church Affiliation Card */}
                        <Box className="bg-white p-7 rounded-[40px] shadow-xl shadow-slate-200/50 border border-white">
                            <HStack className="items-center gap-3 mb-6">
                                <Box className="bg-cyan-500 p-2 rounded-xl">
                                    <Icon as={Church} size="sm" className="text-white" />
                                </Box>
                                <Text className="text-slate-900 font-black text-xl">Church Details</Text>
                            </HStack>

                            <VStack className="gap-3">
                                {/* church_name */}
                                <GlassTile label="Church Name" value={formData.church_name} />
                                {/* pastor_name */}
                                <GlassTile label="Pastor Name" value={formData.pastor_name} />

                                {/* church_address */}
                                <GlassTile label="Branch Address" value={formData.church_address} />
                            </VStack>
                        </Box>
                    </VStack>
                </KeyboardAwareScrollView>
                {/* --- Floating Action Button (FAB) --- */}


                <MotiView
                    from={{ scale: 0, opacity: 0, translateY: 50 }}
                    animate={{ scale: 1, opacity: 1, translateY: 0 }}
                    transition={{
                        type: 'spring',
                        damping: 15,
                        stiffness: 150,
                        delay: 400
                    }}
                    className="absolute bottom-8 right-8"
                >
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.navigate("Main", {
                            screen: "StaffRegistration",
                            params: { id: id, isEdit: true }
                        })}
                        // Added rounded-full and overflow-hidden here
                        className="h-16 w-16 rounded-full overflow-hidden shadow-2xl shadow-cyan-500/50"
                        style={{ elevation: 10 }}
                    >
                        <LinearGradient
                            colors={['#0891b2', '#0e7490']}
                            // Ensure the gradient also has rounded-full
                            className="h-full w-full rounded-full items-center justify-center"
                        >
                            <Icon as={Edit3Icon} size="lg" className="text-cyan-400" />
                        </LinearGradient>
                    </TouchableOpacity>
                </MotiView>

            </Box>
        </Box>
    );
};

export default ViewStaffinforamtion;

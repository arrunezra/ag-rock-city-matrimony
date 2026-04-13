import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from "@d11/react-native-fast-image";

import { Box, VStack, HStack, Heading, Text, Button, ButtonIcon } from '@/src/components/common/GluestackUI';
import { Briefcase, Heart, Icon, MapPin } from '@/src/components/common/IconUI';
import profileService from '@/src/services/profileService';
import { API_BASE_URL_DEV_Profiles_Images, API_BASE_URL_DEV_Profiles_Thumbs } from '@/src/utils/environment';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CheckCircle2Icon, CheckCircleIcon, UsersIcon } from 'lucide-react-native';
import { formatHeight } from '@/src/utils/common';
export const ProfileCard = ({ profile, onPress, user }: any) => {
  console.log('ProfileCard', profile)
  const [isLiked, setIsLiked] = useState(false);
  const [isReady, setIsReady] = useState(false);
  // 1. Get Screen Height to calculate dynamic card size
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  const CARD_HEIGHT = SCREEN_HEIGHT * 0.72; // 70% of screen height

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <Box className="flex-1 bg-white" />; // Empty white screen during transition
  }
  const sendConnectRequst = async () => {
    try {
      setIsLiked(true);
      const response = await profileService.sendInterest({ receiver_id: profile?.profile_id });
      if (!response.success) {
        setIsLiked(false);
        Alert.alert(response.message);
      }
    } catch (error) {
      setIsLiked(false);
      console.error("Like failed", error);
    }
  };

  const handleLike = async () => {

  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.95} className="mx-2 mb-8">
      <Box
        style={{ height: CARD_HEIGHT }}
        className="w-full rounded-[40px] overflow-hidden shadow-2xl bg-background-100 border border-white/20"
      >
        {/* 1. Background Image */}
        {profile.file_name ? (
          <FastImage
            source={{
              uri: `${API_BASE_URL_DEV_Profiles_Images}/${profile.file_name}`,
              priority: FastImage.priority.high,
            }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <Box className="flex-1 justify-center items-center bg-slate-100">
            <LottieView
              source={require('../../assets/animations/default_profile.json')}
              autoPlay
              loop
              style={{ width: '70%', height: '70%' }}
            />
          </Box>
        )}

        {/* 2. Top Action Bar */}
        <HStack className="absolute top-6 left-6 right-6 justify-between items-center">
          <TouchableOpacity onPress={sendConnectRequst} activeOpacity={0.8}>
            {/* Replaced BlurView with a solid/alpha Box */}
            <Box className="bg-black/50 px-5 py-2.5 rounded-full flex-row items-center gap-2 border border-white/20">
              <Icon as={CheckCircle2Icon} size="xs" className="text-cyan-400" />
              <Text className="text-white text-[11px] font-bold uppercase tracking-[1px]">Connect</Text>
            </Box>
          </TouchableOpacity>

          <Button
            onPress={handleLike}
            // Increased background opacity for better visibility without blur
            className={`h-14 w-14 mt-2 rounded-full p-0 shadow-2xl border border-white/30 ${isLiked ? 'bg-error-500' : 'bg-black/40'
              }`}
          >
            <Icon
              as={Heart}
              size="lg"
              className={isLiked ? 'text-white fill-white' : 'text-white'}
            />
          </Button>
        </HStack>

        {/* 3. Information Scrim */}
        <LinearGradient
          // Deepened the gradient stops to compensate for the lack of blur
          colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.98)']}
          locations={[0, 0.3, 0.6, 1]}
          className="absolute bottom-0 left-0 right-0 h-[65%] justify-end p-7"
        >
          <VStack space="md">
            <VStack space="xs">
              <HStack className="items-center gap-2">
                <Heading className="text-white text-4xl font-black tracking-tight">
                  {profile.full_name}, {profile?.age}
                </Heading>
                {profile?.IsVerified === 1 && (
                  <Icon as={CheckCircleIcon} className="text-blue-400" size="md" />
                )}
              </HStack>

              <HStack className="items-center gap-2">
                {/* Status Dot with Glow */}
                <Box className="h-2.5 w-2.5 rounded-full bg-green-500 border border-white/20" />
                <Text className="text-white/80 text-sm font-medium">Recently Active</Text>
              </HStack>
            </VStack>

            {/* Profile Details */}
            <Text className="text-white/90 text-[16px] font-medium leading-6">
              {formatHeight(profile?.height)}
              {formatHeight(profile?.height) && profile?.sub_community_name ? `  •  ${profile.sub_community_name}` : ''}
              {/* {profile?.religion_name ? `  •  ${profile.religion_name}` : ''} */}
              {profile?.work_with_name ? `  •  ${profile.work_with_name}` : ''}

              {/* {formatHeight(profile?.height)} {formatHeight(profile?.height) && profile?.sub_community_name && (
                <>  •  {profile?.sub_community_name}</>
              )}

              {profile?.community && profile?.work_details && (
                <>  •  {profile?.work_details}</>
              )} */}
            </Text>

            {/* Info Pills using alpha colors */}
            <HStack space="sm" className="flex-wrap gap-2">
              <Box className="bg-white/20 px-3 py-2 rounded-xl border border-white/10 flex-row items-center gap-2">
                <Icon as={MapPin} size="xs" className="text-cyan-300" />
                <Text className="text-white text-xs font-bold">{profile.city_name} , {profile?.state_name}</Text>
              </Box>



              {/* {user?.role === 'member' && (
                <Box className="bg-indigo-600/40 px-3 py-2 rounded-xl border border-indigo-400/30 flex-row items-center gap-2">
                  <Icon as={UsersIcon} size="xs" className="text-indigo-300" />
                  <Text className="text-indigo-100 text-xs font-bold">Great Match</Text>
                </Box>
              )} */}
            </HStack>
          </VStack>
        </LinearGradient>
      </Box>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  photoImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
});

import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from "@d11/react-native-fast-image";

import { Box, VStack, HStack, Heading, Text, Button, ButtonIcon } from '@/src/components/common/GluestackUI';
import { Briefcase, Heart, Icon, MapPin } from '@/src/components/common/IconUI';
import profileService from '@/src/services/profileService';
import { API_BASE_URL_DEV_Profiles_Images, API_BASE_URL_DEV_Profiles_Thumbs } from '@/src/utils/environment';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CheckCircle2Icon } from 'lucide-react-native';
export const ProfileCard = ({ profile, onPress }: any) => {
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
  const handleLike = async () => {
    try {
      setIsLiked(true);
      const response = await profileService.sendInterest({ receiver_id: profile.id });
      if (!response.success) {
        setIsLiked(false);
        Alert.alert(response.message);
      }
    } catch (error) {
      setIsLiked(false);
      console.error("Like failed", error);
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.95} className="mx-2 mb-8">
      <Box
        style={{ height: CARD_HEIGHT }}
        className="w-full rounded-[40px] overflow-hidden shadow-2xl bg-background-100 border border-white/10"      >
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

        {/* 2. Top Badges - Improved Spacing */}
        <HStack className="absolute top-5 left-5 right-5 justify-between items-start">
          <Box className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-full flex-row items-center gap-2 border border-white/20">
            <Icon as={CheckCircle2Icon} size="xs" className="text-cyan-400" />
            <Text className="text-white text-[10px] font-black uppercase tracking-widest">Connect</Text>
          </Box>

          <Button
            onPress={handleLike}
            className={`h-14 w-14 rounded-full p-0 shadow-2xl ${isLiked ? 'bg-error-500' : 'bg-white/20'}`}
          >
            <Icon
              as={Heart}
              size="lg"
              className={isLiked ? 'text-white fill-white' : 'text-white'}
            />
          </Button>
        </HStack>

        {/* 3. The Scrim Gradient - Deepened for "Full Size" look */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.9)']}
          className="absolute bottom-0 left-0 right-0 h-1/2 justify-end p-8"
        >
          <VStack space="lg">
            {/* Name & Age */}
            <VStack>
              <Heading className="text-white text-4xl font-black tracking-tight">
                {profile.full_name}, {profile.age || '28'}
              </Heading>
              {/* Added a subtle location text under name for full-size context */}
              <Text className="text-white/60 text-sm font-medium">Active recently</Text>
            </VStack>

            {/* Info Pills */}
            <HStack space="sm" className="flex-wrap gap-2">
              <Box className="bg-white/15 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20 flex-row items-center space-x-2">
                <Icon as={MapPin} size="sm" className="text-cyan-300" />
                <Text className="text-white text-sm font-bold">{profile.city_name}</Text>
              </Box>

              <Box className="bg-white/15 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/20 flex-row items-center space-x-2">
                <Icon as={Briefcase} size="sm" className="text-cyan-300" />
                <Text className="text-white text-sm font-bold" numberOfLines={1}>
                  {profile.work_with}
                </Text>
              </Box>
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

import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from "@d11/react-native-fast-image";

import { Box, VStack, HStack, Heading, Text, Button, ButtonIcon } from '@/src/components/common/GluestackUI';
import { Briefcase, Heart, Icon, MapPin } from '@/src/components/common/IconUI';
import profileService from '@/src/services/profileService';
import { API_BASE_URL_DEV_Profiles_Thumbs } from '@/src/utils/environment';
import LottieView from 'lottie-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { CheckCircle2, CheckCircle2Icon, Star } from 'lucide-react-native';
import { InteractionManager } from 'react-native';
export const ProfileCard = ({ profile, onPress }: any) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    // Setting a timeout of 0 or 50ms pushes the 'setIsReady' 
    // to the next tick of the JS engine.
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
    <TouchableOpacity onPress={onPress} activeOpacity={0.95} className="mx-4 mb-6">
      <Box className="h-[420px] w-full rounded-[32px] overflow-hidden shadow-lg bg-background-100 border border-white/20">

        {/* 1. Background Image / Animation */}
        {profile.profile_thumb ? (
          <FastImage
            source={{
              uri: `${API_BASE_URL_DEV_Profiles_Thumbs}/${profile.profile_thumb}`,
              priority: FastImage.priority.high,
            }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        ) : (
          <Box className="flex-1 justify-center items-center bg-gray-50">
            <LottieView
              source={require('../../assets/animations/default_profile.json')}
              autoPlay
              loop
              style={{ width: '80%', height: '80%' }}
            />
          </Box>
        )}

        {/* 2. Top Badges (Floating) */}
        <HStack className="absolute top-4 left-4 right-4 justify-between items-start">
          <Box className="bg-black/30 px-3 py-1.5 rounded-full flex-row items-center gap-1">
            <Icon as={CheckCircle2Icon} size="xs" className="text-cyan-400" />
            <Text className="text-white text-[10px] font-bold uppercase tracking-wider">Verified</Text>
          </Box>

          <Button
            onPress={handleLike}
            className={`h-12 w-12 rounded-full p-0 shadow-xl ${isLiked ? 'bg-error-500' : 'bg-white/20'}`}
          >
            <Icon as={Heart} className={isLiked ? 'text-white fill-white' : 'text-white'} />
          </Button>
        </HStack>



        {/* 3. The Scrim Gradient (Darkens bottom for text readability) */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
          className="absolute bottom-0 left-0 right-0 h-1/2 justify-end p-6"
        >
          {/* <VStack space="xs">
            <HStack className="items-center gap-2">
              <Heading size="xl" className="text-white">
                {profile.first_name}, {profile.age || '28'}
              </Heading>
            </HStack>

            <HStack className="items-center gap-4">
              <HStack className="items-center gap-1">
                <Icon as={MapPin} size="xs" className="text-white/70" />
                <Text className="text-white/80 text-sm">{profile.community || 'Tamil'}</Text>
              </HStack>
              <HStack className="items-center gap-1">
                <Icon as={Briefcase} size="xs" className="text-white/70" />
                <Text className="text-white/80 text-sm truncate max-w-[150px]">
                  {profile.work_sector || 'Software Engineer'}
                </Text>
              </HStack>
            </HStack>
          </VStack> */}
          <VStack space="md">
            {/* Name & Age with Online Status Indicator */}
            <HStack className="items-center space-x-3">
              <Heading className="text-white text-3xl font-black tracking-tight">
                {profile.first_name}, {profile.age || '28'}
              </Heading>
            </HStack>

            {/* Info Pills (Glass Style) */}
            <HStack space="sm" className="flex-wrap gap-2">
              <Box className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex-row items-center space-x-1.5">
                <Icon as={MapPin} size='lg' className="text-cyan-300" />
                <Text className="text-white/90 text-xs font-bold">{profile.city || 'Mumbai'}</Text>
              </Box>

              <Box className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex-row items-center space-x-1.5">
                <Icon as={Briefcase} size='md' className="text-cyan-300" />
                <Text className="text-white/90 text-xs font-bold truncate max-w-[120px]">
                  {profile.work_sector || 'Software Engineer'}
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

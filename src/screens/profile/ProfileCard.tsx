import React, { useState } from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from "@d11/react-native-fast-image";

import { Box, VStack, HStack, Heading, Text, Button, ButtonIcon } from '@/src/components/common/GluestackUI';
import { Briefcase, Heart, Icon, MapPin } from '@/src/components/common/IconUI';
import profileService from '@/src/services/profileService';
import { API_BASE_URL_DEV_Profiles_Images, API_BASE_URL_DEV_Profiles_Thumbs, BOY_DEFAULT_PROFILE, GIRL_DEFAULT_PROFILE } from '@/src/utils/environment';
import LottieView from 'lottie-react-native';
// import { MapPin, Briefcase, Heart } from 'lucide-react-native';
export const ProfileCard = ({ profile, onPress }: any) => {
  console.log(profile);
  const [isLiked, setIsLiked] = useState(false);
  const handleLike = async () => {
    try {
      // Optimistic UI update
      setIsLiked(true);

      const response = await profileService.sendInterest({
        receiver_id: profile.id
      });

      if (!response.success) {
        // Revert if server fails
        setIsLiked(false);
        Alert.alert(response.message);
      }
    } catch (error) {
      setIsLiked(false);
      console.error("Like failed", error);
    }
  };
  const getProfileSource = () => {
    // Check if a remote thumb actually exists
    if (profile.profile_thumb) {
      return <FastImage
        source={{
          uri: `${API_BASE_URL_DEV_Profiles_Thumbs}/${profile.profile_thumb}`,
          priority: FastImage.priority.high,
          cache: FastImage.cacheControl.immutable,
        }}
        style={{ width: '100%', height: '100%' }}
        resizeMode={FastImage.resizeMode.cover}
      />

    } else {
      return <Box className="h-72 w-full bg-background-100">
        <LottieView
          source={require('../../assets/animations/Artboard.json')}
          autoPlay
          loop={false}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        />
        {/* The Overlay Layer */}
        {/* The Overlay - Positioned Middle Bottom */}
        <Box
          className="absolute bottom-6 self-center bg-white/70 px-6 py-2 rounded-full shadow-sm"
          style={{ zIndex: 10 }}
        >
          <Text className="text-center text-typography-900 font-semibold text-sm">
            No Profile Image
          </Text>
        </Box>
      </Box>
    }
  }
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Box className="bg-white rounded-3xl mb-5 overflow-hidden border border-outline-100 shadow-sm">
        {/* Main Image */}
        <Box className="h-72 w-full bg-background-100">
          {getProfileSource()}
        </Box>

        {/* Quick Info Overlay (optional) or Bottom Info */}
        <VStack className="p-5 gap-3">
          <HStack className="justify-between items-center">
            <VStack>
              <Heading size="xl" className="text-typography-900">
                {profile.first_name}, {profile.age || '28'}
              </Heading>
              <Button
                variant="outline"
                onPress={handleLike}
                className={`rounded-full h-12 w-12 p-0 ${isLiked ? 'bg-error-50 border-error-200' : 'border-outline-200'}`}
              >
                <Icon
                  as={Heart}
                  className={isLiked ? 'text-error-600 fill-error-600' : 'text-typography-400'}
                />
              </Button>

              <HStack className="items-center gap-1">
                <Icon as={MapPin} size="xs" className="text-typography-400" />
                <Text size="sm" className="text-typography-500">{profile.community || 'Tamil'}</Text>
              </HStack>
            </VStack>

            <Button variant="outline" className="rounded-full border-outline-200 h-12 w-12 p-0">
              <Icon as={Heart} className="text-error-500" />
            </Button>
          </HStack>

          <HStack className="items-center gap-2">
            <Icon as={Briefcase} size="sm" className="text-cyan-600" />
            <Text size="sm" className="text-typography-700 font-medium">
              {profile.work_sector || 'Software Engineer'}
            </Text>
          </HStack>
        </VStack>
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

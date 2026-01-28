import React from 'react';
import { ScrollView, Image } from 'react-native';
import { Box, VStack, HStack, Heading, Text, BadgeText, Divider, } from '@/src/components/common/GluestackUI';
import { Badge } from '@/src/components/common/IconUI';
import { API_BASE_URL_DEV_Profiles_Images, API_BASE_URL_DEV_Profiles_Thumbs } from '@/src/utils/environment';
import FastImage from "@d11/react-native-fast-image";
import LottieView from 'lottie-react-native';

export default function ProfileDetailScreen({ route }: any) {
  const { profile } = route.params;
  const getProfileSource = () => {
    // Check if a remote thumb actually exists
    if (profile.profile_pic) {
      return <FastImage
        source={{
          uri: `${API_BASE_URL_DEV_Profiles_Images}/${profile.profile_pic}`,
          priority: FastImage.priority.high,
          cache: FastImage.cacheControl.immutable,
        }}
        style={{ width: '100%', height: '100%' }}
        resizeMode={FastImage.resizeMode.cover}
      />

    } else {
      return <Box className="h-full w-full bg-background-100">
        <LottieView
          source={require('../../assets/animations/Artboard.json')}
          autoPlay
          loop={false}
          style={{ width: '100%', height: '100%', position: 'absolute' }}
        />
        {/* The Overlay Layer */}
        {/* The Overlay - Positioned Middle Bottom */}
        <Box
          className="absolute bottom-6 self-center bg-white/70 px-6 py-2 rounded-full shadow-md"
          style={{ zIndex: 10 }}
        >
          <Text className="text-center text-typography-900 font-semibold text-md">
            No Profile Image
          </Text>
        </Box>
      </Box>
    }
  }
  return (
    <Box className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Large Header Image */}
        <Box className="h-[450px] w-full">
          {getProfileSource()}
        </Box>

        <VStack className="p-6 gap-6 -mt-8 bg-white rounded-t-[40px]">
          {/* Header Info */}
          <VStack className="gap-1">
            <Heading size="2xl">{profile.first_name} {profile.last_name}</Heading>
            <Text size="lg" className="text-typography-500">{profile.age} yrs • {profile.religion}</Text>
          </VStack>

          <Divider className="bg-outline-50" />

          {/* About Section */}
          <VStack className="gap-2">
            <Heading size="md">About</Heading>
            <Text className="text-typography-600 leading-6">
              I am a {profile.work_sector} based in India. I value {profile.religion} traditions and am looking for someone who shares similar values.
            </Text>
          </VStack>

          {/* Details Grid */}
          <VStack className="gap-4">
            <Heading size="md">Professional Details</Heading>
            <HStack className="flex-wrap gap-4">
              <DetailItem label="Profession" value={profile.work_sector} />
              <DetailItem label="Income" value={profile.income_range || '10-15 LPA'} />
              <DetailItem label="Community" value={profile.community} />
            </HStack>
          </VStack>

          {/* Interests Section */}
          <VStack className="gap-3 mb-10">
            <Heading size="md">Interests & Hobbies</Heading>
            <HStack className="flex-wrap gap-2">
              {profile.hobbies && JSON.parse(profile.hobbies).map((hobby: string) => (
                <Badge key={hobby} className="rounded-full border-cyan-200 bg-cyan-50">
                  <BadgeText className="text-cyan-700">{hobby}</BadgeText>
                </Badge>
              ))}
            </HStack>
          </VStack>
        </VStack>
      </ScrollView>
    </Box>
  );
}

// Small helper for detail rows
const DetailItem = ({ label, value }: any) => (
  <VStack className="w-[45%] bg-background-50 p-3 rounded-xl border border-outline-50">
    <Text size="xs" className="text-typography-400 uppercase font-bold">{label}</Text>
    <Text size="sm" className="text-typography-900 font-medium">{value}</Text>
  </VStack>
);
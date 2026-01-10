import React from 'react';
import { ScrollView, Image } from 'react-native';
import { Box, VStack, HStack, Heading, Text, BadgeText, Divider, } from '@/src/components/common/GluestackUI';
import { Badge } from '@/src/components/common/IconUI';

export default function ProfileDetailScreen({ route }: any) {
  const { profile } = route.params;

  return (
    <Box className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Large Header Image */}
        <Box className="h-[450px] w-full">
          <Image source={{ uri: profile.profile_pic }} className="w-full h-full" resizeMode="cover" />
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
import { Box, VStack, HStack, Text, Heading,  Divider, Button, ButtonText, Avatar, AvatarFallbackText  } from '@/src/components/common/GluestackUI';
import { Briefcase, Calendar, Icon, MapPin, MessageSquare, Phone } from '@/src/components/common/IconUI';
import React from 'react';
import { ScrollView, Linking, Pressable } from 'react-native';
  
export default function StaffDetailScreen({ route }: any) {
  const { staff } = route.params; // Get staff data from navigation

  const InfoRow = ({ icon, label, value, isPhone = false }: any) => (
    <Pressable 
      onPress={() => isPhone && Linking.openURL(`tel:${value}`)}
      className="py-4"
    >
      <HStack className="items-center gap-4">
        <Box className="bg-primary-50 p-2 rounded-full">
          <Icon as={icon} size="sm" className="text-primary-600" />
        </Box>
        <VStack>
          <Text size="xs" className="text-typography-400 uppercase font-bold">{label}</Text>
          <Text className="text-md text-typography-900 font-medium">{value || 'Not Provided'}</Text>
        </VStack>
      </HStack>
    </Pressable>
  );

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header Profile Section */}
      <Box className="bg-primary-600 p-8 items-center">
        <Avatar size="2xl" className="bg-white border-4 border-primary-400 shadow-xl">
          <AvatarFallbackText className="text-primary-600 text-2xl font-bold">
            {staff.Firstname.charAt(0)}{staff.LastName.charAt(0)}
          </AvatarFallbackText>
        </Avatar>
        <Heading size="xl" className="text-white mt-4">{staff.Firstname} {staff.LastName}</Heading>
        <Text className="text-primary-100 italic">{staff.designation}</Text>
        
        <HStack className="mt-6 gap-4">
          <Button size="sm" className="rounded-full bg-white" onPress={() => Linking.openURL(`tel:${staff.MobileNo1}`)}>
             <Icon as={Phone} size="xs" className="text-primary-600 mr-2" />
             <ButtonText className="text-primary-600">Call</ButtonText>
          </Button>
          <Button size="sm" variant="outline" className="rounded-full border-white" onPress={() => Linking.openURL(`sms:${staff.MobileNo1}`)}>
             <Icon as={MessageSquare} size="xs" className="text-white mr-2" />
             <ButtonText className="text-white">Message</ButtonText>
          </Button>
        </HStack>
      </Box>

      {/* Details Body */}
      <VStack className="p-6">
        <Heading size="md" className="mb-2">Professional Details</Heading>
        <Box className="bg-background-50 rounded-2xl p-4">
          <InfoRow icon={Briefcase} label="Department" value={staff.Department} />
          <Divider />
          <InfoRow icon={Briefcase} label="Role" value={staff.Role} />
          <Divider />
          <InfoRow icon={Calendar} label="Staff ID" value={staff.staff_id} />
        </Box>

        <Heading size="md" className="mt-8 mb-2">Contact Information</Heading>
        <Box className="bg-background-50 rounded-2xl p-4">
          <InfoRow icon={Phone} label="Primary Mobile" value={staff.MobileNo1} isPhone />
          <Divider />
          <InfoRow icon={Phone} label="Alternative Mobile" value={staff.AlrenativemobileNO} isPhone />
          <Divider />
          <InfoRow icon={MapPin} label="Residential Address" value={staff.Address} />
        </Box>
      </VStack>
    </ScrollView>
  );
}
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text } from 'react-native';
import { Box, VStack, Heading, Input, InputField, Button, ButtonText, Spinner, useToast, Toast, ToastTitle, Center, Avatar, AvatarImage } from '@/src/components/common/GluestackUI';
import api from '@/src/api/api';
import { launchImageLibrary } from 'react-native-image-picker';
import { CameraIcon, Icon } from '@/src/components/common/IconUI';

export default function EditProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    work_sector: '',
    income_range: '',
    hobbies: [],
    profile_thumb: '',
  });

  const toast = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get('/manage_profile.php');
        if (res.data.success) {
          const data = res.data.data;
          setProfileData({
            ...data,
            hobbies: data.hobbies ? JSON.parse(data.hobbies) : []
          });
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    loadData();
  }, []);
  
    const handleImagePick = async () => {
    const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: true, // Useful for smaller thumbnails
    });

    if (result.assets && result.assets[0]) {
        uploadImage(result.assets[0]);
    }
    };
    const uploadImage = async (asset: any) => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('profile_image', {
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName || 'profile.jpg',
            } as any);

            const res = await api.post('/update_photo.php', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.data.success) {
            // Update local state to show new photo immediately
            setProfileData({ ...profileData, profile_thumb: res.data.url });
            toast.show({ render: () => <Toast><ToastTitle>Photo Updated!</ToastTitle></Toast> });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await api.post('/manage_profile.php', profileData);
      if (res.data.success) {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toast nativeID={id} action="success" variant="solid">
              <ToastTitle>Profile Updated Successfully</ToastTitle>
            </Toast>
          ),
        });
      }
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  if (loading) return <Box className="flex-1 justify-center"><Spinner size="large" /></Box>;

  return (
    <ScrollView className="flex-1 bg-white">
      <VStack className="p-6 gap-6">
        <Heading size="xl">Edit Profile</Heading>

        <Center className="py-8 bg-background-50">
            <Pressable onPress={handleImagePick}>
                <Box className="relative">
                <Avatar size="2xl" className="border-4 border-white shadow-lg">
                    <AvatarImage source={{ uri: profileData.profile_thumb }} />
                </Avatar>
                {/* Camera Icon Overlay */}
                <Box className="absolute bottom-0 right-0 bg-primary-600 p-2 rounded-full border-2 border-white">
                    <Icon as={CameraIcon} className="text-white" size="xs" />
                </Box>
                </Box>
            </Pressable>
            <Text className="mt-4 text-sm text-typography-500">Tap to change profile photo</Text>
        </Center>

        <VStack className="gap-2">
          <Heading size="sm">Work Sector</Heading>
          <Input variant="outline" size="md">
            <InputField 
              value={profileData.work_sector} 
              onChangeText={(val) => setProfileData({...profileData, work_sector: val})}
              placeholder="e.g. Software Engineer" 
            />
          </Input>
        </VStack>

        <VStack className="gap-2">
          <Heading size="sm">Annual Income</Heading>
          <Input variant="outline" size="md">
            <InputField 
              value={profileData.income_range} 
              onChangeText={(val) => setProfileData({...profileData, income_range: val})}
              placeholder="e.g. 10-15 LPA" 
            />
          </Input>
        </VStack>

        <Button 
          className="mt-4 bg-primary-600 h-12 rounded-lg" 
          onPress={handleUpdate}
          isDisabled={saving}
        >
          {saving ? <Spinner color="$white" /> : <ButtonText>Save Changes</ButtonText>}
        </Button>
      </VStack>
    </ScrollView>
  );
}
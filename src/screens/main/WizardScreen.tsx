import React, { useState } from 'react';
import { Alert, Image, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Box, 
  VStack, 
  HStack, 
  Button, 
  ButtonText, 
  Text, 
  Progress, 
  ProgressFilledTrack,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  Heading, 
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  Spinner 
} from '@/src/components/common/GluestackUI'; 
import { 
  Icon,
  ChevronLeftIcon,
  ChevronDownIcon, 
} from '@/src/components/common/IconUI';
import { launchImageLibrary } from 'react-native-image-picker'; // Add this
import api from '@/src/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SuccessScreen from '../common/SuccessScreen';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Helper component for the rounded "Pill" selection (Step 1)
const SelectionPill = ({ label, isSelected, onSelect }: any) => (
  <Button 
    variant="outline" 
    onPress={onSelect}
    // Matches the pill design in step1.jpeg
    className={`rounded-full px-5 py-2 border-outline-300 ${isSelected ? 'bg-cyan-600 border-cyan-600' : 'bg-white'}`}
  >
    <ButtonText className={isSelected ? 'text-white' : 'text-typography-700 font-medium'}>
      {label}
    </ButtonText>
  </Button>
);

export default function WizardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const [step, setStep] = useState(1);
  const totalSteps = 10;
  const progress = (step / totalSteps) * 100;
  // 1. Add this to your Form State
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  // State for Upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [isFinished, setIsFinished] = useState(false);
  // Form State
  const [profileFor, setProfileFor] = useState('My Son');
  const [formData, setFormData] = useState({
    firstName: 'Arun',
    lastName: 'Ezra',
    dobDay: '12',
    dobMonth: '06',
    dobYear: '1991',
    religion: 'Christian',
    community: 'Tamil',
    profilePic: null,  
    profileThumb: null,  
  });

  const nextStep = () => step < totalSteps && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);
  
  // 2. Logic to toggle hobbies
  const toggleHobby = (hobby: string) => {
    if (selectedHobbies.includes(hobby)) {
      setSelectedHobbies(selectedHobbies.filter((h) => h !== hobby));
    } else {
      setSelectedHobbies([...selectedHobbies, hobby]);
    }
  };
  // --- Image Upload Logic ---
  const handlePickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });

    if (result.assets && result.assets[0]) {
      const file = result.assets[0];
      const uploadData = new FormData();

      uploadData.append('file', {
        uri: Platform.OS === 'android' ? file.uri : file.uri?.replace('file://', ''),
        type: file.type || 'image/jpeg',
        name: file.fileName || 'profile.jpg',
      } as any);

      setIsUploading(true);
      try {
 
        const token = await AsyncStorage.getItem('accessToken');
        // if (token) {
        //   uploadData.headers.Authorization = `Bearer ${token}`;
        // }
        const response = await api.post('/helpers/upload_handler.php', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data',Authorization: `Bearer ${token}` },
          onUploadProgress: (p) => {
            if (p.total) setUploadProgress(Math.round((p.loaded * 100) / p.total));
          }
        });

        if (response.data.success) {
          setFormData({
            ...formData,
            profilePic: response.data.full_url,
            profileThumb: response.data.thumb_url
          });
        }
      } catch (error) {
        console.error("Upload failed", error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFinalSubmit = async () => {
    setIsUploading(true); // Reuse loading state for the submit button
    
    const payload = {
      ...formData,
      hobbies: selectedHobbies, // Add the array of hobbies
      profileFor: profileFor,
    };

    try {
      const response = await api.post('/users/complete_profile.php', payload);
      
      if (response.data.success) {
        Alert.alert("Profile Created Successfully!");
        setIsFinished(true);
        // Navigate to Home or Dashboard here
        // navigation.replace('Home');
      }
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert("Could not save profile. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleDone = () => {
    navigation.replace('Home'); 
  };

  if (isFinished) {
    return <SuccessScreen onDone={handleDone} />;
  }
  return (
    <Box className="flex-1 bg-white">
      {/* Header with Progress Bar - Fixed at top */}
      <VStack className="pt-12">
        <HStack className="px-4 items-center mb-4">
          <Button variant="link" onPress={prevStep} className="p-0 h-10 w-10 justify-start">
            <Icon as={ChevronLeftIcon} size="xl" className="text-typography-400" />
          </Button>
        </HStack>
        {/* Progress bar matches the thin green line in images */}
        <Progress value={progress} size="xs" className="w-full h-1 rounded-none bg-background-50">
          <ProgressFilledTrack className="bg-emerald-500" />
        </Progress>
      </VStack>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Profile/Step Icon matches the circular avatars in images */}
        <VStack className="mt-6 items-center">
            <Box className={`w-24 h-24 rounded-full items-center justify-center mb-8 ${step % 2 === 0 ? 'bg-emerald-50' : 'bg-orange-50'}`}>
                <Text size="4xl">{step === 1 ? '👤' : step === 4 ? '📍' : '📝'}</Text>
            </Box>
        </VStack>

        {/* STEP 1: Profile Selection (Matches step1.jpeg) */}
        {step === 1 && (
          <VStack className="gap-6">
            <Heading size="2xl" className="text-typography-900 font-bold mb-2">This Profile is for</Heading>
            <HStack className="flex-wrap gap-3">
              {['Myself', 'My Son', 'My Daughter', 'My Brother', 'My Sister', 'My Friend', 'My Relative'].map((item) => (
                <SelectionPill 
                  key={item} 
                  label={item} 
                  isSelected={profileFor === item} 
                  onSelect={() => setProfileFor(item)}
                />
              ))}
            </HStack>
          </VStack>
        )}

        {/* STEP 3: Name and DOB (Matches step3.jpeg) */}
        {step === 3 && (
          <VStack className="gap-8">
            <VStack className="gap-4">
              <Heading size="xl" className="text-typography-800">His name</Heading>
              <FormControl>
                <FormControlLabel className="mb-1"><FormControlLabelText className="text-typography-400 text-xs">First name</FormControlLabelText></FormControlLabel>
                <Input variant="underlined" className="border-b-outline-200">
                  <InputField value={formData.firstName} onChangeText={(v) => setFormData({...formData, firstName: v})} />
                </Input>
              </FormControl>
              <FormControl>
                <FormControlLabel className="mb-1"><FormControlLabelText className="text-typography-400 text-xs">Last name</FormControlLabelText></FormControlLabel>
                <Input variant="underlined" className="border-b-outline-200">
                  <InputField value={formData.lastName} onChangeText={(v) => setFormData({...formData, lastName: v})} />
                </Input>
              </FormControl>
            </VStack>

            <VStack className="gap-4">
              <Heading size="xl" className="text-typography-800">Date of birth</Heading>
              <HStack className="gap-4">
                <VStack className="flex-1 gap-1">
                   <Text className="text-typography-400 text-xs">Day</Text>
                   <Input variant="outline" className="rounded-md border-outline-300"><InputField keyboardType="numeric" value={formData.dobDay} className="text-center" /></Input>
                </VStack>
                <VStack className="flex-1 gap-1">
                   <Text className="text-typography-400 text-xs">Month</Text>
                   <Input variant="outline" className="rounded-md border-outline-300"><InputField keyboardType="numeric" value={formData.dobMonth} className="text-center" /></Input>
                </VStack>
                <VStack className="flex-1 gap-1">
                   <Text className="text-typography-400 text-xs">Year</Text>
                   <Input variant="outline" className="rounded-md border-outline-300"><InputField keyboardType="numeric" value={formData.dobYear} className="text-center" /></Input>
                </VStack>
              </HStack>
            </VStack>
          </VStack>
        )}

        {/* STEP 7: Work & Income (Matches step7.jpeg) */}
        {step === 7 && (
            <VStack className="gap-8">
                <Text className="text-center text-typography-500 font-medium">You are almost done!</Text>
                <VStack className="gap-6">
                    <VStack className="gap-2">
                        <Heading size="lg" className="text-typography-800">Income</Heading>
                        <Select>
                            <SelectTrigger variant="outline" size="md" className="rounded-md border-outline-300 h-14">
                                <SelectInput placeholder="INR 10 Lakh to 15 Lakh" className="text-typography-700" />
                                <SelectIcon className="mr-3" as={ChevronDownIcon} />
                            </SelectTrigger>
                        </Select>
                    </VStack>

                    <VStack className="gap-2">
                        <Heading size="lg" className="text-typography-800">Work details</Heading>
                        <Select>
                            <SelectTrigger variant="outline" size="md" className="rounded-md border-outline-300 h-14">
                                <SelectInput placeholder="Government / Public Sector" className="text-typography-700" />
                                <SelectIcon className="mr-3" as={ChevronDownIcon} />
                            </SelectTrigger>
                        </Select>
                    </VStack>
                </VStack>
            </VStack>
        )}
        {/* STEP 8: The Step 10 View */}
        {step === 8 && (
          <VStack className="gap-6 items-center">
            <Heading size="xl" className="text-center">Add a Profile Photo</Heading>
            <Text className="text-center text-typography-500 mb-4">
              A good photo increases your chances by 10x!
            </Text>

            <TouchableOpacity onPress={handlePickImage} disabled={isUploading}>
              <Box className="w-48 h-48 rounded-full border-2 border-dashed border-outline-300 overflow-hidden items-center justify-center bg-background-50">
                {formData.profileThumb ? (
                  <Image source={{ uri: formData.profileThumb }} className="w-full h-full" />
                ) : isUploading ? (
                  <VStack className="items-center gap-2">
                    <Spinner size="large" color="$cyan600" />
                    <Text size="xs">{uploadProgress}%</Text>
                  </VStack>
                ) : (
                  <Text className="text-typography-400">Tap to upload</Text>
                )}
              </Box>
            </TouchableOpacity>

            {formData.profileThumb && (
              <Button variant="link" onPress={handlePickImage}>
                <ButtonText className="text-cyan-600">Change Photo</ButtonText>
              </Button>
            )}
          </VStack>
        )}

        {step === 10 && (
          <VStack className="gap-6 pb-10">
            <VStack className="items-center gap-2">
              <Heading size="2xl" className="text-center text-typography-900">
                Interests & Hobbies
              </Heading>
              <Text className="text-center text-typography-500">
                Select things you enjoy to find better matches
              </Text>
            </VStack>

            <VStack className="gap-8">
              {/* Category: Creative */}
              <VStack className="gap-4">
                <Text className="font-bold text-typography-800 uppercase text-xs tracking-widest">
                  Creative & Arts
                </Text>
                <HStack className="flex-wrap gap-3">
                  {['Painting', 'Photography', 'Writing', 'Cooking', 'Dancing', 'Music'].map((item) => (
                    <SelectionPill 
                      key={item} 
                      label={item} 
                      isSelected={selectedHobbies.includes(item)} 
                      onSelect={() => toggleHobby(item)}
                    />
                  ))}
                </HStack>
              </VStack>

              {/* Category: Fitness & Sports */}
              <VStack className="gap-4">
                <Text className="font-bold text-typography-800 uppercase text-xs tracking-widest">
                  Fitness & Sports
                </Text>
                <HStack className="flex-wrap gap-3">
                  {['Gym', 'Yoga', 'Cricket', 'Football', 'Swimming', 'Hiking', 'Cycling'].map((item) => (
                    <SelectionPill 
                      key={item} 
                      label={item} 
                      isSelected={selectedHobbies.includes(item)} 
                      onSelect={() => toggleHobby(item)}
                    />
                  ))}
                </HStack>
              </VStack>

              {/* Category: Others */}
              <VStack className="gap-4">
                <Text className="font-bold text-typography-800 uppercase text-xs tracking-widest">
                  Other Interests
                </Text>
                <HStack className="flex-wrap gap-3">
                  {['Traveling', 'Movies', 'Gaming', 'Reading', 'Pets', 'Gardening'].map((item) => (
                    <SelectionPill 
                      key={item} 
                      label={item} 
                      isSelected={selectedHobbies.includes(item)} 
                      onSelect={() => toggleHobby(item)}
                    />
                  ))}
                </HStack>
              </VStack>
            </VStack>
          </VStack>
        )}

      </ScrollView> 

        {/* Updated Footer Button */}
      <Box className="p-6 bg-white border-t border-outline-50 shadow-sm">
        <Button 
          size="lg" 
          className="bg-cyan-500 rounded-full h-14 active:bg-cyan-600" 
          onPress={step === totalSteps ? handleFinalSubmit : nextStep}
          isDisabled={isUploading}
        >
          {isUploading ? (
            <Spinner color="$white" />
          ) : (
            <ButtonText className="font-bold text-lg text-white">
              {step === totalSteps ? 'Finish & Create' : 'Continue'}
            </ButtonText>
          )}
        </Button>
      </Box>

    </Box>
  );
}
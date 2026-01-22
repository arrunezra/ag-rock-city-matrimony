import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, Platform, Pressable, ScrollView, TouchableOpacity } from 'react-native';
import {
  Box, VStack, HStack, Button, ButtonText, Text, Progress, ProgressFilledTrack, Input, InputField,
  Heading, Select, SelectTrigger, SelectInput, SelectIcon, Spinner,
  CheckboxIcon, CheckboxIndicator, CheckboxLabel, Checkbox,
  SelectPortal, SelectBackdrop, SelectContent,
  SelectItem,
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  FormControlError,
  FormControlErrorText
} from '@/src/components/common/GluestackUI';
import { Icon, ChevronLeftIcon, ChevronDownIcon, CheckIcon, SearchIcon } from '@/src/components/common/IconUI';
import { launchImageLibrary } from 'react-native-image-picker';
import api from '@/src/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SuccessScreen from '../common/SuccessScreen';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SelectDragIndicator, SelectDragIndicatorWrapper } from '@/components/ui/select';
import profileService from '@/src/services/profileService';
import { InputIcon, InputSlot } from '@/components/ui/input';
import _ from 'lodash';
import { CloseIcon } from '@/components/ui/icon';
// --- DATA SOURCES ---
const RELIGIONS = ["Christian", "Hindu", "Muslim", "Sikh", "Jain"];
const COMMUNITIES = ["Tamil", "Telugu", "Malayalam", "Kannada", "Hindi"];
const QUALIFICATIONS = ["Bachelors", "Masters", "PhD", "Diploma", "High School"];
const INCOME_RANGES = ["3L - 5L", "5L - 10L", "10L - 15L", "15L - 25L", "25L+"];
const MARITAL_STATUS = ["Never Married", "Divorced", "Widowed", "Awaiting Divorce"];
const LIVINGIN = ["Australia", "Canada", "India", "New Zealand", "Kuwait", "Pakistan", "Qatar", "Saudi Arabia", "UAE", "UK", "USA"];
const STATES = [
  { "CityCode": "TN", "CityName": "Tamil Nadu" },
  { "CityCode": "MH", "CityName": "Maharashtra" },
  { "CityCode": "GJ", "CityName": "Gujarat" },
  { "CityCode": "KA", "CityName": "Karnataka" },
  { "CityCode": "DL", "CityName": "Delhi" },
  { "CityCode": "UP", "CityName": "Uttar Pradesh" },
  { "CityCode": "WB", "CityName": "West Bengal" },
  { "CityCode": "MP", "CityName": "Madhya Pradesh" },
  { "CityCode": "RJ", "CityName": "Rajasthan" },
  { "CityCode": "BR", "CityName": "Bihar" },
  { "CityCode": "JK", "CityName": "Jammu and Kashmir" },
  { "CityCode": "HR", "CityName": "Haryana" },
  { "CityCode": "OR", "CityName": "Odisha" },
  { "CityCode": "KL", "CityName": "Kerala" },
  { "CityCode": "AS", "CityName": "Assam" },
  { "CityCode": "CG", "CityName": "Chhattisgarh" },
  { "CityCode": "JH", "CityName": "Jharkhand" },
  { "CityCode": "PY", "CityName": "Punjab" },
  { "CityCode": "SK", "CityName": "Sikkim" },
  { "CityCode": "AP", "CityName": "Andhra Pradesh" },
  { "CityCode": "ML", "CityName": "Meghalaya" },
  { "CityCode": "TR", "CityName": "Tripura" },
  { "CityCode": "MN", "CityName": "Manipur" },
  { "CityCode": "AR", "CityName": "Arunachal Pradesh" },
  { "CityCode": "UT", "CityName": "Uttarakhand" },
  { "CityCode": "CH", "CityName": "Chandigarh" },
  { "CityCode": "LA", "CityName": "Ladakh" },
  { "CityCode": "AN", "CityName": "Andaman and Nicobar Islands" },
]

const HEIGHTS = Array.from({ length: 30 }, (_, i) => `${Math.floor((150 + i) / 30.48).toFixed(0)}'${((150 + i) % 12).toFixed(0)}"`);

const SelectionPill = ({ label, isSelected, onSelect }: any) => (
  <Button
    variant="outline"
    onPress={onSelect}
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

  const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isCasteNoBar, setIsCasteNoBar] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState(false);
  const [profileFor, setProfileFor] = useState('Myself');
  const [validationTriggered, setValidationTriggered] = useState(false);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Comprehensive Form State
  const [formData, setFormData] = useState<any>({
    firstName: '',
    lastName: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    religion: '',
    community: '',
    subCommunity: '',
    country: 'India',
    email: '',
    phone: '',
    address: '',
    city: '',
    maritalStatus: '',
    children: '0',
    height: '',
    qualification: '',
    college: '',
    income: '',
    workDetails: '',
    companyName: '',
    profilePic: null,
    profileThumb: null,
    hasChildren: '',
    childrenCount: '',
    kids: [],
    kids_details: '',
  });

  useEffect(() => {
    if (formData.state && formData.state !== '' && searchQuery === '') {
      console.log("Fetching cities for state useEffect:");
      fetchCities(formData.state);
    }
  }, [formData.state]);
  // 2. Create a debounced version of the fetch
  // 1. Correct way to define the debounced function
  // 1. Correct structure: useCallback WRAPS the debounce
  const logicToFetch = useCallback(
    _.debounce(async (searchQuery: string) => {
      console.log("Debounce fired! Fetching for:", searchQuery);

      if (formData.state) {
        setIsLoading(true);
        try {
          // IMPORTANT: Pass 'searchQuery' to your fetch function 
          // so the PHP gets the actual search text
          await fetchCities(formData.state, searchQuery);
        } catch (error) {
          console.error("Fetch error:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setCities([]);
      }
    }, 500),
    [formData.state] // Only re-create if the state changes
  );



  const handleNextAction = () => {

    setValidationTriggered(true); // Show red errors if fields are empty

    if (step === 1) {
      if (!profileFor) return;
    }

    if (step === 2) {
      if (!formData.firstName || !formData.lastName || !isDateValid() || getAge() < 18) {
        return; // Stop here if invalid or under 18
      }
    }

    // If valid, reset trigger and move forward
    setValidationTriggered(false);

    if (step === 8) handleParcialSubmit();
    else if (step === totalSteps) handleFinalSubmit();
    else setStep(prev => prev + 1);

  }
  const prevStep = () => step > 1 && setStep(step - 1);

  const updateForm = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));

  };

  const toggleHobby = (hobby: string) => {
    setSelectedHobbies(prev =>
      prev.includes(hobby) ? prev.filter(h => h !== hobby) : [...prev, hobby]
    );
  };

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
        const response = await api.post('/helpers/upload_handler.php', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` },
          onUploadProgress: (p) => {
            if (p.total) setUploadProgress(Math.round((p.loaded * 100) / p.total));
          }
        });

        if (response.data.success) {
          updateForm('profilePic', response.data.full_url);
          updateForm('profileThumb', response.data.thumb_url);
        }
      } catch (error) {
        console.error("Upload failed", error);
      } finally {
        setIsUploading(false);
      }
    }
  };
  const handleParcialSubmit = async () => {
    setIsUploading(true);
    const payload = { ...formData, hobbies: selectedHobbies, profileFor, casteNoBar: isCasteNoBar };
    try {
      const response = await api.post('/profile/complete_profile.php', payload);
      if (response.data.success) {
        setIsFinished(true);
      }
    } catch (error) {
      Alert.alert("Error", "Could not save profile. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };
  const handleFinalSubmit = async () => {
    setIsUploading(true);
    const payload = { ...formData, hobbies: JSON.stringify(selectedHobbies), profileFor, casteNoBar: isCasteNoBar, kids_details: JSON.stringify(formData.kids) };
    try {
      const response = await profileService.createProfile(payload)
      if (response.success) {
        setIsFinished(true);
      } else {
        Alert.alert("Error", response.message);

      }
    } catch (error) {
      Alert.alert("Error", "Could not save profile. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChildrenCountChange = (count: string) => {
    const num = parseInt(count) || 0;
    updateForm('childrenCount', count);

    // Sync the kids array length with the number entered
    setFormData((prev: any) => {
      let newKids = [...prev.kids];
      if (num > newKids.length) {
        // Add more child objects if count increased
        for (let i = newKids.length; i < num; i++) {
          newKids.push({ age: '', gender: '', livingTogether: 'Yes' });
        }
      } else {
        // Remove child objects if count decreased
        newKids = newKids.slice(0, num);
      }
      return { ...prev, kids: newKids };
    });
  };

  const updateKidDetail = (index: number, field: string, value: string) => {
    const updatedKids = [...formData.kids];
    updatedKids[index] = { ...updatedKids[index], [field]: value };
    updateForm('kids', updatedKids);
  };
  const removeChild = (indexToRemove: number) => {
    const updatedKids = formData.kids.filter((_: any, index: number) => index !== indexToRemove);

    setFormData((prev: any) => ({
      ...prev,
      kids: updatedKids,
      // Automatically update the count to match the new array length
      childrenCount: updatedKids.length.toString()
    }));
  };

  // 1. Check if the numbers entered are logically correct
  const isDateValid = () => {
    const day = parseInt(formData.dobDay);
    const month = parseInt(formData.dobMonth);
    const year = formData.dobYear;

    if (!day || !month || year.length !== 4) return false;

    const isDayValid = day >= 1 && day <= 31;
    const isMonthValid = month >= 1 && month <= 12;

    return isDayValid && isMonthValid;
  };

  // 2. Calculate the age based on current year (2026)
  const getAge = () => {
    const day = parseInt(formData.dobDay);
    const month = parseInt(formData.dobMonth);
    const year = parseInt(formData.dobYear);

    if (!isDateValid()) return 0;
    const today = new Date(); // Current date in 2026
    const birthDate = new Date(year, month - 1, day);

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    // Adjust if birthday hasn't happened yet this year
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  const fetchCities = async (stateId: string, searchQuery: string | null = null) => {
    setIsLoading(true); // Start loading
    try {
      const response = await profileService.getCities(stateId, searchQuery);
      console.log('cities', response.data)
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };


  // 3. Update the Input handle
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    logicToFetch(text);
  };

  // Filter cities based on search text
  const filteredCities = cities?.filter((city: any) =>
    city.CityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box className="flex-1 bg-white">
      <VStack className="pt-12">
        <HStack className="px-4 items-center mb-4">
          <Button variant="link" onPress={prevStep} isDisabled={step === 1}>
            <Icon as={ChevronLeftIcon} size="xl" className="text-typography-400" />
          </Button>
        </HStack>
        <Progress value={progress} size="xs" className="w-full h-1 rounded-none bg-background-50">
          <ProgressFilledTrack className="bg-emerald-500" />
        </Progress>
      </VStack>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <VStack className="mt-6 items-center">
          <Box className={`w-20 h-20 rounded-full items-center justify-center mb-6 ${step % 2 === 0 ? 'bg-emerald-50' : 'bg-orange-50'}`}>
            <Text size="3xl">{step === 1 ? '👤' : step === 9 ? '📸' : '📝'}</Text>
          </Box>
        </VStack>

        {/* STEP 1: Profile Selection */}
        {step === 1 && (
          <VStack className="gap-6">
            <FormControl isInvalid={!profileFor && validationTriggered}>
              <Heading size="xl" className="mb-4">This Profile is for</Heading>
              <HStack className="flex-wrap gap-3">
                {['Myself', 'My Son', 'My Daughter', 'My Brother', 'My Sister', 'My Friend'].map((item) => (
                  <SelectionPill
                    key={item}
                    label={item}
                    isSelected={profileFor === item}
                    onSelect={() => {
                      setProfileFor(item);
                      setValidationTriggered(false); // Reset error when user selects
                    }}
                  />
                ))}
              </HStack>
              <FormControlError>
                <FormControlErrorText>Please select an option to continue</FormControlErrorText>
              </FormControlError>
            </FormControl>
          </VStack>
        )}

        {/* STEP 2: Name & DOB */}
        {step === 2 && (
          <VStack className="gap-6">
            <Heading size="xl">Basic Details</Heading>

            {/* First Name */}
            <FormControl isInvalid={validationTriggered && !formData.firstName}>
              <Input  >
                <InputField
                  placeholder="First Name"
                  value={formData.firstName}
                  onChangeText={(v) => updateForm('firstName', v)}
                />
              </Input>
              <FormControlError><FormControlErrorText>First name is required</FormControlErrorText></FormControlError>
            </FormControl>

            {/* Last Name */}
            <FormControl isInvalid={validationTriggered && !formData.lastName}>
              <Input   >
                <InputField
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChangeText={(v) => updateForm('lastName', v)}
                />
              </Input>
              <FormControlError><FormControlErrorText>Last name is required</FormControlErrorText></FormControlError>
            </FormControl>

            {/* Date of Birth Section */}
            <FormControl isInvalid={validationTriggered && (!isDateValid() || getAge() < 18)}>
              <FormControlLabel><FormControlLabelText>Date of Birth</FormControlLabelText></FormControlLabel>
              <HStack className="gap-2 mt-2">
                <Input className="flex-1">
                  <InputField placeholder="DD" keyboardType="numeric" maxLength={2} value={formData.dobDay} onChangeText={(v) => updateForm('dobDay', v)} />
                </Input>
                <Input className="flex-1">
                  <InputField placeholder="MM" keyboardType="numeric" maxLength={2} value={formData.dobMonth} onChangeText={(v) => updateForm('dobMonth', v)} />
                </Input>
                <Input className="flex-1">
                  <InputField placeholder="YYYY" keyboardType="numeric" maxLength={4} value={formData.dobYear} onChangeText={(v) => updateForm('dobYear', v)} />
                </Input>
              </HStack>
              <FormControlError>
                <FormControlErrorText>
                  {!isDateValid() ? "Enter a valid DD (01-31), MM (01-12), and YYYY" : getAge() < 18
                    ? "Under age! You must be at least 18 years old."
                    : ""}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          </VStack>
        )}

        {/* STEP 3: Religion & Community */}
        {step === 3 && (
          <VStack className="gap-6">
            <Heading size="xl">Religion Details</Heading>
            <Select onValueChange={(v) => updateForm('religion', v)} selectedValue={formData.religion}>
              <SelectTrigger variant="outline" className="h-14">
                <SelectInput placeholder="Select Religion" className="flex-1" />
                <SelectIcon as={ChevronDownIcon} className="mr-3" />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop /><SelectContent>
                  {RELIGIONS.map(r => <SelectItem key={r} label={r} value={r} />)}
                </SelectContent>
              </SelectPortal>
            </Select>

            <Select onValueChange={(v) => updateForm('community', v)} selectedValue={formData.community}>
              <SelectTrigger variant="outline" className="h-14">
                <SelectInput placeholder="Select Community" className="flex-1" />
                <SelectIcon as={ChevronDownIcon} className="mr-3" />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop /><SelectContent>
                  {COMMUNITIES.map(c => <SelectItem key={c} label={c} value={c} />)}
                </SelectContent>
              </SelectPortal>
            </Select>
            <Select onValueChange={(v) => updateForm('livingIn', v)} selectedValue={formData.livingIn}>
              <SelectTrigger variant="outline" className="h-14">
                <SelectInput placeholder="Select Living In" className="flex-1" />
                <SelectIcon as={ChevronDownIcon} className="mr-3" />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop /><SelectContent>
                  {LIVINGIN.map(c => <SelectItem key={c} label={c} value={c} />)}
                </SelectContent>
              </SelectPortal>
            </Select>

          </VStack>
        )}

        {/* STEP 4: Contact */}
        {step === 4 && (
          <VStack className="gap-6">
            <Heading size="xl">Contact Info</Heading>
            <Input className="h-14"><InputField placeholder="Email Address" value={formData.email} onChangeText={(v) => updateForm('email', v)} /></Input>
            <Input className="h-14"><InputField placeholder="Phone Number" keyboardType="phone-pad" value={formData.phone} onChangeText={(v) => updateForm('phone', v)} /></Input>
          </VStack>
        )}
        {/* STEP 5: Location & Sub-Community */}
        {step === 5 && (
          <VStack className="gap-6 p-4">
            <Text className="text-center text-typography-500 font-medium">Now let's build your profile</Text>
            <Heading size="xl">Location Details</Heading>

            {/* STATE SELECTION */}
            <FormControl isInvalid={validationTriggered && !formData.state}>
              <FormControlLabel><FormControlLabelText>Select State</FormControlLabelText></FormControlLabel>
              <Select
                selectedValue={formData.state}
                onValueChange={(v) => updateForm('state', v)}
              >
                <SelectTrigger variant="outline" className="h-14">
                  <SelectInput placeholder="Choose State" />
                  <SelectIcon as={ChevronDownIcon} className="mr-3" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper><SelectDragIndicator /></SelectDragIndicatorWrapper>
                    <ScrollView className="w-full" style={{ minHeight: 200 }}>
                      {STATES.length > 0 ? (
                        STATES.map((state: any) => (
                          <SelectItem
                            key={state.CityCode}           // Unique React Key
                            label={state.CityName}   // What the user SEES
                            value={state.CityCode} // What is STORED in formData.city
                          />
                        ))
                      ) : !isLoading && (
                        <Box className="p-10 items-center">
                          <Text>No state found</Text>
                        </Box>
                      )}
                    </ScrollView>

                  </SelectContent>
                </SelectPortal>
              </Select>
              <FormControlError><FormControlErrorText>State is required</FormControlErrorText></FormControlError>
            </FormControl>

            {/* CITY SELECTION (Dependent on State) */}
            <FormControl isInvalid={validationTriggered && !formData.city} isDisabled={cities.length === 0}>
              <FormControlLabel><FormControlLabelText>Select City</FormControlLabelText></FormControlLabel>

              <Select
                selectedValue={formData.city}
                onValueChange={(v) => updateForm('city', v)}
              >
                <SelectTrigger variant="outline" className="h-14">
                  <SelectInput placeholder={cities.length > 0 ? "Choose City" : "Select a state first"} />
                  <SelectIcon as={ChevronDownIcon} className="mr-3" />
                </SelectTrigger>

                <SelectPortal>
                  <SelectBackdrop />
                  {/* Centered Modal Style */}
                  <SelectContent className="flex-1 w-[95%] sm:w-[80%] self-center max-h-[90%] mb-4">
                    <Box className="w-full p-4 border-b border-outline-100">
                      <Input variant="rounded" size="sm">
                        <InputSlot className="pl-3">
                          <InputIcon as={SearchIcon} />
                        </InputSlot>

                        <InputField
                          placeholder="Search city..."
                          value={searchQuery}
                          onChangeText={handleSearchChange}
                        />

                        {/* Show Spinner OR Clear Button */}
                        <InputSlot className="pr-3">
                          {isLoading ? (
                            <Spinner size="small" color="$cyan500" />
                          ) : searchQuery.length > 0 ? (
                            <Pressable onPress={() => {
                              logicToFetch.cancel(); // 1. Kill the pending 500ms timer
                              setSearchQuery('');    // 2. Clear input
                              setCities([]);         // 3. Clear list
                              // 4. Optionally fetch default list immediately:
                              // fetchCities(formData.state, ""); 
                            }}>
                              <Icon as={CloseIcon} />
                            </Pressable>
                          ) : null}
                        </InputSlot>
                      </Input>
                    </Box>
                    {/* 2. FILTERED LIST SECTION */}
                    <ScrollView
                      className="flex-1 w-full"
                      contentContainerStyle={{
                        flexGrow: 1,
                        paddingBottom: 20 // Extra padding so the last item isn't touching the edge
                      }}
                    >
                      {/* Data List */}
                      {cities.length > 0 && cities.map((city: any) => (
                        <SelectItem
                          key={city.CityName}
                          label={city.CityName}
                          value={city.CityCode}
                        />
                      ))}

                      {/* Styled Empty State Card */}
                      {cities.length === 0 && !isLoading && (
                        <Box className="flex-1 justify-center items-center p-10">
                          <VStack
                            className="items-center p-8 rounded-2xl bg-background-50 border border-outline-100"
                            space="md"
                          >
                            <Box className="p-4 rounded-full bg-background-100">
                              <Icon as={SearchIcon} size="xl" className="text-typography-400" />
                            </Box>

                            <VStack space="xs" className="items-center">
                              <Heading size="sm" className="text-typography-700">
                                {searchQuery.length > 0 ? "No matches found" : "Search for a city"}
                              </Heading>
                              <Text size="sm" className="text-center text-typography-500">
                                {searchQuery.length > 0
                                  ? `We couldn't find "${searchQuery}".\nTry checking the spelling.`
                                  : "Start typing the name of your city above."}
                              </Text>
                            </VStack>

                            {searchQuery.length > 0 && (
                              <Button
                                variant="link"
                                onPress={() => {
                                  setSearchQuery('');
                                  fetchCities(formData.state, ""); // Reset to default list
                                }}
                              >
                                <ButtonText size="sm" className="text-primary-500">Clear Search</ButtonText>
                              </Button>
                            )}
                          </VStack>
                        </Box>
                      )}
                    </ScrollView>

                  </SelectContent>
                </SelectPortal>
              </Select>












              <FormControlError>
                <FormControlErrorText>
                  {formData.state ? "Please select a city" : "Select a state first"}
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          </VStack>

          // <VStack className="gap-8">

          //   <VStack className="gap-6">
          //     <VStack className="gap-2">
          //       <Heading size="lg" className="text-typography-800">Address</Heading>
          //       <Input variant="outline" className="rounded-md border-outline-300 h-14">
          //         <InputField
          //           placeholder="Address"
          //           value={formData.address}
          //           onChangeText={(v) => updateForm('address', v)}
          //         />
          //       </Input>
          //     </VStack>

          //     <VStack className="gap-2">
          //       <Heading size="lg" className="text-typography-800">Village / City</Heading>
          //       <Input variant="outline" className="rounded-md border-outline-300 h-14">
          //         <InputField
          //           placeholder="Village / City"
          //           value={formData.city}
          //           onChangeText={(v) => updateForm('city', v)}
          //         />
          //       </Input>
          //     </VStack>

          //     <VStack className="gap-2">
          //       <Heading size="lg" className="text-typography-800">Choose City</Heading>
          //       <Select onValueChange={(v) => updateForm('city', v)} selectedValue={formData.city}>
          //         <SelectTrigger variant="outline" className="rounded-md border-outline-300 h-14">
          //           <SelectInput placeholder="Choose City" className="flex-1" />
          //           <SelectIcon className="mr-3" as={ChevronDownIcon} />
          //         </SelectTrigger>
          //         <SelectPortal>
          //           <SelectBackdrop />
          //           <SelectContent>
          //             {CITIES.map(city => <SelectItem key={city} label={city} value={city} />)}
          //           </SelectContent>
          //         </SelectPortal>
          //       </Select>
          //     </VStack>

          //     <VStack className="gap-2">
          //       <Heading size="lg" className="text-typography-800">Sub - Community</Heading>
          //       <Input variant="outline" className="rounded-md border-outline-300 h-14">
          //         <InputField
          //           placeholder="Sub - Community (e.g. Nadar, Iyer)"
          //           value={formData.subCommunity}
          //           onChangeText={(v) => updateForm('subCommunity', v)}
          //         />
          //       </Input>
          //     </VStack>

          //     <Checkbox
          //       size="sm"
          //       value="casteNoBar"
          //       isChecked={isCasteNoBar}
          //       onChange={(val) => setIsCasteNoBar(val)}
          //       aria-label="Caste no bar"
          //     >
          //       <CheckboxIndicator className="mr-2">
          //         <CheckboxIcon as={CheckIcon} />
          //       </CheckboxIndicator>
          //       <CheckboxLabel className="text-sm text-typography-500">Not particular about partner's community (Caste no bar)</CheckboxLabel>
          //     </Checkbox>
          //   </VStack>
          // </VStack>
        )}

        {/* STEP 6: Marital Status & Dynamic Kids */}
        {step === 6 && (
          <VStack className="gap-8">
            <Text className="text-center text-typography-500 font-medium">Family Details</Text>

            <VStack className="gap-6">
              <VStack className="gap-2">
                <Heading size="lg">Marital Status</Heading>
                <Select
                  onValueChange={(v) => updateForm('maritalStatus', v)}
                  selectedValue={formData.maritalStatus}
                >
                  <SelectTrigger variant="outline" className="h-14">
                    <SelectInput placeholder="Select Status" className="flex-1" />
                    <SelectIcon as={ChevronDownIcon} className="mr-3" />
                  </SelectTrigger>
                  <SelectPortal >
                    <SelectBackdrop /><SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem label="Never Married" value="Never Married" />
                      <SelectItem label="Divorced" value="Divorced" />
                      <SelectItem label="Widowed" value="Widowed" />
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </VStack>

              {/* Conditional Kids Section */}
              {formData.maritalStatus !== 'Never Married' && formData.maritalStatus !== '' && (
                <VStack className="gap-4">
                  <Heading size="md">Do you have children?</Heading>
                  <HStack className="gap-4">
                    {['No', 'Yes'].map((opt) => (
                      <TouchableOpacity
                        key={opt}
                        onPress={() => updateForm('hasChildren', opt)}
                        className="flex-row items-center gap-2"
                      >
                        <Box className={`w-5 h-5 rounded-full border-2 items-center justify-center ${formData.hasChildren === opt ? 'border-cyan-600' : 'border-outline-300'}`}>
                          {formData.hasChildren === opt && <Box className="w-2.5 h-2.5 rounded-full bg-cyan-600" />}
                        </Box>
                        <Text>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </HStack>

                  {formData.hasChildren === 'Yes' && (
                    <VStack className="gap-4">
                      <FormControl>
                        <FormControlLabel><FormControlLabelText>How many children?</FormControlLabelText></FormControlLabel>
                        <Input variant="outline" className="h-12">
                          <InputField
                            placeholder="e.g. 2"
                            keyboardType="numeric"
                            value={formData.childrenCount}
                            onChangeText={handleChildrenCountChange} // Function defined in previous response
                          />
                        </Input>
                      </FormControl>

                      {/* Dynamic Child Detail Boxes */}
                      {formData.kids.map((kid: any, index: number) => (
                        <Box key={index} className="p-4 rounded-xl border border-outline-200 bg-background-50 gap-4">
                          {/* Header with Child Number and Delete Button */}
                          <HStack className="justify-between items-center">
                            <Text className="font-bold text-cyan-600">Child {index + 1}</Text>

                            <TouchableOpacity
                              onPress={() => removeChild(index)}
                              className="p-2 bg-red-50 rounded-full"
                            >
                              {/* Use your icon library here, e.g., Trash2 from Lucide or similar */}
                              <Text className="text-red-600 text-xs font-bold">Remove</Text>
                            </TouchableOpacity>
                          </HStack>
                          <HStack className="gap-2">
                            <Input className="flex-1 h-10 bg-white">
                              <InputField
                                placeholder="Age"
                                keyboardType="numeric"
                                value={kid.age}
                                onChangeText={(v) => updateKidDetail(index, 'age', v)}
                              />
                            </Input>
                            <Box className="flex-1">
                              <Select onValueChange={(v) => updateKidDetail(index, 'gender', v)} selectedValue={kid.gender}>
                                <SelectTrigger className="h-10 bg-white"><SelectInput placeholder="Gender" className="flex-1" /></SelectTrigger>
                                <SelectPortal><SelectBackdrop /><SelectContent>
                                  <SelectItem label="Boy" value="Boy" /><SelectItem label="Girl" value="Girl" />
                                </SelectContent></SelectPortal>
                              </Select>
                            </Box>
                          </HStack>
                          <HStack className="items-center justify-between">
                            <Text size="xs">Living with you?</Text>
                            <HStack className="gap-3">
                              {['Yes', 'No'].map(l => (
                                <TouchableOpacity key={l} onPress={() => updateKidDetail(index, 'livingTogether', l)} className="flex-row items-center gap-1">
                                  <Box className={`w-4 h-4 rounded-full border ${kid.livingTogether === l ? 'bg-cyan-600 border-cyan-600' : 'border-outline-300'}`} />
                                  <Text size="xs">{l}</Text>
                                </TouchableOpacity>
                              ))}
                            </HStack>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </VStack>
              )}
            </VStack>
          </VStack>
        )}


        {/* STEP 7: Education & Qualification */}
        {step === 7 && (
          <VStack className="gap-8">
            <Text className="text-center text-typography-500 font-medium">Great! Few more details to go</Text>
            <VStack className="gap-6">
              <VStack className="gap-2">
                <Heading size="lg" className="text-typography-800">Highest Qualification</Heading>
                <Select onValueChange={(v) => updateForm('qualification', v)} selectedValue={formData.qualification}>
                  <SelectTrigger variant="outline" className="rounded-md border-outline-300 h-14">
                    <SelectInput placeholder="Highest Qualification" className="flex-1" />
                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      {QUALIFICATIONS.map(q => <SelectItem key={q} label={q} value={q} />)}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </VStack>

              <VStack className="gap-2">
                <Heading size="lg" className="text-typography-800">College / University Details</Heading>
                <Input variant="outline" className="rounded-md border-outline-300 h-14">
                  <InputField
                    placeholder="College Name"
                    value={formData.college}
                    onChangeText={(v) => updateForm('college', v)}
                  />
                </Input>
              </VStack>

              <VStack className="gap-2">
                <Heading size="lg" className="text-typography-800">Work Details</Heading>
                <Input variant="outline" className="rounded-md border-outline-300 h-14">
                  <InputField
                    placeholder="e.g. Software Engineer / Teacher"
                    value={formData.workDetails}
                    onChangeText={(v) => updateForm('workDetails', v)}
                  />
                </Input>
              </VStack>
            </VStack>
          </VStack>
        )}
        {/* STEP 8: Work & Income */}
        {step === 8 && (
          <VStack className="gap-6">
            <Heading size="xl">Income & Work</Heading>
            <Select onValueChange={(v) => updateForm('income', v)} selectedValue={formData.income}>
              <SelectTrigger variant="outline" className="h-14">
                <SelectInput placeholder="Annual Income" className="flex-1" />
                <SelectIcon as={ChevronDownIcon} className="mr-3" />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop /><SelectContent>
                  {INCOME_RANGES.map(i => <SelectItem key={i} label={i} value={i} />)}
                </SelectContent>
              </SelectPortal>
            </Select>
            <Input className="h-14"><InputField placeholder="Current Company" value={formData.companyName} onChangeText={(v) => updateForm('companyName', v)} /></Input>
          </VStack>
        )}

        {/* STEP 9: Photo */}
        {step === 9 && (
          <VStack className="gap-6 items-center">
            <Heading size="xl">Add Profile Photo</Heading>
            <TouchableOpacity onPress={handlePickImage} disabled={isUploading}>
              <Box className="w-48 h-48 rounded-full border-2 border-dashed border-outline-300 overflow-hidden items-center justify-center bg-background-50">
                {formData.profileThumb ? (
                  <Image source={{ uri: formData.profileThumb }} className="w-full h-full" />
                ) : (
                  isUploading ? <Spinner size="large" /> : <Text className="text-typography-400">Tap to upload</Text>
                )}
              </Box>
            </TouchableOpacity>
          </VStack>
        )}

        {/* STEP 10: Hobbies */}
        {step === 10 && (
          <VStack className="gap-6 pb-10">
            <Heading size="xl">Hobbies</Heading>
            <HStack className="flex-wrap gap-3">
              {['Cooking', 'Dancing', 'Music', 'Travel', 'Cricket', 'Gym'].map(h => (
                <SelectionPill key={h} label={h} isSelected={selectedHobbies.includes(h)} onSelect={() => toggleHobby(h)} />
              ))}
            </HStack>
          </VStack>
        )}
      </ScrollView>

      <Box className="p-6 bg-white border-t border-outline-50">
        <Button
          size="lg"
          className="bg-cyan-500 rounded-full h-14"
          onPress={handleNextAction}
          isDisabled={isUploading}
        >
          {isUploading ? <Spinner color="$white" /> : <ButtonText className="text-white">{step === totalSteps ? 'Finish' : step === 8 ? 'Submit' : 'Continue'}</ButtonText>}
        </Button>
      </Box>
    </Box>
  );
}
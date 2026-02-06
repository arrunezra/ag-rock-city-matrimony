import React, { useEffect, useRef, useState } from 'react';
import { Alert, Dimensions, Platform, Pressable, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Box, Heading, Input, InputField, Button, ButtonText, Spinner, useToast, Toast, ToastTitle, Center, Avatar, AvatarImage, Text, HStack, VStack, Modal, ModalBackdrop, ModalContent, Progress, ProgressFilledTrack } from '@/src/components/common/GluestackUI';
import api from '@/src/api/api';
import { launchImageLibrary } from 'react-native-image-picker';
import { Accessibility, Activity, Baby, Banknote, Briefcase, Calendar, CameraIcon, Check, CheckCircle2, CheckIcon, ChevronDown, ChevronDownIcon, ChevronLeftIcon, ChevronUp, ChevronUpIcon, Coffee, Droplets, EditIcon, Globe, GraduationCap, Heart, Icon, Info, Languages, Mail, MapPin, MessageSquareQuote, MoonStar, Network, Phone, Ruler, Scale, School, ShieldCheck, Sparkles, User, UserRound, Users, Users2, UserSquare } from '@/src/components/common/IconUI';
import FastImage from '@d11/react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import { COMMUNITIES, getProfileCompletionData, HEIGHT_DATA, HOBBIES, INCOME_RANGES, LIVINGIN, MARITAL_STATUS, RELIGION_DATA, WORK_WITH } from '@/src/utils/utils';
import { useAuth } from '@/src/context/AuthContext';
import LottieView from 'lottie-react-native';
import EditBasicsModalScreen from './home_sub_screen/EditBasicsModalScreen';
import EditReligionModal from './home_sub_screen/EditReligionModal';
import EditAboutModal from './home_sub_screen/EditAboutModal';
import ContactModal from './home_sub_screen/ContactModal';
import EditLocationModal from './home_sub_screen/EditLocationModal';
import EditCareerModal from './home_sub_screen/EditCareerModal';
import EditHobbiesModal from './home_sub_screen/EditHobbiesModal';
import { FamilyDetailsModal } from './home_sub_screen/FamilyDetailsModal';
import { EducationDetailsModal } from './home_sub_screen/EducationDetailsModal';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL_DEV_Profiles_Images, API_BASE_URL_DEV_Profiles_Thumbs } from '@/src/utils/environment';
import { compressWithSkia } from '@/src/utils/compressWithSkia';
import { BlurView } from '@react-native-community/blur';
import { UploadProgressModal } from '../common/UploadProgressModal';


export default function ProfileEditScreen({ navigation, route }: any) {
  const profile = route.params.profile;
  console.log('ProfileDetailScreen===', profile);
  const userid = profile.userid;
  const [profileImage, setProfileImage] = useState(API_BASE_URL_DEV_Profiles_Images + '/' + profile.profilePic);
  const [showBasicsModal, setShowBasicsModal] = useState(false);
  const { user, updateUser } = useAuth(); // Assume refreshUser updates your context
  const { totalStrength, checklist } = getProfileCompletionData(user);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const confettiRef = useRef<LottieView>(null);
  const { width, height } = Dimensions.get('window');
  //const { strength, checklist } = calculateProfileStrength(profile);
  const [profileData, setProfileData] = useState({
    work_sector: '',
    income_range: '',
    hobbies: [],
    profile_thumb: '',
  });
  const [formData, setFormData] = useState({
    userid: userid,
    religion: '',
    community: '',
    livingIn: '',
    isCasteNoBar: false,
    city: '',
    state: '',
    height: '',
    maritalStatus: '',
    hasChildren: false,
    childrenCount: '',
    kids: [{ gender: 'Boy' }, { gender: 'Girl' }, { gender: 'Boy' }, { gender: 'Girl' }],
    qualification: '',
    college: '',
    worksas: '',
    companyName: '',
    income: '',
    selectedHobbies: ['Traveling',
      'Hiking',
      'Painting',
      'Dancing'],
    age: '',
    dob: '',
    diet: '',
    bloodGroup: '',
    motherTongue: '',
    isWillingToIntersubcaste: false,
    prefAgeMin: '',
    prefAgeMax: '',
    prefHeightMin: '',
    prefEducation: '',
    prefIncome: '',
    healthInfo: '',
    disability: '',
    childrenGender: '',
    subCommunity: '',
    motherDetails: '',
    fatherDetails: '',
    noOfSisters: '',
    noOfBrothers: '',
    familyLocation: '',
    country: '',
    familyFinancialStatus: '',
    annualIncome: '',
    workingAs: '',
    employerName: '',
    highestQualification: ''
  });
  const hobbies = ['Cooking', 'Travelling', 'Music', 'Pets'];
  const profileCompletion = 75; // This would be calculated dynamically
  const toast = useToast();

  const [showConfetti, setShowConfetti] = useState(false);
  const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);
  const aboutText = profile?.about || "I am glad you chose to visit my profile...";
  const [showReligionModal, setShowReligionModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [showHobbiesModal, setShowHobbiesModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedHobbies, setSelectedHobbies] = useState(['Traveling',
    'Hiking',
    'Painting',
    'Dancing']);

  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

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

  useEffect(() => {
    // Trigger confetti when profile hits 100%
    if (totalStrength === 100) {
      setShowConfetti(true);
      setTimeout(() => {
        confettiRef.current?.play();
      }, 100);

      // Auto-hide confetti after 4 seconds
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [totalStrength]);

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
  // const handlePickImage = async () => {
  //   try {
  //     // 1. Open Picker
  //     const image = await ImagePicker.openPicker({
  //       cropping: true,
  //       cropperCircleOverlay: true,
  //       mediaType: 'photo',
  //     });

  //     // 2. Skia Compression (GPU Accelerated)
  //     setIsUploading(true);
  //     setUploadProgress(0); // Start progress early to show activity

  //     const compressedResult = await compressWithSkia(image);

  //     if (!compressedResult || !compressedResult.uri) {
  //       throw new Error("Failed to process image");
  //     }

  //     // 3. Prepare FormData using the compressed URI
  //     const uploadData = new FormData();

  //     uploadData.append('file', {
  //       uri: compressedResult.uri, // Use Skia's compressed Base64 URI
  //       type: 'image/jpeg',
  //       name: `${profile.userid}_${Date.now()}.jpg`,
  //     } as any);

  //     uploadData.append('userid', profile.userid);

  //     // 4. Start Upload with Progress Tracking
  //     const token = await AsyncStorage.getItem('accessToken');

  //     const response = await api.post('/files/profile_photo_upload.php', uploadData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       // Axios tracks the progress of the multipart request
  //       onUploadProgress: (progressEvent) => {
  //         const { loaded, total } = progressEvent;
  //         if (total) {
  //           const percent = Math.round((loaded * 100) / total);
  //           setUploadProgress(percent);
  //         }
  //       }
  //     });

  //     // 5. Success Handling
  //     if (response.data.success) {
  //       const fullUrl = `${API_BASE_URL_DEV_Profiles_Images}/${response.data.full_url}`;
  //       const thumbUrl = `${API_BASE_URL_DEV_Profiles_Thumbs}/${response.data.thumb_url}`;

  //       updateForm('profilePic', fullUrl);
  //       updateForm('profileThumb', thumbUrl);
  //       setProfileImage(fullUrl);

  //       // Synchronize with global User Context/State
  //       const updatedProfile: any = {
  //         profileThumb: response.data.thumb_url,
  //         profilePic: response.data.full_url,
  //       };
  //       await updateUser({ ...user, ...updatedProfile });

  //     } else {
  //       throw new Error(response.data.message || 'Upload failed');
  //     }
  //   } catch (error: any) {
  //     if (error.message !== 'User cancelled image selection') {
  //       console.error("Upload process error:", error);
  //       // Alert user of failure here if needed
  //     }
  //   } finally {
  //     setIsUploading(false);
  //     setUploadProgress(0);
  //   }
  // };
  const handlePickImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        cropping: true,
        cropperCircleOverlay: true,
        mediaType: 'photo',
      });

      // START LOADING & MODAL
      setIsUploading(true);
      setUploadProgress(0);

      // 1. Skia Compression
      const compressedResult = await compressWithSkia(image);
      if (!compressedResult?.uri) throw new Error("Compression failed");

      // 2. Prepare FormData
      const uploadData = new FormData();
      uploadData.append('file', {
        uri: compressedResult.uri,
        type: 'image/jpeg',
        name: `profile_${profile.userid}.jpg`,
      } as any);
      uploadData.append('userid', profile.userid);

      // 3. Axios Upload
      const token = await AsyncStorage.getItem('accessToken');
      const response = await api.post('/files/profile_photo_upload.php', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: ({ loaded, total }) => {
          if (total) {
            setUploadProgress(Math.round((loaded * 100) / total));
          }
        }
      });

      if (response.data.success) {
        // Success: Update your state and Context
        const fullUrl = `${API_BASE_URL_DEV_Profiles_Images}/${response.data.full_url}`;
        setProfileImage(fullUrl);
        // Synchronize with global User Context/State
        const updatedProfile: any = {
          profileThumb: response.data.thumb_url,
          profilePic: response.data.full_url,
        };
        await updateUser({ ...user, ...updatedProfile });
      }

    } catch (error: any) {
      if (error.message !== 'User cancelled image selection') {
        console.log(error);
        Alert.alert("Upload Error", error.message);
      }
    } finally {
      // CLOSE MODAL
      setIsUploading(false);
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



  // 1. Profile Strength Component with Vibrant Gradient
  const ProfileStrength = ({ percentage }: { percentage: number }) => {
    // 1. Determine Color and Status based on percentage
    const getStatusDetails = (pct: number) => {
      if (pct <= 40) {
        return {
          colors: ['#FF4D4D', '#FF2424'], // Red
          status: 'Weak',
          textColor: 'text-red-500'
        };
      } else if (pct <= 70) {
        return {
          colors: ['#FFB84D', '#FF9D42'], // Yellow/Orange
          status: 'Average',
          textColor: 'text-orange-500'
        };
      } else {
        return {
          colors: ['#34D399', '#10B981'], // Green
          status: 'Excellent',
          textColor: 'text-green-500'
        };
      }
    };

    const { colors, status, textColor } = getStatusDetails(percentage);

    return (
      <Box className="mx-4 mt-6 p-5 rounded-[24px] bg-white border border-outline-50 shadow-sm">
        <HStack className="justify-between items-center mb-3">
          <Text size="sm" className="font-bold text-typography-900">
            Profile Strength: {percentage}%
          </Text>
          <Text size="xs" className={`${textColor} font-bold uppercase`}>
            {status}
          </Text>
        </HStack>

        {/* Background Track */}
        <Box className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
          {/* Dynamic Gradient Progress */}
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: `${percentage}%`, height: '100%', borderRadius: 10 }}
          />
        </Box>

        <Text size="xs" className="mt-2 text-typography-500 leading-5">
          {percentage < 100
            ? "Add more details to reach 100% and get 3x more interests."
            : "Your profile is complete! You're seeing the best matches."}
        </Text>
      </Box>
    );
  };
  const ProfileChecklist = ({ checklist, navigation }: any) => {
    // Safety check to ensure checklist exists before mapping
    if (!checklist || checklist.length === 0) return null;

    return (
      <Box className="mx-4 mt-4 p-5 rounded-[24px] bg-white border border-outline-50 shadow-sm">
        <Heading size="sm" className="mb-4 text-typography-900">Complete your profile</Heading>
        <VStack space="md">
          {checklist.map((item: any, index: number) => (
            <HStack key={`item-${index}`} className="justify-between items-center">
              <HStack space="sm" className="items-center">
                {/* Checkbox Circle */}
                <Box
                  className={`w-5 h-5 rounded-full items-center justify-center ${item.isDone ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                >
                  {item.isDone ? (
                    <Icon as={CheckIcon} size="2xs" className="text-white" />
                  ) : (
                    <Box className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                  )}
                </Box>

                {/* Label Text */}
                <Text
                  size="sm"
                  className={item.isDone ? 'text-typography-400 line-through' : 'text-typography-900 font-medium'}
                >
                  {item.label}
                </Text>
              </HStack>

              {/* Action Link */}
              {!item.isDone && (
                <TouchableOpacity
                  onPress={() => {
                    if (item.screen && navigation) {
                      navigation.navigate(item.screen);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text size="xs" className="text-primary-600 font-bold uppercase tracking-wider">
                    + Add
                  </Text>
                </TouchableOpacity>
              )}
            </HStack>
          ))}
        </VStack>
      </Box>
    );
  };
  // Reusable Gradient Card Component
  const GradientCard = ({ children, title, onEdit }: any) => (
    <Box className="mx-4 mt-4 rounded-[24px] overflow-hidden border border-outline-50 shadow-sm">
      <LinearGradient
        colors={['#ffffff', '#fcfcfc', '#f7f9fc']} // Soft professional gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <VStack className="p-5">
          <HStack className="justify-between items-center mb-3">
            <Heading size="sm" className="text-error-500 font-bold uppercase tracking-wider">
              {title}
            </Heading>
            <TouchableOpacity onPress={onEdit} className="bg-white p-2 rounded-full shadow-sm border border-outline-50">
              <Icon as={EditIcon} size="xs" className="text-gray-500" />
            </TouchableOpacity>
          </HStack>
          {children}
        </VStack>
      </LinearGradient>
    </Box>
  );
  const updateForm = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));

  };
  // Logic to handle changing the number of children
  const handleChildrenCountChange = (val: string) => {
    const count = parseInt(val) || 0;
    updateForm('childrenCount', val);

    // Sync the kids array length with the input count
    const currentKids = [...(formData.kids || [])];
    if (count > currentKids.length) {
      // Add new empty kid objects
      const additional = Array(count - currentKids.length).fill({
        age: '',
        gender: '',
        livingTogether: 'Yes'
      });
      updateForm('kids', [...currentKids, ...additional]);
    } else {
      // Trim the array if count decreased
      updateForm('kids', currentKids.slice(0, count));
    }
  };

  // Logic to update a specific property of a specific child
  const updateKidDetail = (index: number, field: string, value: string) => {
    const updatedKids: any = [...formData.kids];
    updatedKids[index] = { ...updatedKids[index], [field]: value };
    updateForm('kids', updatedKids);
  };

  // Logic to remove a single child via the trash icon
  const removeChild = (index: number) => {
    const updatedKids = formData.kids.filter((_, i) => i !== index);
    updateForm('kids', updatedKids);
    updateForm('childrenCount', updatedKids.length.toString());
  };
  const toggleHobby = (hobby: string) => {
    setSelectedHobbies((prev: any) =>
      prev.includes(hobby)
        ? prev.filter((h: any) => h !== hobby)
        : [...prev, hobby]
    );
  };



  const getDynamicChildrenValue = () => {
    if (!formData.kids || formData.kids.length === 0) return "No Children";

    const counts: { [key: string]: number } = {};
    formData.kids.forEach((child: any) => {
      const g = child.gender || 'Child';
      counts[g] = (counts[g] || 0) + 1;
    });

    // Returns "2 Boys, 2 Girls" dynamically
    return Object.entries(counts)
      .map(([gender, count]) => `${count} ${gender}${count > 1 ? 's' : ''}`)
      .join(', ');
  };

  return (
    <Box className="flex-1 bg-[#F1F5F9]">

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {loading ? (
          <Center className="flex-1 h-screen">
            <Spinner size='large' color="$primary500" />
          </Center>
        ) : (
          <>
            {/* 1. HERO IMAGE SECTION (Matches ProfileDetailScreen) */}
            <Box className="h-[350px] w-full bg-gray-900">
              <Pressable onPress={handlePickImage} className="flex-1">
                <FastImage
                  source={{
                    uri: profileImage,
                    priority: FastImage.priority.high
                  }}
                  style={StyleSheet.absoluteFill}
                  resizeMode="cover"
                />

                {/* Camera Icon moved to Top Right */}
                <Box className="absolute top-12 right-6 z-20 bg-black/30 p-2 rounded-full border border-white/20">
                  <Icon as={CameraIcon} className="text-white" size="xl" />
                </Box>
              </Pressable>

              {/* Custom Back Button */}
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="absolute top-12 left-6 z-20 bg-black/30 p-2 rounded-full border border-white/20"
              >
                <Icon as={ChevronLeftIcon} className="text-white" size="xl" />
              </TouchableOpacity>

              {/* Gradient to blend into the white card */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.9)']}
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100 }}
              />
            </Box>

            {/* End Hero Image Section */}

            {/* Progress Section */}
            <ProfileStrength percentage={profileCompletion} />

            {/* 2. Interactive Checklist */}
            {/* {strength < 100 && <ProfileChecklist checklist={checklist} />} */}

            {/* Checklist: Only shows items that are NOT done */}
            {totalStrength < 100 && (
              <ProfileChecklist
                checklist={checklist}
                navigation={navigation}
              />
            )}

            {/* End Checklist */}

            {/* 3. About Section */}
            <GradientCard
              title="Personality & Expectations"
              onEdit={() => setIsAboutModalVisible(true)}
            >
              <Box className="relative">
                <Text
                  className="text-typography-600 leading-6 text-sm"
                  numberOfLines={isExpanded ? undefined : 3}
                >

                  {profile?.about || "I am glad you chose to visit my profile. Currently, I am employed as a Writer. My dreams and aspirations constantly drive me toward success..."}
                </Text>
                {!isExpanded && (
                  <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(247,249,252,0.9)', '#f7f9fc']}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 30 }}
                  />
                )}
              </Box>
              <TouchableOpacity
                onPress={() => setIsExpanded(!isExpanded)}
                className="mt-2 self-center"
              >
                <HStack className="items-center">
                  <Text className="text-cyan-600 font-bold text-xs uppercase tracking-tighter">
                    {isExpanded ? "Show Less" : "Read More"}
                  </Text>
                  <Icon as={isExpanded ? ChevronUpIcon : ChevronDownIcon} size="xs" className="text-cyan-600 ml-1" />
                </HStack>
              </TouchableOpacity>
            </GradientCard>


            <EditAboutModal
              isOpen={isAboutModalVisible}
              onClose={() => setIsAboutModalVisible(false)}
              content={profile?.about || "I am glad you chose to visit my profile. Currently, I am employed as a Writer. My dreams and aspirations constantly drive me toward success..."}
            />

            {/* 2. Basics Details Card */}

            <GradientCard
              title="Basic Details"
              icon={User}
              onEdit={() => setShowBasicsModal(true)}
              // Using the Blue-to-White gradient for the "Identity" section
              gradientColors={['#eff6ff', '#ffffff']}
            >
              <VStack space="lg" className="mt-2">

                {/* Row 1: Age & Date of Birth */}
                <HStack items-center space="md">
                  <HStack items-center space="md" className="flex-1">
                    <Box className="p-2.5 rounded-xl bg-blue-50">
                      <Icon as={User} size='lg' className="text-blue-600" />
                    </Box>
                    <VStack>
                      <Text size="xs" className="text-typography-500 font-medium">Age</Text>
                      <Text size="md" className="text-typography-900 font-bold">{formData.age || "28"} Years</Text>
                    </VStack>
                  </HStack>

                  <HStack items-center space="md" className="flex-1">
                    <Box className="p-2.5 rounded-xl bg-blue-50">
                      <Icon as={Calendar} size='lg' className="text-blue-600" />
                    </Box>
                    <VStack>
                      <Text size="xs" className="text-typography-500 font-medium">DOB</Text>
                      <Text size="md" className="text-typography-900 font-bold">{formData.dob || "01 Jan 1996"}</Text>
                    </VStack>
                  </HStack>
                </HStack>

                <Box className="h-[1px] bg-slate-100 w-full" />

                {/* Row 2: Marital Status */}
                <HStack items-center space="md">
                  <Box className="p-2.5 rounded-xl bg-blue-50">
                    <Icon as={Heart} size='lg' className="text-blue-600" />
                  </Box>
                  <VStack className="flex-1">
                    <Text size="xs" className="text-typography-500 font-medium">Marital Status</Text>
                    <Text size="md" className="text-typography-900 font-bold">{formData.maritalStatus || "Never Married"}</Text>
                  </VStack>
                </HStack>

                {/* Children Row - Logic for with and without children */}
                <HStack items-center space="md">
                  {!formData.hasChildren ? (
                    <>
                      {/* Case: Has Children - Show Count & Gender split */}
                      <HStack items-center space="md" className="flex-1">
                        <Box className="p-2.5 rounded-xl bg-blue-50">
                          <Icon as={Baby} size='lg' className="text-blue-600" />
                        </Box>
                        <VStack>
                          <Text size="xs" className="text-typography-500 font-medium">Children</Text>
                          <Text size="md" className="text-typography-900 font-bold">{formData.childrenCount || "1"}</Text>
                        </VStack>
                      </HStack>

                      <HStack items-center space="md" className="flex-1">
                        <Box className="p-2.5 rounded-xl bg-blue-50">
                          <Icon as={User} size='lg' className="text-blue-600" />
                        </Box>
                        <VStack>
                          <Text size="xs" className="text-typography-500 font-medium">Gender</Text>
                          <Text size="md" className="text-typography-900 font-bold">{getDynamicChildrenValue() || "Boy"}</Text>
                        </VStack>
                      </HStack>

                    </>
                  ) : (
                    /* Case: No Children - Show single full-width entry */
                    <HStack items-center space="md" className="flex-1">
                      <Box className="p-2.5 rounded-xl bg-blue-50">
                        <Icon as={Baby} size='lg' className="text-blue-600" />
                      </Box>
                      <VStack>
                        <Text size="xs" className="text-typography-500 font-medium">Children</Text>
                        <Text size="md" className="text-typography-900 font-bold">No Children</Text>
                      </VStack>
                    </HStack>
                  )}
                </HStack>




                <Box className="h-[1px] bg-slate-100 w-full" />

                {/* Row 3: Diet & Blood Group */}
                <HStack items-center space="md">
                  <HStack items-center space="md" className="flex-1">
                    <Box className="p-2.5 rounded-xl bg-blue-50">
                      <Icon as={Coffee} size='lg' className="text-blue-600" />
                    </Box>
                    <VStack>
                      <Text size="xs" className="text-typography-500 font-medium">Diet</Text>
                      <Text size="md" className="text-typography-900 font-bold">{formData.diet || "Veg"}</Text>
                    </VStack>
                  </HStack>

                  <HStack items-center space="md" className="flex-1">
                    <Box className="p-2.5 rounded-xl bg-blue-50">
                      <Icon as={Droplets} size='lg' className="text-blue-600" />
                    </Box>
                    <VStack>
                      <Text size="xs" className="text-typography-500 font-medium">Blood Group</Text>
                      <Text size="md" className="text-typography-900 font-bold">{formData.bloodGroup || "O+"}</Text>
                    </VStack>
                  </HStack>
                </HStack>

                {/* Row 5: Health & Disability */}
                <HStack items-center space="md">
                  <HStack items-center space="md" className="flex-1">
                    <Box className="p-2.5 rounded-xl bg-blue-50">
                      <Icon as={Activity} size='lg' className="text-blue-600" />
                    </Box>
                    <VStack>
                      <Text size="xs" className="text-typography-500 font-medium">Health Info</Text>
                      <Text size="md" className="text-typography-900 font-bold">{formData.healthInfo || "Fit / Healthy"}</Text>
                    </VStack>
                  </HStack>

                  <HStack items-center space="md" className="flex-1">
                    <Box className="p-2.5 rounded-xl bg-blue-50">
                      <Icon as={Accessibility} size='lg' className="text-blue-600" />
                    </Box>
                    <VStack>
                      <Text size="xs" className="text-typography-500 font-medium">Disability</Text>
                      <Text size="md" className="text-typography-900 font-bold">{formData.disability || "None"}</Text>
                    </VStack>
                  </HStack>
                </HStack>


                {/* Verification Hint */}
                <HStack space="xs" items-center className="bg-slate-50 p-3 rounded-2xl mt-2 border border-slate-100">
                  <Icon as={Info} size='sm' className="text-slate-400" />
                  <Text size="xs" className="text-slate-500 italic">
                    Basic info like Age & DOB are verified via govt. ID.
                  </Text>
                </HStack>

              </VStack>
            </GradientCard>

            {/* The Modal Component */}
            <EditBasicsModalScreen
              isOpen={showBasicsModal}
              onClose={() => setShowBasicsModal(false)}
              user={user}
            />

            {/* End Basics Details Card */}


            {/* 4. Religious & Community Details */}

            <GradientCard
              title="Religion & Community"
              icon={MoonStar}
              onEdit={() => setShowReligionModal(true)}
              gradientColors={['#f0f9ff', '#ffffff']} // Updated to Blue theme
            >
              <VStack space="lg" className="mt-2">
                {/* Row 1: Religion */}
                <HStack items-center space="md">
                  <Box className="p-2.5 rounded-xl bg-blue-50">
                    <Icon as={MoonStar} size='lg' className="text-blue-600" />
                  </Box>
                  <VStack>
                    <Text size="xs" className="text-typography-500 font-medium uppercase tracking-tight">Religion</Text>
                    <Text size="md" className="text-typography-900 font-bold">{formData.religion || "Not Specified"}</Text>
                  </VStack>
                </HStack>

                <Box className="h-[1px] bg-slate-100 w-full" />

                {/* Row 2: Mother Tongue */}
                <HStack items-center space="md">
                  <Box className="p-2.5 rounded-xl bg-blue-50">
                    <Icon as={Languages} size='lg' className="text-blue-600" />
                  </Box>
                  <VStack>
                    <Text size="xs" className="text-typography-500 font-medium uppercase tracking-tight">Mother Tongue</Text>
                    <Text size="md" className="text-typography-900 font-bold">{formData.motherTongue || "Not Specified"}</Text>
                  </VStack>
                </HStack>

                <Box className="h-[1px] bg-slate-100 w-full" />

                {/* Row 3: Community & Sub Community */}
                <HStack items-center space="md">
                  <HStack items-center space="md" className="flex-1">
                    <Box className="p-2.5 rounded-xl bg-blue-50">
                      <Icon as={Users2} size='lg' className="text-blue-600" />
                    </Box>
                    <VStack>
                      <Text size="xs" className="text-typography-500 font-medium uppercase tracking-tight">Community</Text>
                      <Text size="md" className="text-typography-900 font-bold">{formData.community || "Not Specified"}</Text>
                    </VStack>
                  </HStack>
                  <VStack className="flex-1 border-l border-slate-100 pl-4">
                    <Text size="xs" className="text-typography-500 font-medium uppercase tracking-tight">Sub Community</Text>
                    <Text size="md" className="text-typography-900 font-bold">{formData.subCommunity || "None"}</Text>
                  </VStack>
                </HStack>

                <Box className="h-[1px] bg-slate-100 w-full" />

                {/* Row 4: Caste No Bar Status */}
                <HStack items-center space="md">
                  <Box className={`p-2.5 rounded-xl ${formData.isCasteNoBar ? 'bg-blue-600' : 'bg-slate-100'}`}>
                    <Icon as={Check} size='sm' className={formData.isCasteNoBar ? 'text-white' : 'text-slate-400'} />
                  </Box>
                  <VStack>
                    <Text size="xs" className="text-typography-500 font-medium uppercase tracking-tight">Preference</Text>
                    <Text size="md" className={`font-bold ${formData.isCasteNoBar ? 'text-blue-600' : 'text-typography-900'}`}>
                      {formData.isCasteNoBar ? "Caste No Bar" : "Specific Community Only"}
                    </Text>
                  </VStack>
                </HStack>

                {/* Community Match Hint */}
                <HStack space="xs" items-center className="bg-blue-50/50 p-3 rounded-2xl mt-2 border border-blue-100">
                  <Icon as={Info} size='sm' className="text-blue-400" />
                  <Text size="xs" className="text-blue-600 italic">
                    {formData.isCasteNoBar
                      ? "You'll see matches from all communities."
                      : `Showing active profiles from the ${formData.community || 'selected'} community.`}
                  </Text>
                </HStack>
              </VStack>
            </GradientCard>

            <EditReligionModal
              isOpen={showReligionModal}
              onClose={() => setShowReligionModal(false)}
              formData={formData}
              // updateForm={updateForm}
              // onSave={handleSaveReligion}
              // isSaving={isSaving}
              // validationTriggered={validationTriggered}
              data={{ RELIGION_DATA, COMMUNITIES, LIVINGIN }}
            />
            {/* 4. End Religious & Community Details */}

            {/*  4. Contact details */}

            <GradientCard
              title="Contact Details"
              icon={Phone}
              onEdit={() => setShowContactModal(true)}
              // A clean Cyan-to-White gradient for a fresh communication feel
              gradientColors={['#ecfeff', '#ffffff']}
            >
              <VStack space="lg" className="mt-2">

                {/* Phone Number Row */}
                <HStack items-center justify-between className="py-2">
                  <HStack space="md" items-center>
                    <Box className="p-2.5 rounded-xl bg-cyan-50">
                      <Icon as={Phone} size='lg' className="text-cyan-600" />
                    </Box>
                    <VStack>
                      <Text size="xs" className="text-typography-500 font-medium">Mobile Number</Text>
                      <HStack items-center space="xs">
                        <Text size="md" className="text-typography-900 font-bold">
                          {user?.phone || "Not Specified"}
                        </Text>
                        {user?.phone && (
                          <Icon as={CheckCircle2} size='lg' className="text-emerald-500" />
                        )}
                      </HStack>
                    </VStack>
                  </HStack>
                </HStack>

                {/* Divider */}
                <Box className="h-[1px] bg-slate-100 w-full" />


                {/* Email Row */}
                <HStack items-center justify-between className="py-2">
                  <HStack space="md" items-center>
                    <Box className="p-2.5 rounded-xl bg-cyan-50">
                      <Icon as={Mail} size='lg' className="text-cyan-600" />
                    </Box>
                    <VStack>
                      <Text size="xs" className="text-typography-500 font-medium">Email Address</Text>
                      <HStack items-center space="xs">
                        <Text size="md" className="text-typography-900 font-bold">
                          {user?.email || "Not Specified"}
                        </Text>
                        {user?.email && (
                          <Icon as={CheckCircle2} size='lg' className="text-emerald-500" />
                        )}
                      </HStack>
                    </VStack>
                  </HStack>
                </HStack>

                {/* Privacy Badge */}
                <HStack space="xs" items-center className="bg-slate-50 p-3 rounded-2xl mt-2 border border-slate-100">
                  <Icon as={ShieldCheck} size='sm' className="text-emerald-600" />
                  <Text size="xs" className="text-slate-500 italic">
                    Your contact details are only shared with accepted matches.
                  </Text>
                </HStack>

              </VStack>
            </GradientCard>

            <ContactModal
              isOpen={showContactModal}
              onClose={() => setShowContactModal(false)}
              formData={formData}
              // updateForm={updateForm}
              // onSave={handleSaveContact}
              // isSaving={isSaving}
              validationTriggered={false} // Set to true if you want to show errors immediately
            />

            {/* 4. End Contact details */}

            {/* 5. Family Details Section */}

            <GradientCard
              title="Family Details"
              icon={Users}
              onEdit={() => setShowFamilyModal(true)}
              gradientColors={['#f0f9ff', '#ffffff']} // Professional blue gradient
            >
              <VStack space="lg" className="mt-2">

                {/* Row 1: Parents */}
                <HStack items-center space="md">
                  <HStack items-center space="md" className="flex-1">
                    <Box className="p-2.5 rounded-xl bg-blue-50">
                      <Icon as={UserRound} size='lg' className="text-blue-600" />
                    </Box>
                    <VStack>
                      <Text size="xs" className="text-typography-500 font-medium uppercase tracking-tight">Mother</Text>
                      <Text size="md" className="text-typography-900 font-bold">{formData.motherDetails || "Not Specified"}</Text>
                    </VStack>
                  </HStack>

                  <HStack items-center space="md" className="flex-1">
                    <Box className="p-2.5 rounded-xl bg-blue-50">
                      <Icon as={UserSquare} size='lg' className="text-blue-600" />
                    </Box>
                    <VStack>
                      <Text size="xs" className="text-typography-500 font-medium uppercase tracking-tight">Father</Text>
                      <Text size="md" className="text-typography-900 font-bold">{formData.fatherDetails || "Not Specified"}</Text>
                    </VStack>
                  </HStack>
                </HStack>

                <Box className="h-[1px] bg-slate-100 w-full" />

                {/* Row 2: Siblings */}
                <HStack items-center space="md">
                  <HStack items-center space="md" className="flex-1">
                    <Box className="p-2.5 rounded-xl bg-blue-50">
                      <Icon as={Users2} size='lg' className="text-blue-600" />
                    </Box>
                    <VStack>
                      <Text size="xs" className="text-typography-500 font-medium uppercase tracking-tight">Sisters</Text>
                      <Text size="md" className="text-typography-900 font-bold">{formData.noOfSisters || "0"}</Text>
                    </VStack>
                  </HStack>

                  <HStack items-center space="md" className="flex-1">
                    <Box className="p-2.5 rounded-xl bg-blue-50">
                      <Icon as={Users} size='lg' className="text-blue-600" />
                    </Box>
                    <VStack>
                      <Text size="xs" className="text-typography-500 font-medium uppercase tracking-tight">Brothers</Text>
                      <Text size="md" className="text-typography-900 font-bold">{formData.noOfBrothers || "0"}</Text>
                    </VStack>
                  </HStack>
                </HStack>

                <Box className="h-[1px] bg-slate-100 w-full" />

                {/* Row 3: Financial Status (New Field) */}
                <HStack items-center space="md">
                  <HStack items-center space="md" className="flex-1">
                    <Box className="p-2.5 rounded-xl bg-blue-50">
                      <Icon as={Briefcase} size='lg' className="text-blue-600" />
                    </Box>
                    <VStack>
                      <Text size="xs" className="text-typography-500 font-medium uppercase tracking-tight">Financial Status</Text>
                      <HStack space="xs" items-center>
                        <Text size="md" className="text-typography-900 font-bold">{formData.familyFinancialStatus || "Not Specified"}</Text>
                        {formData.familyFinancialStatus === 'Elite' && <Box className="w-2 h-2 rounded-full bg-amber-400" />}
                      </HStack>
                    </VStack>
                  </HStack>
                </HStack>

                <Box className="h-[1px] bg-slate-100 w-full" />

                {/* Row 4: Location */}
                <HStack items-center space="md">
                  <HStack items-center space="md" className="flex-1">
                    <Box className="p-2.5 rounded-xl bg-blue-50">
                      <Icon as={MapPin} size='lg' className="text-blue-600" />
                    </Box>
                    <VStack className="flex-1">
                      <Text size="xs" className="text-typography-500 font-medium uppercase tracking-tight">Family Location</Text>
                      <Text size="md" className="text-typography-900 font-bold" numberOfLines={1} ellipsizeMode="tail">
                        {formData.city ? `${formData.city}, ${formData.state}` : "Location not set"}
                      </Text>
                    </VStack>
                  </HStack>
                </HStack>

              </VStack>
            </GradientCard>
            <FamilyDetailsModal
              isOpen={showFamilyModal}
              onClose={() => setShowFamilyModal(false)}
              formData={formData}
              updateForm={updateForm}
            //   onSave={handleSaveFamily}
            //   isSaving={isSaving}
            //  validationTriggered={false}
            />
            {/* End Family Details Section*/}


            {/* 5. Location & Community */}

            <GradientCard
              title="Location & Community"
              icon={MapPin}
              onEdit={() => setShowLocationModal(true)}
              // A soft rose-to-white gradient to represent social/location mapping
              gradientColors={['#fff1f2', '#ffffff']}
            >
              <VStack space="lg" className="mt-2">

                {/* State & City Row */}
                <HStack items-center justify-between className="py-2">
                  <HStack space="md" items-center>
                    <Box className="p-2.5 rounded-xl bg-rose-50">
                      <Icon as={MapPin} size='lg' className="text-rose-600" />
                    </Box>
                    <VStack>
                      <Text size="xs" className="text-typography-500 font-medium">Location</Text>
                      <HStack space="xs" items-center>
                        <Text size="md" className="text-typography-900 font-bold">
                          {formData.city || "Not Specified"}
                        </Text>
                        {formData.city && (
                          <Icon as={CheckCircle2} size='lg' className="text-emerald-500" />
                        )}
                      </HStack>
                    </VStack>
                  </HStack>
                </HStack>

                <Box className="h-[1px] bg-slate-100 w-full" />

                {/* Country Row */}
                <HStack items-center justify-between className="py-2">
                  <HStack space="md" items-center>
                    <Box className="p-2.5 rounded-xl bg-rose-50">
                      <Icon as={Globe} size='lg' className="text-rose-600" />
                    </Box>
                    <VStack>
                      <Text size="xs" className="text-typography-500 font-medium">Country</Text>
                      <Text size="md" className="text-typography-900 font-bold">
                        {formData.country || "Not Specified"}
                      </Text>
                    </VStack>
                  </HStack>
                </HStack>

                {/* Location Hint */}
                <HStack space="xs" items-center className="bg-slate-50 p-3 rounded-2xl mt-2 border border-slate-100">
                  <Icon as={Info} size='sm' className="text-slate-400" />
                  <Text size="xs" className="text-slate-500 italic">
                    {formData.city ? `Showing you active profiles from ${formData.city}.` : "Update your location to see nearby matches."}
                  </Text>
                </HStack>

              </VStack>
            </GradientCard>


            <EditLocationModal
              isOpen={showLocationModal}
              onClose={() => setShowLocationModal(false)}
              formData={formData}
            // updateForm={updateForm}
            // STATES={STATES}
            // cities={cities}
            // isLoading={isLoadingCities}
            // fetchCities={fetchCities}
            // isCasteNoBar={isCasteNoBar}
            // setIsCasteNoBar={setIsCasteNoBar}
            // validationTriggered={validationTriggered}
            // handleSave={handleSaveLocation}
            // isSaving={isSaving}
            />
            {/* End Location Modal */}

            {/* 6. Personal & Family */}
            <GradientCard
              title="Personal & Family"
              icon={Heart}
              onEdit={() => setShowFamilyModal(true)}
              gradientColors={['#ecfeff', '#ffffff']} // Cyan-50 to White
            >
              <VStack space="lg" className="mt-2">
                {/* Height & Marital Status Row */}
                <HStack space="md">
                  <DetailRow
                    icon={Ruler}
                    label="Height"
                    value={formData.height || "Not Set"}
                    className="flex-1"
                  />
                  <DetailRow
                    icon={Heart}
                    label="Status"
                    value={formData.maritalStatus || "Not Set"}
                    className="flex-1"
                  />
                </HStack>

                {/* Children Summary Row */}
                {formData.maritalStatus !== 'Never Married' && (
                  <>
                    <Box className="h-[1px] bg-slate-100 w-full" />
                    <HStack items-center space="md" className="py-1">
                      <Box className="p-2.5 rounded-xl bg-cyan-50">
                        <Icon as={Baby} size='lg' className="text-cyan-600" />
                      </Box>
                      <VStack>
                        <Text size="xs" className="text-typography-500 font-medium">Children</Text>
                        <Text size="md" className="text-typography-900 font-bold">
                          {formData.hasChildren
                            ? `${formData.childrenCount} Child(ren) ${formData.kids.length > 0 ? `(${formData.kids.map((k: any) => k.gender).join(', ')})` : ''}`
                            : "No Children"}
                        </Text>
                      </VStack>
                    </HStack>
                  </>
                )}
              </VStack>
            </GradientCard>
            {/* <EditFamilyModal
          isOpen={showFamilyModal}
          onClose={() => setShowFamilyModal(false)}
          formData={formData}
          updateForm={updateForm}
          HEIGHT_DATA={HEIGHT_DATA} // Your constant array
          MARITAL_STATUS={MARITAL_STATUS} // Your constant array
          handleChildrenCountChange={handleChildrenCountChange}
          updateKidDetail={updateKidDetail}
          removeChild={removeChild}
         validationTriggered={validationTriggered}
         handleSave={onSaveFamilyDetails} // Your API save function
         isSaving={isSaving}
        /> */}

            {/* 7. Education and Career Section */}



            <GradientCard
              title="Education & Career"
              icon={GraduationCap}
              onEdit={() => setShowEducationModal(true)}
              gradientColors={['#f5f3ff', '#ffffff']} // Violet-50 to White
            >
              <VStack space="lg" className="mt-2">
                {/* Education Section */}
                <HStack items-center space="md">
                  <Box className="p-2.5 rounded-xl bg-violet-50">
                    <Icon as={GraduationCap} size='xl' className="text-violet-600" />
                  </Box>
                  <VStack className="flex-1">
                    <Text size="xs" className="text-typography-500 font-medium uppercase tracking-tight">Highest Qualification</Text>
                    <Text size="md" className="text-typography-900 font-bold">
                      {formData.qualification || "B.E / B.Tech - Engineering"}
                    </Text>
                    <Text size="sm" className="text-typography-600 italic">
                      {formData.college || "Indra Ganesan College of Engineering"}
                    </Text>
                  </VStack>
                </HStack>

                <Box className="h-[1px] bg-slate-100 w-full" />

                {/* Career Section */}
                <HStack items-center space="md">
                  <Box className="p-2.5 rounded-xl bg-violet-50">
                    <Icon as={Briefcase} size='xl' className="text-violet-600" />
                  </Box>
                  <VStack className="flex-1">
                    <Text size="xs" className="text-typography-500 font-medium uppercase tracking-tight">Working As</Text>
                    <Text size="md" className="text-typography-900 font-bold">
                      {formData.workingAs || "Software Developer"}
                    </Text>
                    <Text size="sm" className="text-typography-600">
                      {formData.employerName || "PsiberTech Solutions Pte Ltd"}
                    </Text>
                  </VStack>
                </HStack>

                <Box className="h-[1px] bg-slate-100 w-full" />

                {/* Income Row */}
                <HStack items-center space="md">
                  <Box className="p-2.5 rounded-xl bg-violet-50">
                    <Icon as={Banknote} size='xl' className="text-violet-600" />
                  </Box>
                  <VStack className="flex-1">
                    <Text size="xs" className="text-typography-500 font-medium uppercase tracking-tight">Annual Income</Text>
                    <Text size="md" className="text-typography-900 font-bold">
                      {formData.annualIncome || "Dont want to specify"}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </GradientCard>

            {/* THE MODAL CALL */}
            <EducationDetailsModal
              isOpen={showEducationModal}
              onClose={() => setShowEducationModal(false)}
              formData={formData} // Pass your state data
              updateForm={updateForm} // Pass your update function
            // onSave={handleSaveEducation}
            // isSaving={isSaving}
            />

            {/* 8. Career & Income card */}
            <GradientCard
              title="Career & Income"
              icon={Briefcase}
              onEdit={() => setShowCareerModal(true)}
              gradientColors={['#fffbeb', '#ffffff']} // Amber-50 to White
            >
              <VStack space="lg" className="mt-2">
                {/* Profession & Company */}
                <HStack items-center space="md">
                  <Box className="p-2.5 rounded-xl bg-amber-50">
                    <Icon as={Briefcase} size='xl' className="text-amber-600" />
                  </Box>
                  <VStack className="flex-1">
                    <Text size="xs" className="text-typography-500 font-medium">Profession</Text>
                    <Text size="md" className="text-typography-900 font-bold">
                      {formData.worksas || "Not Specified"}
                    </Text>
                    {formData.companyName && (
                      <Text size="xs" className="text-amber-700 font-medium">{formData.companyName}</Text>
                    )}
                  </VStack>
                </HStack>

                <Box className="h-[1px] bg-slate-100 w-full" />

                {/* Income Row */}
                <HStack items-center space="md">
                  <Box className="p-2.5 rounded-xl bg-amber-50">
                    <Icon as={Banknote} size='xl' className="text-amber-600" />
                  </Box>
                  <VStack className="flex-1">
                    <Text size="xs" className="text-typography-500 font-medium">Annual Income</Text>
                    <Text size="md" className="text-typography-900 font-bold">
                      {formData.income || "Not Specified"}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </GradientCard>

            <EditCareerModal
              isOpen={showCareerModal}
              onClose={() => setShowCareerModal(false)}
              formData={formData}
              updateForm={updateForm}
              INCOME_RANGES={INCOME_RANGES}
              WORK_WITH={WORK_WITH}
            // validationTriggered={validationTriggered}
            // handleSave={handleSaveCareer}
            // isSaving={isSaving}
            />

            {/* 9. Hobbiew */}

            <GradientCard
              title="Hobbies & Interests"
              icon={Sparkles}
              onEdit={() => setShowHobbiesModal(true)}
              gradientColors={['#ecfdf5', '#ffffff']} // Emerald-50 to White
            >
              <HStack className="flex-wrap gap-2 mt-2">
                {selectedHobbies.length > 0 ? (
                  selectedHobbies.map((hobby) => (
                    <Box key={hobby} className="px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200">
                      <Text size="xs" className="text-emerald-700 font-bold">{hobby}</Text>
                    </Box>
                  ))
                ) : (
                  <Text size="sm" className="text-typography-400 italic">No hobbies added yet</Text>
                )}
              </HStack>
            </GradientCard>
            <EditHobbiesModal
              isOpen={showHobbiesModal}
              onClose={() => setShowHobbiesModal(false)}
              selectedHobbies={selectedHobbies}
              toggleHobby={toggleHobby}
            // handleSave={onSaveHobbies}
            // isSaving={isSaving}
            />

            <GradientCard
              title="Partner Preferences"
              icon={Heart}
              onEdit={() => setShowPreferencesModal(true)}
              // Using the same Rose-to-White gradient for consistency with the Location/Community cards
              gradientColors={['#fff1f2', '#ffffff']}
            >
              <VStack space="lg" className="mt-2">

                {/* Age & Height Preference Row */}
                <HStack items-center justify-between className="py-2">
                  <HStack space="md" items-center>
                    <Box className="p-2.5 rounded-xl bg-rose-50">
                      <Icon as={Scale} size='lg' className="text-rose-600" />
                    </Box>
                    <VStack>
                      <Text size="xs" className="text-typography-500 font-medium">Age & Height</Text>
                      <Text size="md" className="text-typography-900 font-bold">
                        {formData.prefAgeMin && formData.prefAgeMax
                          ? `${formData.prefAgeMin} - ${formData.prefAgeMax} Yrs`
                          : "Not Set"}
                        {formData.prefHeightMin && `, ${formData.prefHeightMin}+`}
                      </Text>
                    </VStack>
                  </HStack>
                </HStack>

                {/* Divider */}
                <Box className="h-[1px] bg-slate-100 w-full" />

                {/* Education & Income Preference */}
                <HStack items-center justify-between className="py-2">
                  <HStack space="md" items-center>
                    <Box className="p-2.5 rounded-xl bg-rose-50">
                      <Icon as={GraduationCap} size='lg' className="text-rose-600" />
                    </Box>
                    <VStack className="flex-1">
                      <Text size="xs" className="text-typography-500 font-medium">Professional Preference</Text>
                      <HStack items-center space="xs" className="flex-wrap">
                        <Text size="md" className="text-typography-900 font-bold">
                          {formData.prefEducation || "Any Education"}
                        </Text>
                        {formData.prefIncome && (
                          <Box className="bg-rose-100 px-2 py-0.5 rounded-full">
                            <Text className="text-[10px] text-rose-700 font-bold">
                              {formData.prefIncome}+ LPA
                            </Text>
                          </Box>
                        )}
                      </HStack>
                    </VStack>
                  </HStack>
                </HStack>

                {/* Match Compatibility Hint */}
                <HStack space="xs" items-center className="bg-slate-50 p-3 rounded-2xl mt-2 border border-slate-100">
                  <Icon as={Info} size='sm' className="text-slate-400" />
                  <Text size="xs" className="text-slate-500 italic">
                    Matches are filtered based on these criteria to improve compatibility.
                  </Text>
                </HStack>

              </VStack>
            </GradientCard>

            <Box className="h-10" />
          </>
        )}
        <UploadProgressModal
          isOpen={isUploading}
          uploadProgress={uploadProgress}
        />
      </ScrollView>


    </Box>
  );
}
// Reuse this Row component for the Basics section
const DetailRow = ({ label, value }: any) => (
  <HStack className="items-start">
    <Text size="xs" className="text-typography-400 w-32 font-medium">{label}</Text>
    <Text size="sm" className="text-typography-800 font-semibold flex-1">:  {value}</Text>
  </HStack>
);




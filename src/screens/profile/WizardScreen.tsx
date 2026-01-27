import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Platform, Pressable, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
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
import { Dropdown } from 'react-native-element-dropdown';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useAlert } from '@/src/context/AlertContext';
import { useAuth } from '@/src/context/AuthContext';
import { AnimateError } from '../common/AnimateError';
import { itemData, QualificationTemp, transformGroupedData } from '@/src/utils/qualification';

// --- DATA SOURCES ---
const RELIGION_DATA = [
  { label: "Christian", value: "Christian" },
  { label: "Hindu", value: "Hindu" },
  { label: "Muslim", value: "Muslim" },
  { label: "Sikh", value: "Sikh" },
  { label: "Jain", value: "Jain" },
];
const COMMUNITIES = [
  { label: "Tamil", value: "Tamil" },
  { label: "Telugu", value: "Telugu" },
  { label: "Malayalam", value: "Malayalam" },
  { label: "Kannada", value: "Kannada" },
  { label: "Hindi", value: "Hindi" },
];
// const QUALIFICATIONS = [
//   { label: "Bachelors", value: "Bachelors" },
//   { label: "Masters", value: "Masters" },
//   { label: "PhD", value: "PhD" },
//   { label: "Diploma", value: "Diploma" },
//   { label: "High School", value: "High School" },
// ];
const QUALIFICATIONS = itemData
console.log('QUALIFICATIONS', QUALIFICATIONS);
const INCOME_RANGES = [
  { label: "3L - 5L", value: "3L - 5L" },
  { label: "5L - 10L", value: "5L - 10L" },
  { label: "10L - 15L", value: "10L - 15L" },
  { label: "15L - 25L", value: "15L - 25L" },
  { label: "25L+", value: "25L+" },
];
const LIVINGIN = [
  { label: "Australia", value: "Australia" },
  { label: "Canada", value: "Canada" },
  { label: "India", value: "India" },
  { label: "New Zealand", value: "New Zealand" },
  { label: "Kuwait", value: "Kuwait" },
  { label: "Pakistan", value: "Pakistan" },
  { label: "Qatar", value: "Qatar" },
  { label: "Saudi Arabia", value: "Saudi Arabia" },
  { label: "UAE", value: "UAE" },
  { label: "UK", value: "UK" },
  { label: "USA", value: "USA" },
];
const STATES = [
  { "StateCode": "TN", "StateName": "Tamil Nadu" },
  { "StateCode": "KA", "StateName": "Karnataka" },

  // { "StateCode": "MH", "StateName": "Maharashtra" },
  // { "StateCode": "GJ", "StateName": "Gujarat" },
  // { "StateCode": "DL", "StateName": "Delhi" },
  // { "StateCode": "UP", "StateName": "Uttar Pradesh" },
  // { "StateCode": "WB", "StateName": "West Bengal" },
  // { "StateCode": "MP", "StateName": "Madhya Pradesh" },
  // { "StateCode": "RJ", "StateName": "Rajasthan" },
  // { "StateCode": "BR", "StateName": "Bihar" },
  // { "StateCode": "JK", "StateName": "Jammu and Kashmir" },
  // { "StateCode": "HR", "StateName": "Haryana" },
  // { "StateCode": "OR", "StateName": "Odisha" },
  // { "StateCode": "KL", "StateName": "Kerala" },
  // { "StateCode": "AS", "StateName": "Assam" },
  // { "StateCode": "CG", "StateName": "Chhattisgarh" },
  // { "StateCode": "JH", "StateName": "Jharkhand" },
  // { "StateCode": "PY", "StateName": "Punjab" },
  // { "StateCode": "SK", "StateName": "Sikkim" },
  // { "StateCode": "AP", "StateName": "Andhra Pradesh" },
  // { "StateCode": "ML", "StateName": "Meghalaya" },
  // { "StateCode": "TR", "StateName": "Tripura" },
  // { "StateCode": "MN", "StateName": "Manipur" },
  // { "StateCode": "AR", "StateName": "Arunachal Pradesh" },
  // { "StateCode": "UT", "StateName": "Uttarakhand" },
  // { "StateCode": "CH", "StateName": "Chandigarh" },
  // { "StateCode": "LA", "StateName": "Ladakh" },
  // { "StateCode": "AN", "StateName": "Andaman and Nicobar Islands" },
]
const SUB_COMMUNITIES =
  [
    {
      "label": "Anglo Indian",
      "value": "Anglo Indian"
    },
    {
      "label": "Basel Mission",
      "value": "Basel Mission"
    },
    {
      "label": "Born Again",
      "value": "Born Again"
    },
    {
      "label": "Bretheren",
      "value": "Bretheren"
    },
    {
      "label": "Cannonite",
      "value": "Cannonite"
    },
    {
      "label": "Catholic",
      "value": "Catholic"
    },
    {
      "label": "Catholic Malankara",
      "value": "Catholic Malankara"
    },
    {
      "label": "Chaldean Syrian",
      "value": "Chaldean Syrian"
    },
    {
      "label": "Cheramar",
      "value": "Cheramar"
    },
    {
      "label": "Christian Nadar",
      "value": "Christian Nadar"
    },
    {
      "label": "Church of North India (CNI)",
      "value": "Church of North India (CNI)"
    },
    {
      "label": "Church of South India (CSI)",
      "value": "Church of South India (CSI)"
    },
    {
      "label": "CMS",
      "value": "CMS"
    },
    {
      "label": "Convert",
      "value": "Convert"
    },
    {
      "label": "Evangelical",
      "value": "Evangelical"
    },
    {
      "label": "Indian Orthodox",
      "value": "Indian Orthodox"
    },
    {
      "label": "Intercaste",
      "value": "Intercaste"
    },
    {
      "label": "IPC",
      "value": "IPC"
    },
    {
      "label": "Jacobite",
      "value": "Jacobite"
    },
    {
      "label": "Knanaya",
      "value": "Knanaya"
    },
    {
      "label": "Knanya",
      "value": "Knanya"
    },
    {
      "label": "Latin Catholic",
      "value": "Latin Catholic"
    },
    {
      "label": "Marthoma",
      "value": "Marthoma"
    },
    {
      "label": "Methodist",
      "value": "Methodist"
    },
    {
      "label": "Mormon",
      "value": "Mormon"
    },
    {
      "label": "Orthodox",
      "value": "Orthodox"
    },
    {
      "label": "Pentecost",
      "value": "Pentecost"
    },
    {
      "label": "Presbyterian",
      "value": "Presbyterian"
    },
    {
      "label": "Protestant",
      "value": "Protestant"
    },
    {
      "label": "RCSC",
      "value": "RCSC"
    },
    {
      "label": "Roman Catholic",
      "value": "Roman Catholic"
    },
    {
      "label": "Salvation Army",
      "value": "Salvation Army"
    },
    {
      "label": "Scheduled Caste (SC)",
      "value": "Scheduled Caste (SC)"
    },
    {
      "label": "Scheduled Tribe (ST)",
      "value": "Scheduled Tribe (ST)"
    },
    {
      "label": "Seventh day Adventist",
      "value": "Seventh day Adventist"
    },
    {
      "label": "Syrian",
      "value": "Syrian"
    },
    {
      "label": "Syrian Catholic",
      "value": "Syrian Catholic"
    },
    {
      "label": "Syrian Orthodox",
      "value": "Syrian Orthodox"
    },
    {
      "label": "Syro Malabar",
      "value": "Syro Malabar"
    },
    {
      "label": "Catholic Knanya",
      "value": "Catholic Knanya"
    },
    {
      "label": "Jacobite Knanya",
      "value": "Jacobite Knanya"
    },
    {
      "label": "Knanaya Catholic",
      "value": "Knanaya Catholic"
    },
    {
      "label": "Knanaya Jacobite",
      "value": "Knanaya Jacobite"
    },
    {
      "label": "Knanaya Pentecostal",
      "value": "Knanaya Pentecostal"
    },
    {
      "label": "Malankara",
      "value": "Malankara"
    },
    {
      "label": "Malankara Catholic",
      "value": "Malankara Catholic"
    },
    {
      "label": "Manglorean",
      "value": "Manglorean"
    },
    {
      "label": "Nadar",
      "value": "Nadar"
    }
  ]

const MotherTongue = [
  [
    { label: "Hindi", value: "Hindi" },
    { label: "Marathi", value: "Marathi" },
    { label: "Punjabi", value: "Punjabi" },
    { label: "Bengali", value: "Bengali" },
    { label: "Gujarati", value: "Gujarati" },
    { label: "Urdu", value: "Urdu" },
    { label: "Telugu", value: "Telugu" },
    { label: "Kannada", value: "Kannada" },
    { label: "English", value: "English" },
    { label: "Tamil", value: "Tamil" },
    { label: "Odia", value: "Odia" },
    { label: "Marwari", value: "Marwari" },
    { label: "Aka", value: "Aka" },
    { label: "Arabic", value: "Arabic" },
    { label: "Arunachali", value: "Arunachali" },
    { label: "Assamese", value: "Assamese" },
    { label: "Awadhi", value: "Awadhi" },
    { label: "Baluchi", value: "Baluchi" },
    { label: "Bhojpuri", value: "Bhojpuri" },
    { label: "Bhutia", value: "Bhutia" },
    { label: "Brahui", value: "Brahui" },
    { label: "Brij", value: "Brij" },
    { label: "Burmese", value: "Burmese" },
    { label: "Chattisgarhi", value: "Chattisgarhi" },
    { label: "Chinese", value: "Chinese" },
    { label: "Coorgi", value: "Coorgi" },
    { label: "Dogri", value: "Dogri" },
    { label: "French", value: "French" },
    { label: "Garhwali", value: "Garhwali" },
    { label: "Garo", value: "Garo" },
    { label: "Haryanavi", value: "Haryanavi" },
    { label: "Himachali/Pahari", value: "Himachali/Pahari" },
    { label: "Hindko", value: "Hindko" },
    { label: "Kakbarak", value: "Kakbarak" },
    { label: "Kanauji", value: "Kanauji" },
    { label: "Kashmiri", value: "Kashmiri" },
    { label: "Khandesi", value: "Khandesi" },
    { label: "Khasi", value: "Khasi" },
    { label: "Konkani", value: "Konkani" },
    { label: "Koshali", value: "Koshali" },
    { label: "Kumaoni", value: "Kumaoni" },
    { label: "Kutchi", value: "Kutchi" },
    { label: "Ladakhi", value: "Ladakhi" },
    { label: "Lepcha", value: "Lepcha" },
    { label: "Magahi", value: "Magahi" },
    { label: "Maithili", value: "Maithili" },
    { label: "Malay", value: "Malay" },
    { label: "Malayalam", value: "Malayalam" },
    { label: "Manipuri", value: "Manipuri" },
    { label: "Miji", value: "Miji" },
    { label: "Mizo", value: "Mizo" },
    { label: "Monpa", value: "Monpa" },
    { label: "Nepali", value: "Nepali" },
    { label: "Pashto", value: "Pashto" },
    { label: "Persian", value: "Persian" },
    { label: "Rajasthani", value: "Rajasthani" },
    { label: "Russian", value: "Russian" },
    { label: "Sanskrit", value: "Sanskrit" },
    { label: "Santhali", value: "Santhali" },
    { label: "Sindhi", value: "Sindhi" },
    { label: "Sinhala", value: "Sinhala" },
    { label: "Sourashtra", value: "Sourashtra" },
    { label: "Spanish", value: "Spanish" },
    { label: "Swedish", value: "Swedish" },
    { label: "Tagalog", value: "Tagalog" },
    { label: "Tulu", value: "Tulu" },
    { label: "Other", value: "Other" }
  ]
]
const MARITAL_STATUS = [
  { label: 'Never Married', value: 'Never Married' },
  { label: 'Divorced', value: 'Divorced' },
  { label: 'Widowed', value: 'Widowed' },
  { label: 'Awaiting Divorce', value: 'Awaiting Divorce' },
  { label: 'Annulled', value: 'Annulled' },

];
const HEIGHT_DATA = Array.from({ length: 84 }, (_, i) => {
  const cm = 130 + i; // Range: 130cm to 213cm
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);

  // Format: "4ft 5in - 134cm"
  const label = `${feet}ft ${inches}in - ${cm}cm`;

  return {
    label: label,
    value: label // You can also use String(cm) if you prefer saving numbers
  };
});

const WORK_WITH = [
  { label: 'Private Company', value: 'Private Company' },
  { label: 'Goverment / Public Sector', value: 'Goverment / Public Sector' },
  { label: 'Defence / Civil Services', value: 'Defence / Civil Services' },
  { label: 'Business / Self-employed', value: 'Business / Self-employed' },
  { label: 'Not Working', value: 'Not Working' },
  { label: 'Student', value: 'Student' },
  { label: 'Other', value: 'Other' },

];
const SelectionPill = ({ label, isSelected, onSelect }: any) => (
  <Button size='lg'
    variant="outline"
    onPress={onSelect}
    className={`rounded-full px-5 py-2 border-outline-300 ${isSelected ? 'bg-primary-500 border-primary-500' : 'bg-white'}`}
  >
    <ButtonText className={isSelected ? 'text-white' : 'text-typography-700 font-medium'}>
      {label}
    </ButtonText>
  </Button>
);

export default function WizardScreen() {
  // Constants
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { user, logout } = useAuth();
  const { showAlert, hideAlert } = useAlert();
  const { height: screenHeight } = useWindowDimensions();
  const { height } = Dimensions.get('window');
  // Refs Variables
  const lastNameRef = React.useRef<any>(null);
  const dayRef = React.useRef<any>(null);
  const monthRef = React.useRef<any>(null);
  const yearRef = React.useRef<any>(null);
  const phoneRef = React.useRef<any>(null);
  const cityRef = React.useRef<any>(null);
  // State Variables

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
  const [isFocus, setIsFocus] = useState(false);

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
    step: step,
    gender: 'Male',
    profileFor: profileFor,
    casteNoBar: isCasteNoBar,
    hobbies: selectedHobbies,
    sub_community: '',
    alt_phone: '',
    weight: '',
    userid: '',
    worksWith: '',
    worksas: '',
  });


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
  const validateMobileoremail = async () => {
    const payload = { ...formData };
    try {
      const response = await profileService.validateMobileOrEmail(payload).catch((error: any) => {
        if (error.response) {
          // The server responded with a status code outside the 2xx range
          const statusCode = error.response.status;
          if (statusCode === 409) {
            showAlert({
              type: 'error',
              title: 'Profile Info.',
              message: error.response.data.message || "Something went wrong. Please try again.",
              confirmText: "Login",
              onConfirm: async () => {
                setIsUploading(false);
                hideAlert();
                await logout();
              }
            });
          }
        }
      });

      if (response?.success) {
        showAlert({
          type: 'success',
          title: 'Profile Info.',
          message: "Profile validated successfully.",
          confirmText: "OK",
          onConfirm: async () => {
            setIsUploading(false);
            hideAlert();
            setIsFinished(true);
            setStep(prev => prev + 1);
          }
        });
      }
    } catch (error: any) {
      showAlert({
        type: 'error',
        title: 'Profile Info.',
        message: "Could not validate profile. Please try again.",
      });
    } finally {

    }
  }
  const handleParcialSubmit = async () => {
    setIsUploading(true);
    const payload = { ...formData, hobbies: selectedHobbies, profileFor, casteNoBar: isCasteNoBar, step: 8, alt_phone: '', weight: '' };
    try {
      const response = await profileService.createProfile(payload).catch((error: any) => {
        if (error.response) {
          // The server responded with a status code outside the 2xx range
          const statusCode = error.response.status;
          if (statusCode === 401) {
            showAlert({
              type: 'error',
              title: 'Profile Info.',
              message: "Unauthorized. Please log in again.",
            });
          }
          else if (statusCode === 409) {
            showAlert({
              type: 'error',
              title: 'Profile Info.',
              message: error.response.data.message || "Something went wrong. Please try again.",
              confirmText: "Login",
              onConfirm: async () => {
                setIsUploading(false);
                hideAlert();
                await logout();
              }
            });
          }
          else {
            if (!error.response.data.success) {
              showAlert({
                type: 'error',
                title: 'Profile Info.',
                message: error.response.data.message,
              });
            }
            console.log("Error", error.message);
          }
        }
      });

      if (response?.success) {

        setIsFinished(true);
        setStep(prev => prev + 1);
      } else {
        // Alert.alert("Error", response?.message);
      }
    } catch (error: any) {
      showAlert({
        type: 'error',
        title: 'Profile Info.',
        message: "Could not save profile. Please try again.",
      });
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
        updateForm('userid', response.userid)
        setIsFinished(true);
        showAlert({
          type: 'success',
          title: 'Welcome!',
          message: 'Profile saved successfully.',
        });
      } else {
        showAlert({
          type: 'error',
          title: 'Profile Info.',
          message: response.message,
        });

      }
    } catch (error) {
      showAlert({
        type: 'error',
        title: 'Profile Info.',
        message: "Could not save profile. Please try again.",
      });
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
    const day = parseInt(formData.dobDay || '0');
    const month = parseInt(formData.dobMonth || '0');
    const year = formData.dobYear || '0';

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
  const getValidYear = () => {
    const year = parseInt(formData.dobYear);
    const currentYear = new Date().getFullYear();
    const eightyYearsAgo = currentYear - 80;
    return year >= eightyYearsAgo && year <= currentYear;
  }
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

  //use memo
  const dateErrorMessage = useMemo(() => {
    if (!isDateValid()) return "Enter a valid DD (01-31), MM (01-12), and YYYY";
    if (!getValidYear()) return "Enter a valid year";
    if (getAge() < 18) return "Under age! You must be at least 18 years old.";
    return "";
  }, [formData.dobDay, formData.dobMonth, formData.dobYear]); // Recalculate only when date changes
  // 3. Update the Input handle
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    logicToFetch(text);
  };
  const handleNextAction = () => {

    setValidationTriggered(true); // Show red errors if fields are empty

    if (step === 1) {
      if (!profileFor) return;
    }
    else if (step === 2) {
      if (!formData.firstName || !formData.lastName || !!dateErrorMessage) {
        return; // Stop here if invalid or under 18
      }
    }
    else if (step === 3) {
      if (!formData.religion || !formData.livingIn || !formData.community) {
        return;
      }
    }
    else if (step === 4) {
      if (!formData.email || !formData.phone) {
        return;
      }
    }
    else if (step === 5) {
      if (!formData.state || !formData.city) {
        return;
      }
    }
    else if (step === 6) {
      if (!formData.height || !formData.maritalStatus) {
        return;
      }
    }
    else if (step === 7) {
      if (!formData.qualification || !formData.college) {
        return;
      }
    }
    else if (step === 8) {
      if (!formData.income || !formData.worksWith || !formData.companyName) {
        return;
      }
    }
    // If valid, reset trigger and move forward
    setValidationTriggered(false);
    if (step === 4) validateMobileoremail();
    else if (step === 8) handleParcialSubmit();
    else if (step === totalSteps) handleFinalSubmit();
    else setStep(prev => prev + 1);

  }

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
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
            <VStack className="gap-8">
              {/* Section 1: Profile For */}
              <FormControl isInvalid={!profileFor && validationTriggered}>
                <Heading size="xl" className="mb-4">This Profile is for</Heading>
                <HStack className="flex-wrap gap-3 p-2">
                  {['Myself', 'My Son', 'My Daughter', 'My Brother', 'My Sister', 'My Friend'].map((item) => (
                    <SelectionPill
                      key={item}
                      label={item}
                      isSelected={profileFor === item}
                      onSelect={() => {
                        setProfileFor(item);
                        setValidationTriggered(false);

                        // Logic to handle Gender based on selection
                        if (['My Son', 'My Brother'].includes(item)) updateForm('gender', 'Male');
                        else if (['My Daughter', 'My Sister'].includes(item)) updateForm('gender', 'Female');
                        else updateForm('gender', ''); // Reset for 'Myself' or 'My Friend' so they must choose
                      }}
                    />
                  ))}
                </HStack>
              </FormControl>

              {/* Section 2: Gender Selection (Visible only for Myself or My Friend) */}
              {['Myself', 'My Friend'].includes(profileFor) && (
                <VStack className="gap-4 animate-in fade-in duration-500">
                  <Heading size="md" className="text-typography-950 font-semibold">
                    Select Gender
                  </Heading>
                  <HStack className="gap-3 p-2">
                    {['Male', 'Female'].map((g) => (
                      <SelectionPill
                        key={g}
                        label={g}
                        isSelected={formData.gender === g}
                        onSelect={() => updateForm('gender', g)}
                      />
                    ))}
                  </HStack>
                  {validationTriggered && !formData.gender && (
                    <Text className="text-error-600 text-xs px-2">Please select your gender</Text>
                  )}
                </VStack>
              )}
            </VStack>
          )}

          {/* STEP 2: Name & DOB */}
          {step === 2 && (
            <VStack className="gap-6">
              <Heading size="xl">Basic Details</Heading>

              {/* First Name */}
              <FormControl isInvalid={validationTriggered && !formData.firstName}>
                <FormControlLabel className="mb-1">
                  <FormControlLabelText size='lg'>First Name</FormControlLabelText>
                </FormControlLabel>
                <Input className="h-16" size='lg' >
                  <InputField
                    placeholder="First Name"
                    value={formData.firstName}
                    onChangeText={(v) => updateForm('firstName', v)}
                    returnKeyType="next"
                    onSubmitEditing={() => lastNameRef.current?.focus()}
                  />
                </Input>
                <FormControlError><FormControlErrorText>First name is required</FormControlErrorText></FormControlError>
              </FormControl>

              {/* Last Name */}
              <FormControl isInvalid={validationTriggered && !formData.lastName}>
                <FormControlLabel className="mb-1">
                  <FormControlLabelText size='lg'>Last Name</FormControlLabelText>
                </FormControlLabel>
                <Input className="h-16" size='lg' >
                  <InputField
                    ref={lastNameRef}
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChangeText={(v) => updateForm('lastName', v)}
                    returnKeyType="next"
                    onSubmitEditing={() => dayRef.current?.focus()}
                  />
                </Input>
                <FormControlError><FormControlErrorText>Last name is required</FormControlErrorText></FormControlError>
              </FormControl>

              {/* Date of Birth Section */}
              <FormControl isInvalid={validationTriggered && (!!dateErrorMessage)}>
                <FormControlLabel className="mb-1">
                  <FormControlLabelText size='lg'>Date of Birth</FormControlLabelText>
                </FormControlLabel>
                <HStack className="gap-2 mt-2">
                  <Input className="flex-1 h-16" size='lg'>
                    <InputField placeholder="DD" ref={dayRef} keyboardType="numeric" maxLength={2} value={formData.dobDay} onChangeText={(v) => { updateForm('dobDay', v); if (v.length === 2) monthRef.current?.focus(); }} />
                  </Input>
                  <Input className="flex-1 h-16" size='lg'>
                    <InputField placeholder="MM" ref={monthRef} keyboardType="numeric" maxLength={2} value={formData.dobMonth} onChangeText={(v) => { updateForm('dobMonth', v); if (v.length === 2) yearRef.current?.focus(); }} />
                  </Input>
                  <Input className="flex-1 h-16" size='lg'>
                    <InputField placeholder="YYYY" ref={yearRef} keyboardType="numeric" maxLength={4} value={formData.dobYear} onChangeText={(v) => updateForm('dobYear', v)} />
                  </Input>
                </HStack>
                <FormControlError>
                  <FormControlErrorText> {dateErrorMessage} </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </VStack>
          )}

          {/* STEP 3: Religion & Community */}
          {step === 3 && (
            <VStack className="gap-6">
              <Heading size="xl">Religion Details</Heading>
              <Box className=" mt-2 ">
                <FormControl isInvalid={validationTriggered && (!formData.religion)}>
                  <FormControlLabel className="mb-1">
                    <FormControlLabelText size='md' >Select Religion</FormControlLabelText>
                  </FormControlLabel>
                  <Dropdown
                    style={[styles.dropdown]}
                    data={RELIGION_DATA}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Religion"
                    containerStyle={{
                      maxHeight: height * 0.65,
                      borderRadius: 8,
                      backgroundColor: 'white',
                    }}
                    value={formData.religion}
                    onChange={item => {
                      updateForm('religion', item.value);
                    }}
                  />
                  <FormControlError className="mb-1">
                    <FormControlErrorText size='md' >Religion is required</FormControlErrorText>
                  </FormControlError>
                </FormControl>


                {formData.religion && <FormControl isInvalid={validationTriggered && (!formData.community)}>
                  <FormControlLabel className="mb-1">
                    <FormControlLabelText size='md' >Select Community</FormControlLabelText>
                  </FormControlLabel>
                  <Dropdown
                    style={[styles.dropdown]}
                    data={COMMUNITIES}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Community"
                    containerStyle={{
                      maxHeight: height * 0.65,
                      borderRadius: 8,
                      backgroundColor: 'white',
                    }}
                    value={formData.community}
                    onChange={item => {
                      setValidationTriggered(false);
                      updateForm('community', item.value);
                    }}
                  />
                  <FormControlError className="mb-1">
                    <FormControlErrorText size='md' >Community is required</FormControlErrorText>
                  </FormControlError>
                </FormControl>}

                {formData.religion && formData.community && <FormControl isInvalid={validationTriggered && (!formData.livingIn)}>
                  <FormControlLabel className="mb-1">
                    <FormControlLabelText size='md' >Select Living In</FormControlLabelText>
                  </FormControlLabel>
                  <Dropdown
                    style={[styles.dropdown]}
                    data={LIVINGIN}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Living In"
                    containerStyle={{
                      maxHeight: height * 0.65,
                      borderRadius: 8,
                      backgroundColor: 'white',
                    }}
                    value={formData.livingIn}
                    onChange={item => {
                      setValidationTriggered(false);
                      updateForm('livingIn', item.value);
                    }}
                  />
                  <FormControlError className="mb-1">
                    <FormControlErrorText size='md' >Living In is required</FormControlErrorText>
                  </FormControlError>
                </FormControl>}

              </Box>
            </VStack>
          )}

          {/* STEP 4: Contact */}
          {step === 4 && (
            <VStack className="gap-6">
              <Heading size="xl">Contact Info</Heading>

              <Box className="gap-6 mt-2">
                <FormControl isInvalid={validationTriggered && (!formData.email)}>
                  <FormControlLabel className="mb-1">
                    <FormControlLabelText size='lg' >Email Address</FormControlLabelText>
                  </FormControlLabel>
                  <Input className="h-16" size='lg'><InputField placeholder="Email Address" value={formData.email} returnKeyType="next"
                    onSubmitEditing={() => phoneRef.current.focus()} onChangeText={(v) => updateForm('email', v)} /></Input>
                  <AnimateError isVisible={validationTriggered && (!formData.email)}>
                    {"Email is required"}
                  </AnimateError>
                </FormControl>
                <FormControl isInvalid={validationTriggered && (!formData.phone)}>
                  <FormControlLabel className="mb-1">
                    <FormControlLabelText size='lg' >Phone Number</FormControlLabelText>
                  </FormControlLabel>
                  <Input className="h-16" size='lg'><InputField placeholder="Phone Number" ref={phoneRef} keyboardType="phone-pad" value={formData.phone} onChangeText={(v) => updateForm('phone', v)} /></Input>
                  <AnimateError isVisible={validationTriggered && (!formData.phone)}>
                    {"Phone is required"}
                  </AnimateError>
                </FormControl>
              </Box>

            </VStack>
          )}
          {/* STEP 5: Location & Sub-Community */}
          {step === 5 && (
            <VStack className="gap-6 ">
              <Text className="text-center text-typography-500 font-medium">Now let's build your profile</Text>

              {/* STATE DROPDOWN */}
              <FormControl isInvalid={validationTriggered && (!formData.state)}>
                <FormControlLabel className="mb-2">
                  <FormControlLabelText size='2xl' >State</FormControlLabelText>
                </FormControlLabel>

                <Dropdown
                  style={[styles.dropdown, isFocus && { borderColor: 'border-primary-700' }]}
                  data={STATES}
                  labelField="StateName"
                  valueField="StateCode"
                  placeholder="Select State"
                  containerStyle={{
                    maxHeight: height * 0.65, // Use containerStyle for modal container
                    borderRadius: 8,
                    backgroundColor: 'white',
                  }}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  value={formData.state}
                  onChange={item => {
                    console.log('Select State', item);
                    updateForm('state', item.StateCode);
                    updateForm('city', ''); // Reset city on state change
                    fetchCities(item.StateCode);

                  }}
                />

                <AnimateError isVisible={validationTriggered && (!formData.state)}>
                  {"State is required"}
                </AnimateError>

              </FormControl>
              {/* CITY DROPDOWN (Searchable) */}
              {formData.state && <FormControl isInvalid={validationTriggered && (!formData.city)}>
                <FormControlLabel className="mb-1">
                  <FormControlLabelText size='md' >Select City</FormControlLabelText>
                </FormControlLabel>
                <Dropdown
                  style={[styles.dropdown]}
                  data={cities}
                  ref={cityRef}
                  mode={'modal'}
                  labelField="CityName"
                  valueField="CityCode"
                  keyboardAvoiding={true}
                  placeholder={isLoading ? "Loading..." : "Select City"}
                  value={formData.city}
                  containerStyle={{
                    maxHeight: height * 0.65, // Use containerStyle for modal container
                    borderRadius: 8,
                    backgroundColor: 'white',
                  }}
                  onChange={item => {
                    updateForm('city', item.CityCode);
                  }}
                  renderLeftIcon={() => isLoading ? <ActivityIndicator size="small" /> : null}
                />
                <AnimateError isVisible={validationTriggered && (!formData.city)}>
                  {"City is required"}
                </AnimateError>
              </FormControl>}

              <FormControl isInvalid={validationTriggered && (!formData.sub_community)}>
                <FormControlLabel className="mb-2">
                  <FormControlLabelText size='2xl' >Sub Community</FormControlLabelText>
                </FormControlLabel>

                <Dropdown
                  mode='modal'
                  style={[styles.dropdown]}
                  data={SUB_COMMUNITIES}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Sub Community"
                  containerStyle={{
                    maxHeight: height * 0.65, // Use containerStyle for modal container
                    borderRadius: 8,
                    backgroundColor: 'white',
                  }}
                  value={formData.sub_community}
                  onChange={item => {
                    updateForm('sub_community', item.value);
                  }}
                />

                <AnimateError isVisible={validationTriggered && (!formData.sub_community)}>
                  {"Sub Community is required"}
                </AnimateError>

              </FormControl>

              <HStack className="justify-between items-center mt-2">
                <Checkbox
                  size="lg"
                  value="remember"
                  isChecked={isCasteNoBar}
                  onChange={(val) => setIsCasteNoBar(val)}
                >
                  <CheckboxIndicator className="mr-2 ">
                    <CheckboxIcon as={CheckIcon} size='md' />
                  </CheckboxIndicator>
                  <CheckboxLabel className="text-sm text-typography-500">Not particular about his Partner's Community (Caste No Bar)</CheckboxLabel>
                </Checkbox>


              </HStack>
            </VStack>
          )}

          {/* STEP 6: Marital Status & Dynamic Kids */}
          {step === 6 && (
            <VStack className="gap-8">
              <Text className="text-center text-typography-500 font-medium">Family Details</Text>

              <VStack className="gap-6">
                <FormControl isInvalid={validationTriggered && (!formData.height)}>
                  <FormControlLabel className="mb-2">
                    <FormControlLabelText size='2xl' >Height</FormControlLabelText>
                  </FormControlLabel>
                  <Dropdown
                    style={[styles.dropdown]}
                    data={HEIGHT_DATA}
                    labelField="label"
                    valueField="value"
                    mode={'modal'}
                    placeholder="Select Height"
                    containerStyle={{
                      maxHeight: height * 0.65, // Use containerStyle for modal container
                      borderRadius: 8,
                      backgroundColor: 'white',
                    }}
                    value={formData.height}
                    onChange={item => {
                      updateForm('height', item.value);
                    }}
                  />
                  <AnimateError isVisible={validationTriggered && (!formData.height)}>
                    {"Height is required"}
                  </AnimateError>
                </FormControl>

                <FormControl isInvalid={validationTriggered && (!formData.maritalStatus)}>
                  <FormControlLabel className="mb-2">
                    <FormControlLabelText size='2xl' >Marital Status</FormControlLabelText>
                  </FormControlLabel>
                  <Dropdown
                    style={[styles.dropdown]}
                    data={MARITAL_STATUS}
                    labelField="label"
                    valueField="value"
                    placeholder="Select Marital Status"
                    containerStyle={{
                      maxHeight: height * 0.65, // Use containerStyle for modal container
                      borderRadius: 8,
                      backgroundColor: 'white',
                    }}
                    value={formData.state}
                    onChange={item => {
                      updateForm('maritalStatus', item.value);
                      updateForm('hasChildren', 'No');
                      updateForm('childrenCount', '');
                      updateForm('kids', []);
                    }}
                  />
                  <AnimateError isVisible={validationTriggered && (!formData.maritalStatus)}>
                    {"Marital Status is required"}
                  </AnimateError>
                </FormControl>

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
                          <Box key={index} className="p-4 rounded-xl border border-outline-200 bg-background-50 gap-4 mb-4">
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
                  <FormControl isInvalid={validationTriggered && (!formData.qualification)}>
                    <FormControlLabel className="mb-2">
                      <FormControlLabelText size='2xl' className="text-typography-800"> Highest Qualification</FormControlLabelText>
                    </FormControlLabel>
                    <Dropdown
                      style={[styles.dropdown]}
                      data={QUALIFICATIONS}
                      labelField="label"
                      valueField="value"
                      placeholder="Select Highest Qualification"
                      containerStyle={{
                        maxHeight: height * 0.65, // Use containerStyle for modal container
                        borderRadius: 8,
                        backgroundColor: 'white',
                      }}
                      renderItem={(item) => (
                        <View
                          className={`px-4 py-3 ${item.isHeader ? 'bg-slate-100' : 'bg-white'}`}
                        >
                          <Text
                            className={`${item.isHeader
                              ? 'text-xs font-bold text-slate-500 uppercase tracking-wider'
                              : 'text-base text-slate-800 ml-2' // Indent child items slightly
                              }`}
                          >
                            {item.label}
                          </Text>
                        </View>
                      )}
                      value={formData.qualification}
                      onChange={item => {
                        if (item.isHeader) return;
                        updateForm('qualification', item.value);
                      }}
                    />
                    <AnimateError isVisible={validationTriggered && (!formData.qualification)}>
                      {"Qualification is required"}
                    </AnimateError>
                  </FormControl>
                </VStack>

                <VStack className="gap-2">
                  <FormControl isInvalid={validationTriggered && (!formData.college)}>
                    <FormControlLabel className="mb-2">
                      <FormControlLabelText size='2xl' className="text-typography-800">College / University Details</FormControlLabelText>
                    </FormControlLabel>
                    <Input variant="outline" size='lg' className="h-16 rounded-md border-outline-300">
                      <InputField
                        placeholder="College Name"
                        value={formData.college}
                        onChangeText={(v) => updateForm('college', v)}
                      />
                    </Input>
                    <AnimateError isVisible={validationTriggered && (!formData.college)}>
                      {"College is required"}
                    </AnimateError>
                  </FormControl>
                </VStack>


              </VStack>
            </VStack>
          )}
          {/* STEP 8: Work & Income */}
          {step === 8 && (
            <VStack className="gap-6">
              <Heading size="xl">Income & Work</Heading>
              <FormControl isInvalid={validationTriggered && (!formData.income)}>
                <FormControlLabel className="mb-1">
                  <FormControlLabelText size='lg' className="text-typography-800">Select Income</FormControlLabelText>
                </FormControlLabel>
                <Dropdown
                  style={[styles.dropdown]}
                  data={INCOME_RANGES}
                  labelField="label"
                  valueField="value"
                  placeholder="Annual Income"
                  containerStyle={{
                    maxHeight: height * 0.65, // Use containerStyle for modal container
                    borderRadius: 8,
                    backgroundColor: 'white',
                  }}
                  value={formData.income}
                  onChange={item => {
                    updateForm('income', item.value);
                  }}
                />
                <AnimateError isVisible={validationTriggered && (!formData.income)}>
                  {"Income is required"}
                </AnimateError>
              </FormControl>

              <VStack className="gap-2">
                <FormControl isInvalid={validationTriggered && (!formData.worksWith)}>
                  <FormControlLabel className="mb-1">
                    <FormControlLabelText size='lg' className="text-typography-800">Work Details</FormControlLabelText>
                  </FormControlLabel>
                  <Dropdown
                    style={[styles.dropdown]}
                    data={WORK_WITH}
                    labelField="label"
                    valueField="value"
                    placeholder="Works with"
                    containerStyle={{
                      maxHeight: height * 0.65, // Use containerStyle for modal container
                      borderRadius: 8,
                      backgroundColor: 'white',
                    }}
                    value={formData.worksWith}
                    onChange={item => {
                      updateForm('worksWith', item.value);
                    }}
                  />
                  <AnimateError isVisible={validationTriggered && (!formData.worksWith)}>
                    {"Work with is required"}
                  </AnimateError>
                </FormControl>
              </VStack>
              <VStack className="gap-2">
                <FormControl isInvalid={validationTriggered && (!formData.worksas)}>
                  <FormControlLabel className="mb-1">
                    <FormControlLabelText size='lg' className="text-typography-800">Works As</FormControlLabelText>
                  </FormControlLabel>

                  <Input variant="outline" size='lg' className="h-16 rounded-md border-outline-300">
                    <InputField
                      placeholder="e.g. Software Engineer / Teacher"
                      value={formData.worksas}
                      onChangeText={(v) => updateForm('worksas', v)}
                    />
                  </Input>
                  <AnimateError isVisible={validationTriggered && (!formData.worksas)}>
                    {"Work as is required"}
                  </AnimateError>
                </FormControl>
              </VStack>
              <VStack className="gap-2">
                <FormControl isInvalid={validationTriggered && (!formData.companyName)}>
                  <FormControlLabel className="mb-1">
                    <FormControlLabelText size='lg' className="text-typography-800">Current company name</FormControlLabelText>
                  </FormControlLabel>
                  <Input variant="outline" size='lg' className="h-16 rounded-md border-outline-300">
                    <InputField
                      placeholder="Name of the company"
                      value={formData.companyName}
                      onChangeText={(v) => updateForm('companyName', v)}
                    />
                  </Input>
                  <AnimateError isVisible={validationTriggered && (!formData.companyName)}>
                    {"Company name is required"}
                  </AnimateError>
                </FormControl>
              </VStack>

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
            className="bg-primary-600 rounded-full h-14"
            onPress={handleNextAction}
            isDisabled={isUploading}
          >
            {isUploading ? <Spinner color="$white" /> : <ButtonText className="text-white">{step === totalSteps ? 'Finish' : (step === 4 || step === 8) ? 'Submit' : 'Continue'}</ButtonText>}
          </Button>
        </Box>
      </Box>
    </KeyboardAvoidingView >
  );
}

const styles = StyleSheet.create({
  container: {},
  dropdown: {
    height: 60,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    // marginBottom: 20,
    overflow: 'hidden'
  },
});
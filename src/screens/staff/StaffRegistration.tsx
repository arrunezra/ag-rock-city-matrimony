import React, { useState, useRef, useMemo, useCallback, useContext, useEffect } from 'react';
import { View, TouchableOpacity, Platform, Pressable, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import {
    VStack, HStack, Text, Input, InputField, InputSlot,
    Box, Button, ButtonText,
    Heading,
    FormControl,
    ButtonIcon,
    FormControlLabelText,
    FormControlLabel
} from '@/src/components/common/GluestackUI';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker'; // Used as the engine
import { Calendar, ChevronRight, Check, Hash, Briefcase, Building2, Phone, Mail, MapPin, Save, Navigation } from '@/src/components/common/IconUI';
import { Icon } from '@/components/ui/icon';
import { AnimateError } from '../common/AnimateError';
import api from '@/src/api/api';
import profileService from '@/src/services/profileService';
import { Dropdown } from 'react-native-element-dropdown';
import { STATES } from '@/src/utils/utils';
import { KeyboardAvoidingView, KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { ArrowRight, Home, User, UserCheck } from 'lucide-react-native';
import { LookupContext } from '@/src/context/LookupContext';
import ChruchService from '@/src/services/ChruchService';
import _ from 'lodash';
import StaffService from '@/src/services/StaffService';
import { SuccessOverlay } from '../common/SuccessOverlay';
import { StatusAlert } from '../common/StatusAlert';
import FailedScreen from '../common/FailedScreen';

const StaffRegistration = () => {
    const { lookups } = useContext(LookupContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        staffId: '',
        department: '',
        designation: '',
        church_id: '',
        mobileNo: '',
        email: '',
        address: '',
        role: '',
        joiningDate: new Date(),
        joiningDateLabel: '',
        altMobileNo: '',
        state: null,
        city: null,
        selected_pastor: '',
        selected_address: '',
    });
    const [errors, setErrors] = useState<any>({});
    // State to prevent Android auto-reopen loop
    const [showAndroidPicker, setShowAndroidPicker] = useState(false);
    const [filteredCities, setFilteredCities] = useState([]);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['45%'], []);
    // const handleConfirm = (date: Date) => {
    //     //const formattedDate = date.toISOString().split('T')[0]; // Result: 2026-02-05
    //     setFormData({ ...formData, joiningDate: date }); 
    //   };
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isStateFocus, setIsStateFocus] = useState(false);
    const [isCityFocus, setIsCityFocus] = useState(false);
    const [isChurchFocus, setIsChurchFocus] = useState(false);
    const [isRoleFocus, setIsRoleFocus] = useState(false);
    const [isDesignationFocus, setIsDesignationFocus] = useState(false);
    const [churchBranches, setChurchBranches] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [showFailed, setShowFailed] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    useEffect(() => {
        getCurchBranches();
    }, [formData.city]);

    const getCurchBranches = async () => {
        const branches = await ChruchService.getCurchBranches(formData.city ?? "")
        if (branches.success) {
            setChurchBranches(branches.data);
        } else {
            setChurchBranches([]);
        }
    };

    // 2. Helper function to update form state
    const updateForm = (key: string, value: any) => {
        // 1. Update the form data as usual
        setFormData(prev => ({ ...prev, [key]: value }));

        // 2. Clear the error for this specific field if it exists
        if (errors[key]) {
            setErrors((prevErrors: any) => {
                const newErrors = { ...prevErrors };
                delete newErrors[key]; // Remove the specific error
                return newErrors;
            });
        }
    };

    // 3. Fetch cities based on State Code
    const fetchCities = async (stateCode: string) => {
        setIsLoading(true);
        try {
            // Replace this with your actual API call
            const response = await profileService.getCities(stateCode)
            setCities(response.data);

        } catch (error) {
            console.error("Error loading cities", error);
        } finally {
            setIsLoading(false);
        }
    };
    const validate = () => {
        let newErrors: any = {};

        // Official Identity
        if (!formData.staffId) newErrors.staffId = "Staff ID required";
        if (!formData.firstName) newErrors.firstName = "First name required";
        if (!formData.lastName) newErrors.lastName = "Last name required";

        // Work Details
        if (!formData.department) newErrors.department = "Department required";
        if (!formData.joiningDateLabel) newErrors.joiningDate = "Joining date required";

        // Communication
        if (!formData.mobileNo) {
            newErrors.mobileNo = "Mobile number required";
        } else if (!formData.mobileNo.match(/^[0-9]{10}$/)) {
            newErrors.mobileNo = "Must be a 10-digit number";
        }

        if (!formData.altMobileNo) {
            newErrors.altMobileNo = "Alternative number required";
        } else if (!formData.altMobileNo.match(/^[0-9]{10}$/)) {
            newErrors.altMobileNo = "Must be a 10-digit number";
        }

        if (!formData.email) {
            newErrors.email = "Email required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        // Location
        if (!formData.state) newErrors.state = "State selection required";
        if (!formData.city) newErrors.city = "City selection required";
        if (!formData.address || formData.address.trim().length < 5) {
            newErrors.address = "Full address required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const openDatePicker = () => {
        if (Platform.OS === 'android') {
            setShowAndroidPicker(true);
        } else {
            bottomSheetRef.current?.expand();
        }
    };

    const closeDatePicker = () => bottomSheetRef.current?.close();

    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
        []
    );

    const onDateChange = (event: any, selectedDate?: Date) => {
        // 1. Android logic: Hide picker immediately after selection
        if (Platform.OS === 'android') {
            setShowAndroidPicker(false);
        }

        if (selectedDate) {
            if (Platform.OS === 'android') {
                // 2. Android: Update label immediately since there's no "Confirm" button on a sheet
                const formatted = selectedDate.toISOString().split('T')[0];
                setFormData(prev => ({ ...prev, joiningDate: selectedDate, joiningDateLabel: formatted }));
            } else {
                // 3. iOS: Just update the date object, let user press "Set Date" button
                setFormData(prev => ({ ...prev, joiningDate: selectedDate }));
            }
        }
    };

    const handleIOSDateConfirm = () => {
        const formatted = formData.joiningDate.toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, joiningDateLabel: formatted }));
        closeDatePicker();
    };
    const handleDateConfirm = () => {
        const formatted = formData.joiningDate.toISOString().split('T')[0];
        setFormData(prev => ({ ...prev, joiningDateLabel: formatted }));
        closeDatePicker();
    };
    const [currentStep, setCurrentStep] = useState(1);
    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    const handleNext = () => {
        let newErrors: any = {};

        // Validate only Step 1 fields

        if (!formData.firstName) newErrors.firstName = "First name required";
        if (!formData.lastName) newErrors.lastName = "Last name required";
        if (!formData.mobileNo) newErrors.mobileNo = "Mobile number required";
        if (!formData.mobileNo) {
            newErrors.mobileNo = "Mobile number required";
        } else if (!formData.mobileNo.match(/^[0-9]{10}$/)) {
            newErrors.mobileNo = "Must be a 10-digit number";
        }

        if (!formData.email) newErrors.email = "Email required";
        else if (!validateEmail(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.address) newErrors.address = "Address required";
        else if (!formData.address || formData.address.trim().length < 5) {
            newErrors.address = "Full address required";
        }
        if (!formData.state) newErrors.state = "State required";
        if (!formData.city) newErrors.city = "City required";

        if (!formData.mobileNo.match(/^[0-9]{10}$/)) {
            newErrors.mobileNo = "Must be a 10-digit number";
        }
        setErrors(newErrors);

        // If no errors for Step 1, move to Step 2
        if (Object.keys(newErrors).length === 0) {
            setCurrentStep(2);
        }
    };

    const prevStep = () => {
        setErrors({});
        setCurrentStep(1);
    }
    const handleFinalSubmit = () => {
        let newErrors: any = {};

        if (!formData.designation) newErrors.designation = "Designation required";
        if (!formData.joiningDateLabel) newErrors.joiningDate = "Joining date required";
        if (!formData.role) newErrors.role = "Role required";
        if (!formData.church_id) newErrors.church_id = "Church Assign required";

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            handleSave(); // Your actual API call
        }
    };
    const handleSave = async () => {
        try {
            const data = {
                action: 'add',
                ...formData,
            }
            console.log(data);
            const response = await StaffService.addUpdateStaff(data);
            console.log(response);
            if (response?.success) {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);

                }, 5000);
            } else {
                if (!response?.success) {
                    setShowError(true);
                    setErrorMessage(response.message || "Failed to add staff member");
                } else {
                    setShowFailed(true);
                    setErrorMessage("Failed to add staff member");

                }
            }
        } catch (error) {
            console.error("Error adding staff:", error);
            Alert.alert("Error", "An error occurred while adding staff member");
        }
    };



    return (
        <View className="flex-1 bg-slate-50">
            {/* 1. Use padding behavior for both, but use a more precise offset */}
            <KeyboardAwareScrollView bottomOffset={0} className="flex-1" showsVerticalScrollIndicator={false}>


                <VStack className="p-6 gap-6">

                    {/* --- Header & Progress --- */}
                    <VStack space="xs">
                        <HStack className="justify-between items-center">
                            <Heading size="2xl" className="text-slate-900">Staff Registration</Heading>
                            <Text className="text-cyan-600 font-bold">Step {currentStep} of 2</Text>
                        </HStack>
                        <Text size="sm" className="text-slate-500">
                            {currentStep === 1 ? "Enter official credentials." : "Enter contact and location details."}
                        </Text>
                        <HStack className="h-1.5 w-full bg-slate-200 rounded-full mt-2 overflow-hidden">
                            <VStack className={`h-full bg-cyan-500 ${currentStep === 1 ? 'w-1/2' : 'w-full'}`} />
                        </HStack>
                    </VStack>

                    <VStack className="gap-8">
                        {currentStep === 1 ? (
                            <VStack className="gap-8 animate-in fade-in duration-500">
                                {/* --- Section 1: Official Identity --- */}
                                <VStack className="gap-4">
                                    <HStack className="items-center border-b border-slate-200 pb-2" space="sm">
                                        <Icon as={Hash} size="sm" className="text-cyan-600" />
                                        <Text className="font-bold text-slate-700 uppercase tracking-wider text-xs">Official Identity</Text>
                                    </HStack>

                                    <HStack space="md">
                                        <FormControl className="flex-1" isInvalid={!!errors.firstName}>
                                            <Input className="h-14 rounded-2xl bg-white border-slate-200 shadow-sm shadow-slate-100">
                                                <InputField
                                                    className="pl-4"
                                                    placeholder="First Name"
                                                    value={formData.firstName}
                                                    onChangeText={(v) => updateForm('firstName', v)}
                                                />
                                            </Input>
                                            <AnimateError isVisible={errors.firstName}>{errors.firstName}</AnimateError>
                                        </FormControl>


                                    </HStack>
                                    <HStack space="md">

                                        <FormControl className="flex-1" isInvalid={!!errors.lastName}>
                                            <Input className="h-14 rounded-2xl bg-white border-slate-200 shadow-sm shadow-slate-100">
                                                <InputField
                                                    className="pl-4"
                                                    placeholder="Last Name"
                                                    value={formData.lastName}
                                                    onChangeText={(v) => updateForm('lastName', v)}
                                                />
                                            </Input>
                                            <AnimateError isVisible={errors.lastName}>{errors.lastName}</AnimateError>
                                        </FormControl>
                                    </HStack>
                                </VStack>
                                {/* --- Section 3: Communication & Location --- */}
                                <VStack space="md" className="gap-4">
                                    <HStack className="items-center border-b border-slate-200 pb-2" space="sm">
                                        <Icon as={Phone} size="sm" className="text-cyan-600" />
                                        <Text className="font-bold text-slate-700 uppercase tracking-wider text-xs">Communication & Location</Text>
                                    </HStack>

                                    <FormControl isInvalid={!!errors.mobileNo}>
                                        <Input className="h-14 rounded-2xl bg-white border-slate-200 shadow-sm shadow-slate-100">
                                            <InputSlot className="pl-4"><Icon as={Phone} size="sm" className="text-slate-400" /></InputSlot>
                                            <InputField
                                                maxLength={10}
                                                placeholder="Mobile Number"
                                                keyboardType="phone-pad"
                                                value={formData.mobileNo}
                                                onChangeText={(v) => updateForm('mobileNo', v)}
                                            />
                                        </Input>
                                        <AnimateError isVisible={errors.mobileNo}>{errors.mobileNo}</AnimateError>
                                    </FormControl>

                                    <FormControl isInvalid={!!errors.altMobileNo}>
                                        <Input className="h-14 rounded-2xl bg-white border-slate-200 shadow-sm shadow-slate-100">
                                            <InputSlot className="pl-4"><Icon as={Phone} size="sm" className="text-slate-400" /></InputSlot>
                                            <InputField
                                                maxLength={10}
                                                placeholder="Alternative Mobile Number"
                                                keyboardType="phone-pad"
                                                value={formData.altMobileNo}
                                                onChangeText={(v) => updateForm('altMobileNo', v)}
                                            />
                                        </Input>
                                        <AnimateError isVisible={errors.altMobileNo}>{errors.altMobileNo}</AnimateError>
                                    </FormControl>

                                    <FormControl isInvalid={!!errors.email}>
                                        <Input className="h-14 rounded-2xl bg-white border-slate-200 shadow-sm shadow-slate-100">
                                            <InputSlot className="pl-4"><Icon as={Phone} size="sm" className="text-slate-400" /></InputSlot>
                                            <InputField
                                                placeholder="Email"
                                                keyboardType="email-address"
                                                value={formData.email}
                                                onChangeText={(v) => updateForm('email', v)}
                                            />
                                        </Input>
                                        <AnimateError isVisible={errors.email}>{errors.email}</AnimateError>
                                    </FormControl>

                                    <FormControl isInvalid={!!errors.address}>
                                        <Input className="h-28 rounded-2xl bg-white border-slate-200 shadow-sm shadow-slate-100 items-start py-1">
                                            <InputSlot className="pl-4 pt-4"><Icon as={MapPin} size="sm" className="text-slate-400" /></InputSlot>
                                            <InputField
                                                multiline={true}
                                                numberOfLines={4}
                                                placeholder="Complete Residential Address"
                                                value={formData.address}
                                                onChangeText={(v) => updateForm('address', v)}
                                                className="text-sm flex-1 pt-3"
                                                textAlignVertical="top"
                                            />
                                        </Input>
                                        <AnimateError isVisible={errors.address}>{errors.address}</AnimateError>
                                    </FormControl>

                                    <FormControl isInvalid={!!errors.state}>
                                        <Dropdown
                                            style={[styles.dropdown, { height: 56, borderRadius: 16, backgroundColor: 'white' }, isStateFocus && { borderColor: '#0891b2' }, errors.state && { borderColor: '#EF4444' }]}
                                            data={STATES || []}
                                            labelField="StateName"
                                            valueField="StateCode"
                                            placeholder="Select State"
                                            value={formData.state}
                                            onFocus={() => setIsStateFocus(true)}
                                            onBlur={() => setIsStateFocus(false)}
                                            onChange={item => {
                                                updateForm('state', item.StateCode);
                                                updateForm('city', '');
                                                fetchCities(item.StateCode);
                                            }}
                                            renderLeftIcon={() => <Icon as={MapPin} size="sm" className="mr-2 text-cyan-600" />}
                                        />
                                        <AnimateError isVisible={errors.state}>{errors.state}</AnimateError>
                                    </FormControl>

                                    {formData.state && (
                                        <FormControl isInvalid={!!errors.city}>
                                            <Dropdown
                                                style={[styles.dropdown, { height: 56, borderRadius: 16, backgroundColor: 'white' }, isCityFocus && { borderColor: '#0891b2' }, errors.city && { borderColor: '#EF4444' }]}
                                                data={cities || []}
                                                labelField="CityName"
                                                valueField="CityCode"
                                                mode='modal'
                                                onFocus={() => setIsCityFocus(true)}
                                                onBlur={() => setIsCityFocus(false)}
                                                placeholder={isLoading ? "Loading cities..." : "Select City"}
                                                value={formData.city}
                                                onChange={item => {
                                                    updateForm('city', item.CityCode)

                                                }

                                                }
                                                renderLeftIcon={() => isLoading ?
                                                    <ActivityIndicator size="small" color="#0891b2" className="mr-2" /> :
                                                    <Icon as={Navigation} size="sm" className="mr-2 text-cyan-600" />
                                                }
                                            />
                                            <AnimateError isVisible={errors.city}>{errors.city}</AnimateError>
                                        </FormControl>
                                    )}
                                </VStack>
                            </VStack>
                        ) : (
                            <VStack className="gap-8 animate-in fade-in duration-500">

                                <VStack className="gap-4">
                                    <HStack className="items-center border-b border-slate-200 pb-2" space="sm">
                                        <Icon as={Briefcase} size="sm" className="text-cyan-600" />
                                        <Text className="font-bold text-slate-700 uppercase tracking-wider text-xs">Work Details</Text>
                                    </HStack>

                                    <FormControl isInvalid={!!errors.joiningDate}>
                                        <Pressable onPress={openDatePicker}>
                                            <HStack className={`h-14 px-4 items-center justify-between bg-white rounded-2xl border shadow-sm shadow-slate-100 ${errors.joiningDate ? 'border-red-500' : 'border-slate-200'}`}>
                                                <HStack space="md" className="items-center">
                                                    <Icon as={Calendar} size="sm" className={formData.joiningDateLabel ? "text-cyan-600" : "text-slate-400"} />
                                                    <Text className={formData.joiningDateLabel ? "text-slate-900 font-medium" : "text-slate-400"}>
                                                        {formData.joiningDateLabel || "Select Joining Date"}
                                                    </Text>
                                                </HStack>
                                                <Icon as={ChevronRight} size="xs" className="text-slate-300" />
                                            </HStack>
                                        </Pressable>
                                        <AnimateError isVisible={errors.joiningDate}>{errors.joiningDate}</AnimateError>
                                    </FormControl>

                                    <FormControl isInvalid={!!errors.role}>
                                        <FormControlLabel>
                                            <FormControlLabelText className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">
                                                Ministry Role
                                            </FormControlLabelText>
                                        </FormControlLabel>
                                        <Dropdown
                                            style={[
                                                styles.dropdown,
                                                isRoleFocus && { borderColor: '#0891b2' }
                                            ]}
                                            data={_.filter(lookups.role, (item: any) => item.value !== 'member') || []}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Ministry Role"
                                            value={formData.role || ''}
                                            onFocus={() => setIsRoleFocus(true)}
                                            onBlur={() => setIsRoleFocus(false)}
                                            onChange={item => updateForm('role', item.value)}
                                            renderLeftIcon={() => (
                                                <Icon as={UserCheck} size="sm" className="mr-2 text-cyan-600" />
                                            )}
                                        />
                                        <AnimateError isVisible={errors.role}>{errors.role}</AnimateError>
                                    </FormControl>
                                    <FormControl isInvalid={!!errors.designation}>
                                        <FormControlLabel>
                                            <FormControlLabelText className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">
                                                Ministry Designation
                                            </FormControlLabelText>
                                        </FormControlLabel>
                                        <Dropdown
                                            style={[
                                                styles.dropdown,
                                                isDesignationFocus && { borderColor: '#0891b2' }
                                            ]}
                                            data={lookups.designation || []}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Ministry Designation"
                                            value={formData.designation}
                                            onFocus={() => setIsDesignationFocus(true)}
                                            onBlur={() => setIsDesignationFocus(false)}
                                            onChange={item => updateForm('designation', item.value)}
                                            renderLeftIcon={() => (
                                                <Icon as={UserCheck} size="sm" className="mr-2 text-cyan-600" />
                                            )}
                                        />
                                        <AnimateError isVisible={errors.designation}>{errors.designation}</AnimateError>
                                    </FormControl>



                                    <FormControl isInvalid={!!errors.church_id}>
                                        <FormControlLabel>
                                            <FormControlLabelText className="text-slate-600 text-xs uppercase font-bold">
                                                Assigned Church / Branch
                                            </FormControlLabelText>
                                        </FormControlLabel>

                                        <Dropdown
                                            style={[
                                                styles.dropdown,
                                                isChurchFocus && { borderColor: '#0891b2' }
                                            ]}
                                            data={churchBranches || []}
                                            labelField="church_name"
                                            valueField="church_id"
                                            placeholder="Assigned Church"
                                            value={formData?.church_id}
                                            onFocus={() => setIsChurchFocus(true)}
                                            onBlur={() => setIsChurchFocus(false)}
                                            onChange={item => {
                                                updateForm('church_id', item.church_id);
                                                updateForm('selected_pastor', item.pastor_name);
                                                updateForm('selected_address', item.address);
                                            }}
                                            renderLeftIcon={() => (
                                                <Icon as={Home} size="sm" className="mr-2 text-cyan-600" />
                                            )}
                                        />
                                        <AnimateError isVisible={errors.church_id}>{errors.church_id}</AnimateError>
                                    </FormControl>

                                    {formData?.church_id ? (
                                        <VStack space="md" className="mt-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <HStack space="sm" className="items-start">
                                                <Icon as={User} size="xs" className="text-slate-400 mt-1" />
                                                <VStack>
                                                    <Text className="text-[10px] uppercase font-bold text-slate-400">Head Pastor</Text>
                                                    <Text className="text-sm text-slate-700 font-semibold">
                                                        {formData.selected_pastor || "N/A "}
                                                    </Text>
                                                </VStack>
                                            </HStack>

                                            <HStack space="sm" className="items-start">
                                                <Icon as={MapPin} size="xs" className="text-slate-400 mt-1" />
                                                <VStack>
                                                    <Text className="text-[10px] uppercase font-bold text-slate-400">Branch Address</Text>
                                                    <Text className="text-sm text-slate-600 italic">
                                                        {formData.selected_address || "No address provided"}
                                                    </Text>
                                                </VStack>
                                            </HStack>
                                        </VStack>
                                    ) : null}

                                </VStack>

                            </VStack>
                        )}
                    </VStack>

                    <HStack space="md" className="pt-4 justify-end">
                        {currentStep === 2 && (
                            <Button
                                variant="outline"
                                action="secondary"
                                onPress={prevStep}
                                className="flex-1 h-14 rounded-2xl border-slate-200"
                            >
                                <ButtonText className="text-slate-600">Back</ButtonText>
                            </Button>
                        )}

                        <Button
                            onPress={currentStep === 1 ? handleNext : handleFinalSubmit}
                            className={`${currentStep === 1 ? 'w-1/2' : 'flex-1'} h-14 rounded-2xl bg-cyan-600`}
                        >
                            <ButtonText>{currentStep === 1 ? "Next Step" : "Submit"}</ButtonText>
                            <ButtonIcon as={ArrowRight} className="ml-2" />
                        </Button>
                    </HStack>


                </VStack>

            </KeyboardAwareScrollView>

            {/* ANDROID NATIVE PICKER (Only shows when triggered) */}
            {showAndroidPicker && (
                <DateTimePicker
                    value={formData.joiningDate}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={onDateChange}
                />
            )}

            {/* iOS BOTTOM SHEET PICKER */}
            {Platform.OS === 'ios' && (
                <BottomSheet
                    ref={bottomSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose
                    backdropComponent={renderBackdrop}
                    handleIndicatorStyle={{ backgroundColor: '#cbd5e1', width: 40 }}
                >
                    <VStack className="flex-1 p-6">
                        <Text className="text-xl font-bold text-slate-800 mb-6">Pick Date</Text>
                        <Box className="bg-slate-50 rounded-3xl py-2 mb-6">
                            <DateTimePicker
                                value={formData.joiningDate}
                                mode="date"
                                display="spinner"
                                maximumDate={new Date()}
                                onChange={onDateChange}
                                style={{ height: 180 }}
                            />
                        </Box>
                        <Button onPress={handleIOSDateConfirm} className="h-14 rounded-2xl bg-cyan-600">
                            <ButtonText className="font-bold">Set Date</ButtonText>
                        </Button>
                    </VStack>
                </BottomSheet>
            )}

            <StatusAlert
                isOpen={showError}
                onClose={() => setShowError(false)}
                type="error"
                title="Error"
                message={errorMessage || "Failed to add staff member"}
            />
            <FailedScreen
                isVisible={showFailed}
                description="Failed to add staff member"
                onClose={() => { setShowFailed(false) }}
            />
            <SuccessOverlay
                isVisible={showSuccess}
                message="Staff member added successfully!"
            />
        </View>
    );
};

export default StaffRegistration;

const styles = StyleSheet.create({
    dropdown: {
        height: 56,
        backgroundColor: 'white',
        borderRadius: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0', // slate-200
        shadowColor: '#f1f5f9',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 2,
    },
    placeholder: {
        fontSize: 12,
        color: '#94a3b8', // slate-400
    },
    selectedText: {
        fontSize: 14,
        color: '#0f172a', // slate-900
    },
});
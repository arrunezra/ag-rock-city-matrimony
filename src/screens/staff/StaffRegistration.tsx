import React, { useState, useRef, useMemo, useCallback } from 'react';
import { View, TouchableOpacity, Platform, Pressable, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import {
    VStack, HStack, Text, Input, InputField, InputSlot,
    Box, Button, ButtonText,
    Heading,
    FormControl
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
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

const StaffRegistration = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        staffId: '',
        department: '',
        designation: '',
        mobileNo: '',
        email: '',
        address: '',
        joiningDate: new Date(),
        joiningDateLabel: '',
        altMobileNo: '',
        state: null,
        city: null,
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
    const [isFocus, setIsFocus] = useState(false);

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

    const handleSave = () => {
        // 1. Call the validate function
        const isFormValid = validate();

        // 2. Check the result
        if (isFormValid) {
            // Success: Proceed with submission
            console.log("Submit Data:", formData);
            // alert("Registration Successful!");
            // Your API call logic here
        } else {
            // Failure: The validate function has already updated the 'errors' state
            console.log("Validation Failed", errors);
            // Optional: Show a toast message or alert
        }
    };


    return (
        <View className="flex-1 bg-slate-50">
            {/* 1. Use padding behavior for both, but use a more precise offset */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
                // If you have a header, set this to the header height (usually 60-90)
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    // Let the ScrollView handle the inset logic on Android
                    automaticallyAdjustKeyboardInsets={true}
                    // Ensure the content can be scrolled past the bottom button
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                >
                    <VStack className="p-6 gap-8 pb-8">
                        <VStack space="xs">
                            <Heading size="2xl" className="text-slate-900">Staff Registration</Heading>
                            <Text size="sm" className="text-slate-500">Enter official credentials.</Text>
                        </VStack>

                        <VStack className="gap-6">
                            {/* --- Section 1: Official Identity --- */}
                            <VStack className="gap-4">
                                <HStack className="items-center space-x-2 border-b border-slate-200 pb-2">
                                    <Icon as={Hash} size="sm" className="text-cyan-600" />
                                    <Text className="font-bold text-slate-700 uppercase tracking-wider text-xs">Official Identity</Text>
                                </HStack>

                                <HStack space="md">
                                    {/* FIRST NAME */}
                                    <FormControl className="flex-1" isInvalid={!!errors.firstName}>
                                        <Input className="h-14 rounded-2xl bg-white border-slate-200 shadow-sm shadow-slate-100">
                                            <InputField
                                                placeholder="First Name"
                                                value={formData.firstName}
                                                onChangeText={(v) => updateForm('firstName', v)}
                                            />
                                        </Input>
                                        <AnimateError isVisible={errors.firstName}>
                                            {errors.firstName}
                                        </AnimateError>
                                    </FormControl>

                                    {/* LAST NAME */}
                                    <FormControl className="flex-1" isInvalid={!!errors.lastName}>
                                        <Input className="h-14 rounded-2xl bg-white border-slate-200 shadow-sm shadow-slate-100">
                                            <InputField
                                                placeholder="Last Name"
                                                value={formData.lastName}
                                                onChangeText={(v) => updateForm('lastName', v)}
                                            />
                                        </Input>
                                        <AnimateError isVisible={errors.lastName}>
                                            {errors.lastName}
                                        </AnimateError>
                                    </FormControl>
                                </HStack>
                            </VStack>

                            {/* --- Section 2: Role & Department --- */}
                            <VStack className="gap-4">
                                <HStack className="items-center space-x-2 border-b border-slate-200 pb-2">
                                    <Icon as={Briefcase} size="sm" className="text-cyan-600" />
                                    <Text className="font-bold text-slate-700 uppercase tracking-wider text-xs">Work Details</Text>
                                </HStack>

                                {/* DEPARTMENT */}
                                <FormControl isInvalid={!!errors.department}>
                                    <Input className="h-14 rounded-2xl bg-white border-slate-200 shadow-sm shadow-slate-100">
                                        <InputSlot className="pl-4"><Icon as={Building2} size="sm" className="text-slate-400" /></InputSlot>
                                        <InputField
                                            placeholder="Department"
                                            value={formData.department}
                                            onChangeText={(v) => updateForm('department', v)}
                                        />
                                    </Input>
                                    <AnimateError isVisible={errors.department}>
                                        {errors.department}
                                    </AnimateError>
                                </FormControl>

                                {/* JOINING DATE */}
                                <FormControl isInvalid={!!errors.joiningDate}>
                                    <Pressable onPress={openDatePicker}>
                                        <HStack
                                            className={`h-14 px-4 items-center justify-between bg-white rounded-2xl border shadow-sm shadow-slate-100 ${errors.joiningDate ? 'border-red-500' : 'border-slate-200'}`}
                                        >
                                            <HStack space="md" className="items-center">
                                                <Icon as={Calendar} size="sm" className={formData.joiningDateLabel ? "text-cyan-600" : "text-slate-400"} />
                                                <Text className={formData.joiningDateLabel ? "text-slate-900 font-medium" : "text-slate-400"}>
                                                    {formData.joiningDateLabel || "Select Joining Date"}
                                                </Text>
                                            </HStack>
                                            <Icon as={ChevronRight} size="xs" className="text-slate-300" />
                                        </HStack>
                                    </Pressable>
                                    <AnimateError isVisible={errors.joiningDate}>
                                        {errors.joiningDate}
                                    </AnimateError>
                                </FormControl>
                            </VStack>

                            {/* --- Section 3: Communication & Location --- */}
                            <VStack className="gap-4">
                                {/* HEADER */}
                                <HStack className="items-center space-x-2 border-b border-slate-200 pb-2">
                                    <Icon as={Phone} size="sm" className="text-cyan-600" />
                                    <Text className="font-bold text-slate-700 uppercase tracking-wider text-xs">
                                        Communication & Location
                                    </Text>
                                </HStack>

                                {/* MOBILE NUMBER */}
                                <FormControl isInvalid={!!errors.mobileNo}>
                                    <Input className="h-14 rounded-2xl bg-white border-slate-200 shadow-sm shadow-slate-100">
                                        <InputSlot className="pl-4">
                                            <Icon as={Phone} size="sm" className="text-slate-400" />
                                        </InputSlot>
                                        <InputField
                                            placeholder="Mobile Number"
                                            keyboardType="phone-pad"
                                            value={formData.mobileNo}
                                            onChangeText={(v) => updateForm('mobileNo', v)}
                                        />
                                    </Input>
                                    {errors.mobileNo && (
                                        <Text className="text-xs text-red-500 pl-2 mt-1">
                                            {errors.mobileNo}
                                        </Text>
                                    )}
                                </FormControl>

                                {/* ALT MOBILE */}
                                <FormControl isInvalid={!!errors.altMobileNo}>
                                    <Input className="h-14 rounded-2xl bg-white border-slate-200 shadow-sm shadow-slate-100">
                                        <InputSlot className="pl-4">
                                            <Icon as={Phone} size="sm" className="text-slate-400" />
                                        </InputSlot>
                                        <InputField
                                            placeholder="Alternative Mobile Number"
                                            keyboardType="phone-pad"
                                            value={formData.altMobileNo}
                                            onChangeText={(v) => updateForm('altMobileNo', v)}
                                        />
                                    </Input>
                                    <AnimateError isVisible={errors.altMobileNo}>
                                        {errors.altMobileNo}
                                    </AnimateError>
                                </FormControl>

                                {/* ADDRESS FIELD */}
                                <FormControl isInvalid={!!errors.address}>
                                    <VStack space="xs" className="w-full">
                                        <Input className="min-h-[100px] rounded-2xl bg-white border-slate-200 shadow-sm shadow-slate-100 items-start py-3">
                                            <InputSlot className="pl-4 pt-1">
                                                <Icon as={MapPin} size="sm" className="text-slate-400" />
                                            </InputSlot>
                                            <InputField
                                                multiline={true}
                                                numberOfLines={4}
                                                placeholder="Complete Residential Address"
                                                value={formData.address}
                                                onChangeText={(v) => updateForm('address', v)}
                                                className="text-sm pt-1"
                                                textAlignVertical="top"
                                            />
                                        </Input>
                                        <AnimateError isVisible={errors.address}>
                                            {errors.address}
                                        </AnimateError>
                                    </VStack>
                                </FormControl>

                                {/* STATE DROPDOWN */}
                                <FormControl isInvalid={!!errors.state}>
                                    <Dropdown
                                        style={[
                                            styles.dropdown,
                                            isFocus && { borderColor: '#0891b2' },
                                            errors.state && { borderColor: '#EF4444' }
                                        ]}
                                        data={STATES || []}
                                        labelField="StateName"
                                        valueField="StateCode"
                                        placeholder="Select State"
                                        selectedTextStyle={styles.selectedText}
                                        placeholderStyle={styles.placeholder}
                                        value={formData.state}
                                        onFocus={() => setIsFocus(true)}
                                        onBlur={() => setIsFocus(false)}
                                        onChange={item => {
                                            updateForm('state', item.StateCode);
                                            updateForm('city', '');
                                            fetchCities(item.StateCode);
                                        }}
                                        renderLeftIcon={() => (
                                            <Icon as={MapPin} size="sm" className="mr-2 text-cyan-600" />
                                        )}
                                    />
                                    <AnimateError isVisible={errors.state}>
                                        {errors.state}
                                    </AnimateError>
                                </FormControl>

                                {/* CITY DROPDOWN */}
                                {formData.state && (
                                    <FormControl isInvalid={!!errors.city}>
                                        <Dropdown
                                            style={[
                                                styles.dropdown,
                                                errors.city && { borderColor: '#EF4444' }
                                            ]}
                                            mode="modal"
                                            data={cities || []}
                                            labelField="CityName"
                                            valueField="CityCode"
                                            placeholder={isLoading ? "Loading cities..." : "Select City"}
                                            selectedTextStyle={styles.selectedText}
                                            placeholderStyle={styles.placeholder}
                                            value={formData.city}
                                            onChange={item => updateForm('city', item.CityCode)}
                                            renderLeftIcon={() =>
                                                isLoading ? (
                                                    <ActivityIndicator size="small" color="#0891b2" className="mr-2" />
                                                ) : (
                                                    <Icon as={Navigation} size="sm" className="mr-2 text-cyan-600" />
                                                )
                                            }
                                        />
                                        <AnimateError isVisible={errors.city}>
                                            {errors.city}
                                        </AnimateError>
                                    </FormControl>
                                )}
                            </VStack>

                        </VStack>

                    </VStack>
                </ScrollView>
                <Box className="p-6 bg-slate-50 border-t border-slate-100">
                    <Button size="lg" className="h-16 rounded-2xl bg-cyan-600" onPress={handleSave}>
                        <ButtonText className="font-bold text-white">Register Staff</ButtonText>
                    </Button>
                </Box>
            </KeyboardAvoidingView>

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
        fontSize: 14,
        color: '#94a3b8', // slate-400
    },
    selectedText: {
        fontSize: 14,
        color: '#0f172a', // slate-900
    },
});
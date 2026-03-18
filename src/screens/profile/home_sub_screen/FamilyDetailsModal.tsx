import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
    Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Heading, Text, VStack, HStack, Box,
    FormControl, FormControlLabel, FormControlLabelText,
    Button, ButtonText, Spinner,
} from '@/src/components/common/GluestackUI';
import { Dropdown } from 'react-native-element-dropdown';
import { Users, UserRound, UserSquare, Users2, MapPin, Briefcase, Globe, Landmark, ChevronLeftIcon, CloseIcon, Icon } from '@/src/components/common/IconUI';
import FuturisticDropdown from '@/src/components/common/FuturisticDropdown';
import _ from 'lodash';
import profileService from '@/src/services/profileService';

// --- Data Constants ---
const OCCUPATION_DATA = [
    { label: 'Homemaker', value: 'Homemaker' },
    { label: 'Retired', value: 'Retired' },
    { label: 'Business', value: 'Business' },
    { label: 'Service', value: 'Service' },
    { label: 'Professional', value: 'Professional' },
];

const COUNT_DATA = [
    { label: 'None', value: '0' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3+', value: '3+' },
];

// --- Data Constants ---
const FINANCIAL_STATUS_DATA = [
    { label: 'Elite', value: 'Elite', desc: 'Large business/Top Professional, Income > 70L' },
    { label: 'High', value: 'High', desc: 'Mid-sized business/Leadership, Income 30-70L' },
    { label: 'Middle', value: 'Middle', desc: 'Small business/Office jobs, Income 10-30L' },
    { label: 'Aspiring', value: 'Aspiring', desc: 'Small business/Office jobs, Income < 10L' },
];

const FINANCIAL_DETAILS = {
    Elite: ["Family runs a large business or exceptional professional background", "Owns very high value assets & properties", "Annual income above 70 lakhs"],
    High: ["Mid-sized business or leadership positions", "Owns property & high value assets", "Annual income 30-70 lakhs"],
    Middle: ["Small business or office jobs", "Owns vehicle, house & assets", "Annual income 10-30 lakhs"],
    Aspiring: ["Small business or office jobs", "Basic assets and properties", "Annual income below 10 lakhs"],
};

export const FamilyDetailsModal = ({ isOpen, onClose, lookups, content, onRefresh, showToast, user }: any) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState(_.cloneDeep(content));
    const [validationTriggered, setValidationTriggered] = useState(false)
    const [isSaving, setIsSaving] = useState(false);

    const updateForm = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };
    const handleNext = () => setCurrentStep(2);
    const handleBack = () => setCurrentStep(1);
    const validateForm = () => {
        // 1. Basic Field Validation
        const requiredFields = [
            'first_name',
            'last_name',
            'gender',
            'marital_status',
            'dobDay',
            'dobMonth',
            'dobYear',
            'height',
            'blood_group'
        ];

        for (const field of requiredFields) {
            if (!formData[field] || formData[field].toString().trim() === '') {
                return false;
            }
        }


        return true;
    };
    const handleSave = async () => {
        setValidationTriggered(true);
        let isvalid = !validateForm()
        if (isvalid) {
            // You can add a Toast message here if you use them
            console.log("Validation failed");
            return;
        }
        setIsSaving(true);
        try {
            const payload = {
                id: user?.profile_id,
                action: 'basicdetails',
                first_name: formData.first_name,
                last_name: formData.last_name,
                // Format date if needed, e.g., "1996-06-12"
                dob: `${formData.dobYear}-${formData.dobMonth}-${formData.dobDay}`,
                gender: formData.gender,
                marital_status: formData.marital_status,
                height: formData.height,
                weight: formData.weight || 0,
                blood_group: formData.blood_group,
                has_children: formData.has_children,
                children_count: formData.children_count || 0,
                // We send the actual array; Axios handles the JSON conversion
                kids_details: formData.kids_details,
                disability: formData.disability
            };
            console.log('payload', payload)
            const res = await profileService.updateEditProfile(payload);
            if (res.success) {
                showToast("Basic Details", "Profile updated successfully!", "success");
                // Important: If you save this locally, you might need to JSON.parse kids_details
                if (onRefresh) await onRefresh();
                onClose();
            } else {
                showToast("Update Failed", res?.message || "Check your details", "error");
            }

        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };
    return (
        <Modal isOpen={isOpen} onClose={() => { onClose(); setCurrentStep(1); }} size="full">
            <ModalBackdrop />
            <ModalContent className="bg-white flex-1">

                {/* FIX: Aligned Header with proper spacing */}
                <ModalHeader className="px-6 pt-10 pb-0 flex-row items-center justify-between border-0">
                    <Box className="w-10">
                        {currentStep === 2 && (
                            <Button variant="link" onPress={handleBack} className="p-0 justify-start">
                                <Icon as={ChevronLeftIcon} size="xl" className="text-typography-900" />
                            </Button>
                        )}
                    </Box>

                    <ModalCloseButton className="h-10 w-10 rounded-full bg-slate-100 items-center justify-center">
                        <Icon as={CloseIcon} size="md" className="text-typography-900" />
                    </ModalCloseButton>
                </ModalHeader>

                <ModalBody className="flex-1 p-0">
                    <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
                        {currentStep === 1 ? (
                            <VStack space="xl">
                                <VStack className="items-center mb-6">
                                    <Box className="w-16 h-16 rounded-[22px] bg-blue-50 items-center justify-center border-b-4 border-blue-200">
                                        <Icon as={Users} size='lg' className="text-blue-600" />
                                    </Box>
                                    <Heading size="xl" className="mt-4">Family Members</Heading>
                                    <Text size="xs" className="text-center text-slate-500">Step 1 of 2: Parents & Siblings</Text>
                                </VStack>
                                <FormControl>
                                    <FormControlLabel className="mb-2"><FormControlLabelText className="font-bold">Father's Details</FormControlLabelText></FormControlLabel>

                                    <FuturisticDropdown
                                        data={OCCUPATION_DATA}
                                        value={formData.fatherDetails}
                                        onChange={(item: any) => updateForm('fatherDetails', item.value)}
                                        placeholder="Select father details "
                                        icon={{ icon: UserSquare, color: 'text-blue-500' }}
                                        search={false}
                                        isInvalid={validationTriggered && !formData.fatherDetails}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormControlLabel className="mb-2"><FormControlLabelText className="font-bold">Mother's Details</FormControlLabelText></FormControlLabel>
                                    <FuturisticDropdown
                                        data={OCCUPATION_DATA}
                                        value={formData.motherDetails}
                                        onChange={(item: any) => updateForm('motherDetails', item.value)}
                                        placeholder="Select mother details "
                                        icon={{ icon: UserRound, color: 'text-blue-500' }}
                                        search={false}
                                        isInvalid={validationTriggered && !formData.motherDetails}
                                    />
                                </FormControl>



                                {/* FIX: Sibling Grid with overflow/width handling */}
                                <HStack space="md" className="w-full">
                                    <VStack className="flex-1">
                                        <Text size="sm" className="font-bold mb-2">Brothers</Text>

                                        <FuturisticDropdown
                                            data={COUNT_DATA}
                                            value={formData.noOfBrothers}
                                            onChange={(item: any) => updateForm('noOfBrothers', item.value)}
                                            placeholder="Select"
                                            icon={{ icon: Users, color: 'text-blue-500' }}
                                            search={false}
                                            isInvalid={validationTriggered && !formData.noOfBrothers}
                                        />
                                    </VStack>

                                    <VStack className="flex-1">
                                        <Text size="sm" className="font-bold mb-2">Sisters</Text>
                                        <FuturisticDropdown
                                            data={COUNT_DATA}
                                            value={formData.noOfSisters}
                                            onChange={(item: any) => updateForm('noOfSisters', item.value)}
                                            placeholder="Select"
                                            icon={{ icon: Users2, color: 'text-blue-500' }}
                                            search={false}
                                            isInvalid={validationTriggered && !formData.noOfSisters}
                                        />


                                    </VStack>

                                </HStack>
                            </VStack>
                        ) : (
                            <VStack space="xl">
                                <VStack className="items-center mb-6">
                                    <Box className="w-16 h-16 rounded-[22px] bg-blue-50 items-center justify-center border-b-4 border-blue-200">
                                        <Icon as={MapPin} size='lg' className="text-blue-600" />
                                    </Box>
                                    <Heading size="xl" className="mt-4">Location & Status</Heading>
                                    <Text size="xs" className="text-center text-slate-500">Step 2 of 2: Family Background</Text>
                                </VStack>

                                <VStack space="md">
                                    <FuturisticDropdown
                                        data={lookups?.country}
                                        value={formData.country}
                                        onChange={(item: any) => updateForm('country', item.value)}
                                        placeholder="Select"
                                        icon={{ icon: Globe, color: 'text-blue-500' }}
                                        search={false}
                                        isInvalid={validationTriggered && !formData.country}
                                    />
                                    <FuturisticDropdown
                                        data={lookups?.state}
                                        value={formData.state}
                                        onChange={(item: any) => updateForm('state', item.value)}
                                        placeholder="Select"
                                        icon={{ icon: MapPin, color: 'text-blue-500' }}
                                        search={false}
                                        isInvalid={validationTriggered && !formData.state}
                                    />
                                    <FuturisticDropdown
                                        data={lookups?.city}
                                        value={formData.city}
                                        onChange={(item: any) => updateForm('city', item.value)}
                                        placeholder="Select"
                                        icon={{ icon: Landmark, color: 'text-blue-500' }}
                                        search={false}
                                        isInvalid={validationTriggered && !formData.city}
                                    />
                                </VStack>

                                <FormControl>
                                    <FormControlLabel className="mb-2"><FormControlLabelText className="font-bold">Family Financial Status</FormControlLabelText></FormControlLabel>
                                    <FuturisticDropdown
                                        data={FINANCIAL_STATUS_DATA}
                                        value={formData.familyFinancialStatus}
                                        onChange={(item: any) => updateForm('familyFinancialStatus', item.value)}
                                        placeholder="Select"
                                        icon={{ icon: Briefcase, color: 'text-blue-500' }}
                                        search={false}
                                        isInvalid={validationTriggered && !formData.familyFinancialStatus}
                                    />
                                </FormControl>

                                {formData.familyFinancialStatus && (
                                    <Box className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <Text size="sm" className="font-bold text-blue-600 mb-2">{formData.familyFinancialStatus} Status Details:</Text>
                                        {FINANCIAL_DETAILS[formData.familyFinancialStatus as keyof typeof FINANCIAL_DETAILS].map((note, i) => (
                                            <HStack key={i} space="xs" className="mb-1 items-start">
                                                <Text className="text-blue-500">•</Text>
                                                <Text size="xs" className="text-slate-600 flex-1">{note}</Text>
                                            </HStack>
                                        ))}
                                    </Box>
                                )}
                            </VStack>
                        )}
                        <Box className="h-20" />
                    </ScrollView>
                </ModalBody>

                <ModalFooter className="p-6 border-t border-outline-100">
                    {currentStep === 1 ? (
                        <Button onPress={handleNext} className="w-full rounded-2xl h-14 bg-blue-600 shadow-lg shadow-blue-200">
                            <ButtonText className="text-white font-bold">Continue to Step 2</ButtonText>
                        </Button>
                    ) : (
                        <HStack className="w-full gap-3">
                            <Button variant="outline" action="secondary" onPress={handleBack} className="flex-1 rounded-2xl h-14 border-outline-300">
                                <ButtonText className="text-typography-600 font-bold">Back</ButtonText>
                            </Button>
                            <Button onPress={handleSave} isDisabled={isSaving} className="flex-1 rounded-2xl h-14 bg-blue-600 shadow-lg shadow-blue-200">
                                {isSaving ? <Spinner color="white" /> : <ButtonText className="text-white font-bold">Update Details</ButtonText>}
                            </Button>
                        </HStack>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        height: 56,
        borderRadius: 16,
        paddingHorizontal: 16,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        width: '100%' // Ensures dropdown fills parent VStack
    },
    placeholderStyle: { color: '#9CA3AF', fontSize: 14 },
    selectedTextStyle: { color: '#111827', fontSize: 14, fontWeight: '500' },
});
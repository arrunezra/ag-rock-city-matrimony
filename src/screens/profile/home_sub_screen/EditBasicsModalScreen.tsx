import React, { useState, useRef } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import {
    Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Heading, VStack, HStack,
    Text, Input, InputField, Button, ButtonText, Spinner,
    FormControl, FormControlLabel, FormControlLabelText,
    Box
} from '@/src/components/common/GluestackUI';
import api from '@/src/api/api';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Calendar, Droplets, Info, Users, X } from '@/src/components/common/IconUI';
import { InputIcon, InputSlot } from '@/components/ui/input';
import { Dropdown } from 'react-native-element-dropdown';

const EditBasicsModalScreen = ({ isOpen, onClose, user, onSaveSuccess }: any) => {
    const [isSaving, setIsSaving] = useState(false);
    const [validationTriggered, setValidationTriggered] = useState(false);
    const BLOOD_GROUPS = [
        { label: 'A+', value: 'A+' }, { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' }, { label: 'B-', value: 'B-' },
        { label: 'O+', value: 'O+' }, { label: 'O-', value: 'O-' },
        { label: 'AB+', value: 'AB+' }, { label: 'AB-', value: 'AB-' }
    ];
    const [formData, setFormData] = useState<any>({
        firstName: user?.first_name || '',
        lastName: user?.last_name || '',
        dobDay: user?.dob?.split('-')[2] || '',
        dobMonth: user?.dob?.split('-')[1] || '',
        dobYear: user?.dob?.split('-')[0] || '',
        gender: user?.gender || '',
    });

    const lastNameRef = useRef<any>(null);
    const dayRef = useRef<any>(null);
    const monthRef = useRef<any>(null);
    const yearRef = useRef<any>(null);

    const updateForm = (key: string, value: string) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };

    // Fix: Ensure this doesn't accidentally render as a raw string inside the JSX
    const isDateInvalid = !formData.dobDay || !formData.dobMonth || !formData.dobYear;
    const dateErrorMessage = isDateInvalid ? "Complete Date of Birth is required" : "";

    const handleSave = async () => {
        setValidationTriggered(true);
        if (!formData.firstName || !formData.lastName || isDateInvalid) return;

        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                dob: `${formData.dobYear}-${formData.dobMonth}-${formData.dobDay}`
            };
            const res = await api.post('/manage_profile.php', payload);
            if (res.data.success) {
                onSaveSuccess();
                onClose();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    };
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="full">
            <ModalBackdrop />
            <ModalContent className="bg-white flex-1">
                <ModalHeader className="px-6 pt-10 pb-0 justify-end border-0">
                    <ModalCloseButton className="h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                        <Icon as={X} size="md" />
                    </ModalCloseButton>
                </ModalHeader>

                <ModalBody className="flex-1 p-0">
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 40 }}
                        className="px-6 py-4"
                        showsVerticalScrollIndicator={false}
                    >
                        <VStack space="xl">
                            {/* 2026 Futuristic Icon Section */}
                            <VStack className="items-center mb-8">
                                <Box className="relative w-20 h-20 items-center justify-center">
                                    <Box className="absolute w-16 h-16 rounded-full bg-blue-500 blur-2xl opacity-20" />
                                    <Box
                                        className="w-16 h-16 rounded-[22px] items-center justify-center bg-blue-50 border-b-4 border-blue-200 shadow-sm"
                                        style={{ transform: [{ rotate: '-6deg' }] }}
                                    >
                                        <Icon as={Users} size="xl" className="text-blue-600" style={{ transform: [{ rotate: '6deg' }] }} />
                                    </Box>
                                </Box>
                                <Heading size="xl" className="mt-4 tracking-tight text-center text-typography-900">
                                    Edit Basic Details
                                </Heading>
                            </VStack>

                            <VStack className="gap-6">
                                {/* 1. First Name */}
                                <FormControl isInvalid={validationTriggered && !formData.firstName}>
                                    <FormControlLabel className="mb-2">
                                        <FormControlLabelText size="sm" className="font-bold">First Name</FormControlLabelText>
                                    </FormControlLabel>
                                    <Input size="lg" className="h-16 rounded-2xl border-outline-200 bg-white shadow-sm shadow-slate-100">
                                        <InputSlot className="pl-4"><InputIcon as={Info} className="text-typography-400" /></InputSlot>
                                        <InputField
                                            placeholder="Enter your first name"
                                            value={formData.firstName}
                                            onChangeText={(v) => updateForm('firstName', v)}
                                        />
                                    </Input>
                                </FormControl>

                                {/* 2. Gender Selection */}
                                <FormControl isInvalid={validationTriggered && !formData.gender}>
                                    <FormControlLabel className="mb-2">
                                        <FormControlLabelText size="sm" className="font-bold">Gender</FormControlLabelText>
                                    </FormControlLabel>
                                    <HStack className="gap-3">
                                        {['Male', 'Female'].map((option) => (
                                            <TouchableOpacity
                                                key={option}
                                                onPress={() => updateForm('gender', option)}
                                                className={`flex-1 h-16 rounded-2xl border-2 items-center justify-center ${formData.gender === option ? 'border-blue-600 bg-blue-50/50' : 'border-outline-100 bg-slate-50/50'}`}
                                            >
                                                <Text className={formData.gender === option ? 'text-blue-700 font-bold' : 'text-typography-500'}>
                                                    {option}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </HStack>
                                </FormControl>

                                {/* 3. Marital Status Selection (NEW) */}
                                <FormControl isInvalid={validationTriggered && !formData.maritalStatus}>
                                    <FormControlLabel className="mb-2">
                                        <FormControlLabelText size="sm" className="font-bold">Marital Status</FormControlLabelText>
                                    </FormControlLabel>
                                    <HStack className="flex-wrap gap-2">
                                        {['Never Married', 'Awaiting Divorce', 'Divorced', 'Widowed'].map((status) => (
                                            <TouchableOpacity
                                                key={status}
                                                onPress={() => updateForm('maritalStatus', status)}
                                                className={`px-4 h-12 rounded-xl border-2 items-center justify-center ${formData.maritalStatus === status ? 'border-blue-600 bg-blue-50/50' : 'border-outline-100 bg-slate-50/50'}`}
                                            >
                                                <Text size="sm" className={formData.maritalStatus === status ? 'text-blue-700 font-bold' : 'text-typography-500'}>
                                                    {status}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </HStack>
                                </FormControl>

                                {/* 4. Date of Birth */}
                                <FormControl isInvalid={validationTriggered && (isDateInvalid || !formData.dobDay)}>
                                    <FormControlLabel className="mb-2">
                                        <FormControlLabelText size="sm" className="font-bold">Date of Birth</FormControlLabelText>
                                    </FormControlLabel>
                                    <HStack className="gap-2">
                                        {[
                                            { key: 'dobDay', placeholder: 'DD' },
                                            { key: 'dobMonth', placeholder: 'MM' },
                                            { key: 'dobYear', placeholder: 'YYYY', flex: 1.5 }
                                        ].map((item: any) => (
                                            <Input
                                                key={item.key}
                                                className="h-16 rounded-2xl border-outline-200 bg-white shadow-sm shadow-slate-100"
                                                style={{ flex: item.flex || 1 }}
                                            >
                                                <InputField
                                                    placeholder={item.placeholder}
                                                    keyboardType="numeric"
                                                    value={formData[item.key]}
                                                    onChangeText={(v) => updateForm(item.key, v)}
                                                    maxLength={item.key === 'dobYear' ? 4 : 2}
                                                    className="text-center"
                                                />
                                            </Input>
                                        ))}
                                    </HStack>
                                </FormControl>

                                {/* 5. Blood Group (Dropdown) */}
                                <FormControl isInvalid={validationTriggered && !formData.bloodGroup}>
                                    <FormControlLabel className="mb-2">
                                        <FormControlLabelText size="sm" className="font-bold">Blood Group</FormControlLabelText>
                                    </FormControlLabel>
                                    <Dropdown
                                        style={styles.dropdown}
                                        data={BLOOD_GROUPS}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Blood Group"
                                        value={formData?.bloodGroup || ''}
                                        onChange={item => updateForm('bloodGroup', item.value)}
                                        renderLeftIcon={() => <Icon as={Droplets} size="sm" className="mr-2 text-red-500" />}
                                    />
                                </FormControl>
                            </VStack>
                        </VStack>
                    </ScrollView>
                </ModalBody>

                <ModalFooter className="p-6">
                    <Button onPress={handleSave} isDisabled={isSaving} className="w-full h-14 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100">
                        <ButtonText className="font-bold text-white">Update Basics</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
const styles = {
    dropdown: {
        height: 60,
        borderRadius: 16,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#f1f5f9',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    }
};
export default EditBasicsModalScreen;

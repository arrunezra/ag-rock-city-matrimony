import React, { useState, useRef, useContext, useEffect } from 'react';
import { ScrollView, Platform, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import {
    Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Heading, VStack, HStack,
    Text, Input, InputField, Button, ButtonText, Spinner,
    FormControl, FormControlLabel, FormControlLabelText,
    Box,
    Select,
    SelectTrigger,
    SelectInput,
    SelectPortal,
    SelectBackdrop,
    SelectContent,
    SelectItem
} from '@/src/components/common/GluestackUI';
import api from '@/src/api/api';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Calendar, Droplets, Heart, Info, Ruler, Trash2, User, Users, X } from '@/src/components/common/IconUI';
import { InputIcon, InputSlot } from '@/components/ui/input';
import { Dropdown } from 'react-native-element-dropdown';
import { HEIGHT_DATA, MARITAL_STATUS } from '@/src/utils/utils';
import { LookupContext } from '@/src/context/LookupContext';
import _ from 'lodash';


const EditBasicsModalScreen = ({ isOpen, onClose, user, content, onSaveSuccess }: any) => {
    const [isSaving, setIsSaving] = useState(false);
    const { lookups } = useContext(LookupContext);
    const [validationTriggered, setValidationTriggered] = useState(false);
    const BLOOD_GROUPS = [
        { label: 'A+', value: 'A+' }, { label: 'A-', value: 'A-' },
        { label: 'B+', value: 'B+' }, { label: 'B-', value: 'B-' },
        { label: 'O+', value: 'O+' }, { label: 'O-', value: 'O-' },
        { label: 'AB+', value: 'AB+' }, { label: 'AB-', value: 'AB-' }
    ];
    const [formData, setFormData] = useState<any>(_.cloneDeep(content || []));

    const lastNameRef = useRef<any>(null);
    const dayRef = useRef<any>(null);
    const monthRef = useRef<any>(null);
    const yearRef = useRef<any>(null);
    const updateForm = (key: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [key]: value }));
    };
    useEffect(() => {
        if (content?.dob) {
            const [year, month, day] = content?.dob?.split('-');
            const yyyy = year; // 1996
            const mm = String(month).padStart(2, '0'); // "06"
            const dd = String(day).padStart(2, '0'); // "12" 
            updateForm('dobDay', dd)
            updateForm('dobMonth', mm)
            updateForm('dobYear', yyyy)
        }


    }, [])

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
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                    // For full-screen modals, sometimes you need keyboardVerticalOffset
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
                >
                    <ModalHeader className="px-6 pt-10 pb-0 justify-end border-0">
                        <ModalCloseButton className="h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                            <Icon as={X} size="md" />
                        </ModalCloseButton>
                    </ModalHeader>

                    <ModalBody className="flex-1 p-0">
                        <ScrollView
                            contentContainerStyle={{ paddingBottom: 60 }}
                            className="px-6 py-4"
                            showsVerticalScrollIndicator={false}
                        >
                            <VStack space="xl">
                                {/* 1. 2026 Futuristic Icon Section */}
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
                                    <Text size="sm" className="text-typography-500 text-center px-4">Update your core profile information</Text>
                                </VStack>

                                <VStack className="gap-6">

                                    {/* 2. NAME SECTION (Split into First and Last) */}
                                    <HStack space="md" className="w-full">
                                        <FormControl isInvalid={validationTriggered && !formData.firstName} className="flex-1">
                                            <FormControlLabel className="mb-2">
                                                <FormControlLabelText size="sm" className="font-bold">First Name</FormControlLabelText>
                                            </FormControlLabel>
                                            <Input size="lg" className="h-16 rounded-2xl border-outline-200 bg-white shadow-sm shadow-slate-100">
                                                <InputSlot className="pl-4"><InputIcon as={User} className="text-typography-400" /></InputSlot>
                                                <InputField
                                                    placeholder="First Name"
                                                    value={formData.first_name}
                                                    onChangeText={(v) => updateForm('first_name', v)}
                                                />
                                            </Input>
                                        </FormControl>

                                        <FormControl isInvalid={validationTriggered && !formData.lastName} className="flex-1">
                                            <FormControlLabel className="mb-2">
                                                <FormControlLabelText size="sm" className="font-bold">Last Name</FormControlLabelText>
                                            </FormControlLabel>
                                            <Input size="lg" className="h-16 rounded-2xl border-outline-200 bg-white shadow-sm shadow-slate-100">
                                                <InputField
                                                    placeholder="Last Name"
                                                    value={formData.last_name}
                                                    onChangeText={(v) => updateForm('last_name', v)}
                                                />
                                            </Input>
                                        </FormControl>
                                    </HStack>

                                    {/* 3. Gender Selection */}
                                    <FormControl isInvalid={validationTriggered && !formData.gender}>
                                        <FormControlLabel className="mb-2">
                                            <FormControlLabelText size="sm" className="font-bold">Gender</FormControlLabelText>
                                        </FormControlLabel>
                                        <HStack className="gap-3">
                                            {['Male', 'Female'].map((option) => (
                                                <TouchableOpacity
                                                    key={option}
                                                    onPress={() => updateForm('gender', option)}
                                                    className={`flex-1 h-14 rounded-2xl border-2 items-center justify-center transition-all ${formData.gender === option ? 'border-blue-600 bg-blue-50/50' : 'border-outline-100 bg-slate-50/50'}`}
                                                >
                                                    <Text className={formData.gender === option ? 'text-blue-700 font-bold' : 'text-typography-500'}>
                                                        {option}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </HStack>
                                    </FormControl>

                                    {/* 4. Marital Status Dropdown */}
                                    <FormControl isInvalid={validationTriggered && !formData.maritalStatus}>
                                        <FormControlLabel className="mb-2">
                                            <FormControlLabelText size="sm" className="font-bold">Marital Status</FormControlLabelText>
                                        </FormControlLabel>
                                        <Dropdown
                                            style={[styles.dropdown, (validationTriggered && !formData.maritalStatus) && { borderColor: '#EF4444' }]}
                                            // data={MARITAL_STATUS}
                                            data={lookups.marital_status || []}
                                            labelField="label"
                                            valueField="value"
                                            placeholder="Select Status"
                                            value={formData.marital_status}
                                            onChange={item => {
                                                console.log(item);
                                                updateForm('marital_status', item.value);
                                                if (item.value === 'Never Married') {
                                                    updateForm('hasChildren', 'No');
                                                    updateForm('kids', []);
                                                }
                                            }}
                                            renderLeftIcon={() => <Icon as={Heart} size="sm" className="mr-2 text-rose-500" />}
                                        />
                                    </FormControl>

                                    {/* 5. Date of Birth Section */}
                                    <FormControl isInvalid={validationTriggered && (!formData.dobDay || !formData.dobMonth || !formData.dobYear)}>
                                        <FormControlLabel className="mb-2">
                                            <FormControlLabelText size="sm" className="font-bold">Date of Birth</FormControlLabelText>
                                        </FormControlLabel>
                                        <HStack className="gap-2">
                                            {[
                                                { key: 'dobDay', placeholder: 'DD', max: 2 },
                                                { key: 'dobMonth', placeholder: 'MM', max: 2 },
                                                { key: 'dobYear', placeholder: 'YYYY', flex: 1.5, max: 4 }
                                            ].map((item) => (
                                                <Input
                                                    key={item.key}
                                                    className="h-14 rounded-2xl border-outline-200 bg-white shadow-sm shadow-slate-100"
                                                    style={{ flex: item.flex || 1 }}
                                                >
                                                    <InputField
                                                        placeholder={item.placeholder}
                                                        keyboardType="numeric"
                                                        value={formData[item.key]}
                                                        onChangeText={(v) => updateForm(item.key, v)}
                                                        maxLength={item.max}
                                                        className="text-center"
                                                    />
                                                </Input>
                                            ))}
                                        </HStack>
                                    </FormControl>

                                    {/* 6. Physical Attributes Section */}
                                    <HStack space="md">
                                        <FormControl isInvalid={validationTriggered && !formData.height} className="flex-1">
                                            <FormControlLabel><FormControlLabelText size="sm" className="font-bold">Height</FormControlLabelText></FormControlLabel>
                                            <Dropdown
                                                style={styles.dropdown}
                                                data={HEIGHT_DATA}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Height"
                                                value={formData.height}
                                                onChange={item => updateForm('height', item.value)}
                                                renderLeftIcon={() => <Icon as={Ruler} size="sm" className="mr-2 text-cyan-500" />}
                                            />
                                        </FormControl>

                                        <FormControl isInvalid={validationTriggered && !formData.bloodGroup} className="flex-1">
                                            <FormControlLabel><FormControlLabelText size="sm" className="font-bold">Blood Group</FormControlLabelText></FormControlLabel>
                                            <Dropdown
                                                style={styles.dropdown}
                                                data={BLOOD_GROUPS}
                                                labelField="label"
                                                valueField="value"
                                                placeholder="Blood"
                                                value={formData.bloodGroup}
                                                onChange={item => updateForm('blood_group', item.value)}
                                                renderLeftIcon={() => <Icon as={Droplets} size="sm" className="mr-2 text-red-500" />}
                                            />
                                        </FormControl>
                                    </HStack>

                                    {/* 7. Kids Section (Conditional) */}
                                    {formData.maritalStatus !== 'Never Married' && formData.maritalStatus !== '' && (
                                        <VStack space="md" className="bg-blue-50/50 p-5 rounded-[28px] border border-blue-100/50 mt-2">
                                            <HStack className="justify-between items-center">
                                                <Heading size="xs" className="text-blue-800 uppercase tracking-widest">Children</Heading>
                                                <HStack space="md">
                                                    {['No', 'Yes'].map((opt) => (
                                                        <TouchableOpacity
                                                            key={opt}
                                                            onPress={() => updateForm('hasChildren', opt)}
                                                            className={`px-4 py-1.5 rounded-full ${formData.hasChildren === opt ? 'bg-blue-600' : 'bg-white border border-blue-100'}`}
                                                        >
                                                            <Text size="xs" className={formData.hasChildren === opt ? 'text-white font-bold' : 'text-blue-600'}>{opt}</Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </HStack>
                                            </HStack>

                                            {formData.hasChildren === 'Yes' && (
                                                <VStack space="md" className="mt-3">
                                                    <Input className="h-12 bg-white rounded-xl border-blue-100">
                                                        <InputField
                                                            placeholder="Number of children"
                                                            keyboardType="numeric"
                                                            value={formData.children_count} // Updated to children_count from your new code
                                                            onChangeText={handleChildrenCountChange}
                                                        />
                                                    </Input>

                                                    {formData?.kids?.map((kid: any, index: number) => (
                                                        <Box key={index} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm shadow-slate-100 mb-2">
                                                            {/* Header with Child Number and Trash Icon */}
                                                            <HStack className="justify-between items-center mb-4">
                                                                <HStack space="xs" className="items-center">
                                                                    <Box className="w-6 h-6 rounded-full bg-cyan-100 items-center justify-center">
                                                                        <Text className="text-[10px] font-bold text-cyan-700">{index + 1}</Text>
                                                                    </Box>
                                                                    <Text className="font-bold text-slate-700">Child Details</Text>
                                                                </HStack>
                                                                <TouchableOpacity onPress={() => removeChild(index)} className="p-2 bg-rose-50 rounded-full">
                                                                    <Icon as={Trash2} size='md' className="text-rose-500" />
                                                                </TouchableOpacity>
                                                            </HStack>

                                                            {/* Input Row: Age and Gender */}
                                                            <HStack className="gap-3">
                                                                <Input className="flex-1 h-12 rounded-xl border-slate-200">
                                                                    <InputSlot className="pl-3">
                                                                        <Icon as={User} size='md' className="text-slate-400" />
                                                                    </InputSlot>
                                                                    <InputField
                                                                        placeholder="Age"
                                                                        keyboardType="numeric"
                                                                        value={kid.age}
                                                                        onChangeText={(v) => updateKidDetail(index, 'age', v)}
                                                                    />
                                                                </Input>
                                                                <Box className="flex-1">
                                                                    <Select onValueChange={(v) => updateKidDetail(index, 'gender', v)} selectedValue={kid.gender}>
                                                                        <SelectTrigger className="h-12 rounded-xl border-slate-200">
                                                                            <SelectInput placeholder="Gender" />
                                                                        </SelectTrigger>
                                                                        <SelectPortal>
                                                                            <SelectBackdrop />
                                                                            <SelectContent>
                                                                                <SelectItem label="Boy" value="Boy" />
                                                                                <SelectItem label="Girl" value="Girl" />
                                                                            </SelectContent>
                                                                        </SelectPortal>
                                                                    </Select>
                                                                </Box>
                                                            </HStack>

                                                            {/* Living Together Section (The missing piece) */}
                                                            <HStack className="items-center justify-between mt-4 pt-4 border-t border-slate-50">
                                                                <Text className="text-xs font-semibold text-slate-500">Living with you?</Text>
                                                                <HStack className="gap-4">
                                                                    {['Yes', 'No'].map(l => (
                                                                        <TouchableOpacity
                                                                            key={l}
                                                                            onPress={() => updateKidDetail(index, 'livingTogether', l)}
                                                                            className="flex-row items-center space-x-2 gap-2"
                                                                        >
                                                                            <Box className={`w-5 h-5 rounded-full border-2 items-center justify-center ${kid.livingTogether === l ? 'border-cyan-500' : 'border-slate-300'}`}>
                                                                                {kid.livingTogether === l && <Box className="w-2.5 h-2.5 rounded-full bg-cyan-500" />}
                                                                            </Box>
                                                                            <Text className="text-xs font-bold text-slate-600">{l}</Text>
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
                        </ScrollView>
                    </ModalBody>

                    <ModalFooter className="p-6">
                        <Button onPress={handleSave} isDisabled={isSaving} className="w-full h-14 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100">
                            <ButtonText className="font-bold text-white">Update Basics</ButtonText>
                        </Button>
                    </ModalFooter>
                </KeyboardAvoidingView>
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

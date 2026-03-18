import React, { useCallback, useContext, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import {
    VStack, HStack, Text, Box, Input, InputField,
    Button, ButtonText, FormControl, FormControlError, FormControlErrorText,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Heading,
    FormControlLabel,
    FormControlLabelText,
    ModalFooter,
    Divider,
    InputSlot
} from '@/src/components/common/GluestackUI';
import { Icon } from '@/components/ui/icon';
import { Heart, Search, X } from '@/src/components/common/IconUI';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { Coins, Globe, MoonStar } from 'lucide-react-native';
import FuturisticDropdown from '@/src/components/common/FuturisticDropdown';
import profileService from '@/src/services/profileService';
import _ from 'lodash';
import { HEIGHT_DATA } from '@/src/utils/utils';
import { LookupContext } from '@/src/context/LookupContext';
const PartnerPreferences = ({ }: any) => {
    const { lookups }: any = useContext(LookupContext);

    const [formData, setFormData] = useState({
        min_age: '21',
        max_age: '35',
        min_height: '150',
        max_height: '190',
        religions: [], // Array for MultiSelect
        communities: [],
        mother_tongues: [],
        marital_status: [],
        income_min: '',
        education: [],
        working_with: [],
        country: '',
        state: '',
        city: ''
    });
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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

    const updateForm = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    // Helper for Multi-Select Styling
    const multiSelectStyle = {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0', // slate-200
        minHeight: 56,
    };
    const onClose = () => {

    }
    const onSave = (item: any) => {

    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ModalHeader className="px-6 pt-10 pb-0 justify-end border-0">
                <ModalCloseButton onPress={onClose} className="h-10 w-10 items-center justify-center rounded-full bg-slate-100">
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
                        {/* Header */}
                        <VStack className="items-center mb-6">
                            <Box className="w-16 h-16 rounded-3xl bg-rose-50 items-center justify-center border-b-4 border-rose-200">
                                <Icon as={Heart} size="xl" className="text-rose-600" />
                            </Box>
                            <Heading size="xl" className="mt-4">Partner Match</Heading>
                            <Text size="sm" className="text-typography-500">Set preferences for your ideal match</Text>
                        </VStack>

                        <VStack className="gap-6">

                            {/* --- PHYSICAL SECTION --- */}
                            <HStack space="md">
                                <FormControl className="flex-1">
                                    <FormControlLabel><FormControlLabelText size="xl" className="font-bold">Age Range</FormControlLabelText></FormControlLabel>
                                    <HStack space="xl" className='item-center'  >
                                        <Input className="flex-1 h-12 rounded-xl bg-white"><InputField placeholder="Min" value={formData.min_age} onChangeText={v => updateForm('min_age', v)} keyboardType="numeric" /></Input>
                                        <Text size="xl">-</Text>
                                        <Input className="flex-1 h-12 rounded-xl bg-white"><InputField placeholder="Max" value={formData.max_age} onChangeText={v => updateForm('max_age', v)} keyboardType="numeric" /></Input>
                                    </HStack>
                                </FormControl>


                            </HStack>
                            <Heading size="md">Physical & Location</Heading>

                            {/* Height Range */}
                            <HStack space="md">
                                <Box className="flex-1">
                                    <Text size="xs" className="mb-1 font-bold">Min Height</Text>
                                    <FuturisticDropdown
                                        data={HEIGHT_DATA || []}
                                        value={formData.min_height}
                                        onChange={(item: any) => setFormData({ ...formData, min_height: item.value })}
                                        placeholder="Min. Height"
                                        icon={{ icon: MoonStar, color: 'text-typography-400' }}
                                        isInvalid={false}
                                    />

                                </Box>
                                <Box className="flex-1">
                                    <Text size="xs" className="mb-1 font-bold">Max Height</Text>
                                    <FuturisticDropdown
                                        data={HEIGHT_DATA || []}
                                        value={formData.max_height}
                                        onChange={(item: any) => setFormData({ ...formData, max_height: item.value })}
                                        placeholder="Max. Height"
                                        icon={{ icon: MoonStar, color: 'text-typography-400' }}
                                        isInvalid={false}
                                    />

                                </Box>
                            </HStack>
                            <Divider className="my-2 bg-slate-100" />
                            {/* Annual Income */}
                            <Box>
                                <Text size="xs" className="mb-1 font-bold">Minimum Annual Income</Text>
                                <FuturisticDropdown
                                    data={lookups?.income_range || []}
                                    value={formData.income_min}
                                    onChange={(item: any) => setFormData({ ...formData, income_min: item.value })}
                                    placeholder="Select Annual Income"
                                    icon={{ icon: MoonStar, color: 'text-typography-400' }}
                                    isInvalid={false}
                                />

                            </Box>{/* Location Cascading Dropdowns */}


                            {/* --- CULTURAL SECTION --- */}
                            <FormControl>
                                <FormControlLabel><FormControlLabelText size="sm" className="font-bold text-rose-700">Cultural Background</FormControlLabelText></FormControlLabel>
                                <VStack space="md" className="mt-2">
                                    <MultiSelect
                                        style={multiSelectStyle}
                                        placeholder="Religions"
                                        data={lookups?.religions || []}
                                        labelField="label"
                                        valueField="value"
                                        value={formData.religions}
                                        onChange={item => updateForm('religions', item)}
                                        selectedTextStyle={{ fontSize: 14, color: '#e11d48' }}
                                    />
                                    <MultiSelect
                                        style={multiSelectStyle}
                                        placeholder="Mother Tongues"
                                        data={lookups?.mother_tongues || []}
                                        labelField="label"
                                        valueField="value"
                                        value={formData.mother_tongues}
                                        onChange={item => updateForm('mother_tongues', item)}
                                    />
                                </VStack>
                            </FormControl>

                            {/* --- PROFESSIONAL SECTION --- */}
                            <FormControl>
                                <FormControlLabel><FormControlLabelText size="sm" className="font-bold text-blue-700">Career & Education</FormControlLabelText></FormControlLabel>
                                <VStack space="md" className="mt-2">
                                    <MultiSelect
                                        style={multiSelectStyle}
                                        placeholder="Education Levels"
                                        data={lookups?.education || []}
                                        labelField="label"
                                        valueField="value"
                                        value={formData.education}
                                        onChange={item => updateForm('education', item)}
                                    />
                                    <Input className="h-14 rounded-2xl bg-white border-outline-200">
                                        <InputSlot className="pl-4"><Icon as={Coins} size="sm" className="text-slate-400" /></InputSlot>
                                        <InputField
                                            placeholder="Min Annual Income (e.g. 5 LPA)"
                                            value={formData.income_min}
                                            onChangeText={v => updateForm('income_min', v)}
                                        />
                                    </Input>
                                </VStack>
                            </FormControl>

                            {/* --- LOCATION SECTION --- */}
                            <FormControl>
                                <FormControlLabel><FormControlLabelText size="sm" className="font-bold text-emerald-700">Location Details</FormControlLabelText></FormControlLabel>
                                <VStack space="md">

                                    <FuturisticDropdown
                                        data={lookups?.country || []}
                                        value={formData.country}
                                        onChange={(item: any) => setFormData({ ...formData, country: item.value })}
                                        placeholder="Select country"
                                        icon={{ icon: MoonStar, color: 'text-typography-400' }}
                                        isInvalid={false}
                                    />
                                    <FuturisticDropdown
                                        data={lookups?.state || []}
                                        value={formData.state}
                                        onChange={(item: any) => {
                                            setFormData({ ...formData, state: item.value })
                                            updateForm('state', item.value);
                                            updateForm('city', '');
                                            fetchCities(item.value);
                                        }}
                                        placeholder="Select state"
                                        icon={{ icon: MoonStar, color: 'text-typography-400' }}
                                        isInvalid={false}
                                    />
                                    {formData.state && (<FuturisticDropdown
                                        data={cities || []}
                                        value={formData.city}
                                        onChange={(item: any) => {
                                            updateForm('city', item.value);
                                        }}
                                        placeholder="Select city"
                                        icon={{ icon: MoonStar, color: 'text-typography-400' }}
                                        isInvalid={false}
                                    />
                                    )}


                                </VStack>

                            </FormControl>

                        </VStack>
                    </VStack>
                </ScrollView>
            </ModalBody>

            <ModalFooter className="p-6">
                <Button
                    onPress={() => onSave(formData)}
                    className="w-full h-14 bg-slate-900 rounded-2xl"
                >
                    <ButtonText className="font-bold text-white">Save Preferences</ButtonText>
                </Button>
            </ModalFooter>
        </KeyboardAvoidingView>
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F1F5F9' },
    dropdown: {
        height: 48,
        borderColor: '#E2E8F0',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: '#F8FAFC'
    }
});

export default PartnerPreferences;
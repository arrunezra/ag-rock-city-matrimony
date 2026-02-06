import { CloseIcon, Icon } from '@/components/ui/icon';
import { Box, Button, ButtonText, FormControl, FormControlError, FormControlErrorText, FormControlLabel, FormControlLabelText, Heading, HStack, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Spinner, Text, VStack } from '@/src/components/common/GluestackUI';
import { Check, Church, Languages, MapPin, MoonStar, Network, Users, Users2 } from '@/src/components/common/IconUI';
import { MOTHER_TONGUE_DATA, SUB_COMMUNITIES } from '@/src/utils/utils';
import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

import { Dropdown } from 'react-native-element-dropdown';

const { height } = Dimensions.get('window');

const EditReligionModal = ({
    isOpen,
    onClose,
    formData,
    updateForm,
    onSave,
    isSaving,
    validationTriggered,
    data: { RELIGION_DATA, COMMUNITIES, LIVINGIN }
}: any) => {
    return (
        // <Modal isOpen={isOpen} onClose={onClose} size="full">
        //     <ModalBackdrop />
        //     <ModalContent className="bg-white flex-1">

        //         {/* Header with Close Button */}
        //         <ModalHeader className="px-6 pt-10 pb-0 justify-end border-0">
        //             <ModalCloseButton className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200">
        //                 <Icon as={CloseIcon} size="md" className="text-typography-900" />
        //             </ModalCloseButton>
        //         </ModalHeader>

        //         <ModalBody className="flex-1 p-0">
        //             <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
        //                 <VStack space="xl">

        //                     {/* 2026 Futuristic Icon Section */}
        //                     <VStack className="items-center mb-8">
        //                         <Box className="relative w-20 h-20 items-center justify-center">
        //                             {/* Purple/Indigo Glow for Community Feel */}
        //                             <Box className="absolute w-16 h-16 rounded-full bg-indigo-500 blur-2xl opacity-20" />

        //                             <Box
        //                                 className="w-16 h-16 rounded-[22px] items-center justify-center bg-indigo-50 border-b-4 border-indigo-200 shadow-sm"
        //                                 style={{ transform: [{ rotate: '-6deg' }] }}
        //                             >
        //                                 <Icon
        //                                     as={Users}
        //                                     size='lg'
        //                                     className="text-indigo-600"
        //                                     style={{ transform: [{ rotate: '6deg' }] }}
        //                                 />
        //                             </Box>
        //                         </Box>

        //                         <Heading size="xl" className="mt-4 tracking-tight text-center text-typography-900">
        //                             Religion Details
        //                         </Heading>
        //                         <Text size="xs" className="text-typography-500 text-center mt-1 px-10">
        //                             Update your religious and community background to improve your matches.
        //                         </Text>
        //                     </VStack>

        //                     {/* Religion Dropdown */}
        //                     <FormControl isInvalid={validationTriggered && !formData.religion}>
        //                         <FormControlLabel className="mb-2">
        //                             <FormControlLabelText size="sm" className="font-bold">Select Religion</FormControlLabelText>
        //                         </FormControlLabel>
        //                         <Dropdown
        //                             style={[
        //                                 styles.dropdown,
        //                                 { height: 56, borderRadius: 16, paddingHorizontal: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB' },
        //                                 (validationTriggered && !formData.religion) && { borderColor: '#DC2626' }
        //                             ]}
        //                             placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
        //                             selectedTextStyle={{ color: '#111827', fontSize: 14 }}
        //                             data={RELIGION_DATA}
        //                             labelField="label"
        //                             valueField="value"
        //                             placeholder="Select Religion"
        //                             value={formData.religion}
        //                             onChange={item => updateForm('religion', item.value)}
        //                             renderLeftIcon={() => (
        //                                 <Icon as={Church} size="sm" className="mr-2 text-typography-400" />
        //                             )}
        //                         />
        //                         <FormControlError>
        //                             <FormControlErrorText>Religion is required</FormControlErrorText>
        //                         </FormControlError>
        //                     </FormControl>

        //                     {/* Community Dropdown */}
        //                     {formData.religion && (
        //                         <FormControl isInvalid={validationTriggered && !formData.community}>
        //                             <FormControlLabel className="mb-2">
        //                                 <FormControlLabelText size="sm" className="font-bold">Select Community</FormControlLabelText>
        //                             </FormControlLabel>
        //                             <Dropdown
        //                                 style={[
        //                                     styles.dropdown,
        //                                     { height: 56, borderRadius: 16, paddingHorizontal: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB' },
        //                                     (validationTriggered && !formData.community) && { borderColor: '#DC2626' }
        //                                 ]}
        //                                 placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
        //                                 selectedTextStyle={{ color: '#111827', fontSize: 14 }}
        //                                 data={COMMUNITIES}
        //                                 labelField="label"
        //                                 valueField="value"
        //                                 placeholder="Select Community"
        //                                 value={formData.community}
        //                                 onChange={item => updateForm('community', item.value)}
        //                                 renderLeftIcon={() => (
        //                                     <Icon as={Users} size="sm" className="mr-2 text-typography-400" />
        //                                 )}
        //                             />
        //                             <FormControlError>
        //                                 <FormControlErrorText>Community is required</FormControlErrorText>
        //                             </FormControlError>
        //                         </FormControl>
        //                     )}

        //                     {/* Living In Dropdown */}
        //                     {formData.community && (
        //                         <FormControl isInvalid={validationTriggered && !formData.livingIn}>
        //                             <FormControlLabel className="mb-2">
        //                                 <FormControlLabelText size="sm" className="font-bold">Select Living In</FormControlLabelText>
        //                             </FormControlLabel>
        //                             <Dropdown
        //                                 style={[
        //                                     styles.dropdown,
        //                                     { height: 56, borderRadius: 16, paddingHorizontal: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB' },
        //                                     (validationTriggered && !formData.livingIn) && { borderColor: '#DC2626' }
        //                                 ]}
        //                                 placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
        //                                 selectedTextStyle={{ color: '#111827', fontSize: 14 }}
        //                                 data={LIVINGIN}
        //                                 labelField="label"
        //                                 valueField="value"
        //                                 placeholder="Select Living In"
        //                                 value={formData.livingIn}
        //                                 onChange={item => updateForm('livingIn', item.value)}
        //                                 renderLeftIcon={() => (
        //                                     <Icon as={MapPin} size="sm" className="mr-2 text-typography-400" />
        //                                 )}
        //                             />
        //                             <FormControlError>
        //                                 <FormControlErrorText>Living location is required</FormControlErrorText>
        //                             </FormControlError>
        //                         </FormControl>
        //                     )}

        //                 </VStack>
        //             </ScrollView>
        //         </ModalBody>

        //         {/* Footer */}
        //         <ModalFooter className="p-6 border-t border-outline-100 bg-white">
        //             <HStack className="w-full gap-3">
        //                 <Button variant="outline" action="secondary" onPress={onClose} className="flex-1 rounded-2xl h-14 border-outline-300">
        //                     <ButtonText className="text-typography-600 font-bold">Cancel</ButtonText>
        //                 </Button>
        //                 <Button onPress={onSave} isDisabled={isSaving} className="flex-1 rounded-2xl h-14 bg-primary-600 shadow-lg shadow-primary-200">
        //                     {isSaving ? <Spinner color="white" /> : <ButtonText className="text-white font-bold text-lg">Update Details</ButtonText>}
        //                 </Button>
        //             </HStack>
        //         </ModalFooter>
        //     </ModalContent>
        // </Modal>

        <Modal isOpen={isOpen} onClose={onClose} size="full">
            <ModalBackdrop />
            <ModalContent className="bg-white flex-1">

                {/* Header with Close Button */}
                <ModalHeader className="px-6 pt-10 pb-0 justify-end border-0">
                    <ModalCloseButton className="h-10 w-10 items-center justify-center rounded-full bg-slate-100 active:bg-slate-200">
                        <Icon as={CloseIcon} size="md" className="text-typography-900" />
                    </ModalCloseButton>
                </ModalHeader>

                <ModalBody className="flex-1 p-0">
                    <ScrollView className="px-6 py-4" showsVerticalScrollIndicator={false}>
                        <VStack space="xl">

                            {/* 2026 Futuristic Icon Section */}
                            <VStack className="items-center mb-8">
                                <Box className="relative w-20 h-20 items-center justify-center">
                                    <Box className="absolute w-16 h-16 rounded-full bg-indigo-500 blur-2xl opacity-20" />
                                    <Box
                                        className="w-16 h-16 rounded-[22px] items-center justify-center bg-indigo-50 border-b-4 border-indigo-200 shadow-sm"
                                        style={{ transform: [{ rotate: '-6deg' }] }}
                                    >
                                        <Icon
                                            as={MoonStar} // Matched to Religion Card
                                            size='lg'
                                            className="text-indigo-600"
                                            style={{ transform: [{ rotate: '6deg' }] }}
                                        />
                                    </Box>
                                </Box>

                                <Heading size="xl" className="mt-4 tracking-tight text-center text-typography-900">
                                    Religion Details
                                </Heading>
                                <Text size="xs" className="text-typography-500 text-center mt-1 px-10">
                                    Update your religious and community background to improve your matches.
                                </Text>
                            </VStack>

                            {/* 1. Religion Dropdown */}
                            <FormControl isInvalid={validationTriggered && !formData.religion}>
                                <FormControlLabel className="mb-2">
                                    <FormControlLabelText size="sm" className="font-bold">Select Religion</FormControlLabelText>
                                </FormControlLabel>
                                <Dropdown
                                    style={[styles.dropdown, (validationTriggered && !formData.religion) && { borderColor: '#DC2626' }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    data={RELIGION_DATA}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Religion"
                                    value={formData.religion}
                                    onChange={item => updateForm('religion', item.value)}
                                    renderLeftIcon={() => <Icon as={MoonStar} size="sm" className="mr-2 text-typography-400" />}
                                />
                            </FormControl>

                            {/* 2. Mother Tongue Dropdown */}
                            <FormControl isInvalid={validationTriggered && !formData.motherTongue}>
                                <FormControlLabel className="mb-2">
                                    <FormControlLabelText size="sm" className="font-bold">Mother Tongue</FormControlLabelText>
                                </FormControlLabel>
                                <Dropdown
                                    style={[styles.dropdown, (validationTriggered && !formData.motherTongue) && { borderColor: '#DC2626' }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    data={MOTHER_TONGUE_DATA} // Ensure this array exists
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Language"
                                    value={formData.motherTongue}
                                    onChange={item => updateForm('motherTongue', item.value)}
                                    renderLeftIcon={() => <Icon as={Languages} size="sm" className="mr-2 text-typography-400" />}
                                />
                            </FormControl>

                            {/* 3. Community Dropdown */}
                            <FormControl isInvalid={validationTriggered && !formData.community}>
                                <FormControlLabel className="mb-2">
                                    <FormControlLabelText size="sm" className="font-bold">Community</FormControlLabelText>
                                </FormControlLabel>
                                <Dropdown
                                    style={[styles.dropdown, (validationTriggered && !formData.community) && { borderColor: '#DC2626' }]}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    data={COMMUNITIES}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Community"
                                    value={formData.community}
                                    onChange={item => updateForm('community', item.value)}
                                    renderLeftIcon={() => <Icon as={Users2} size="sm" className="mr-2 text-typography-400" />}
                                />
                            </FormControl>

                            {/* 4. Sub Community Dropdown */}
                            <FormControl>
                                <FormControlLabel className="mb-2">
                                    <FormControlLabelText size="sm" className="font-bold">Sub Community (Optional)</FormControlLabelText>
                                </FormControlLabel>
                                <Dropdown
                                    mode='modal'
                                    style={styles.dropdown}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    data={SUB_COMMUNITIES} // Ensure this array exists
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Sub Community"
                                    value={formData.subCommunity}
                                    onChange={item => updateForm('subCommunity', item.value)}
                                    renderLeftIcon={() => <Icon as={Network} size="sm" className="mr-2 text-typography-400" />}
                                />
                            </FormControl>

                            {/* CASTE NO BAR CHECKBOX CARD */}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => updateForm('isCasteNoBar', !formData.isCasteNoBar)}
                                className={`mt-2 p-4 rounded-2xl border-2 flex-row items-center ${formData.isCasteNoBar ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 bg-slate-50/50'
                                    }`}
                            >
                                <Box className={`w-6 h-6 rounded-lg items-center justify-center border-2 mr-3 ${formData.isCasteNoBar ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-200'
                                    }`}>
                                    {formData.isCasteNoBar && <Icon as={Check} size='lg' className="text-white" />}
                                </Box>
                                <VStack className="flex-1">
                                    <Text className={`text-sm font-bold ${formData.isCasteNoBar ? 'text-blue-700' : 'text-typography-900'}`}>
                                        Caste No Bar
                                    </Text>
                                    <Text size="xs" className="text-typography-500">
                                        Open to partner matches from all communities
                                    </Text>
                                </VStack>
                            </TouchableOpacity>

                        </VStack>
                        {/* Spacer for scroll visibility above footer */}
                        <Box className="h-20" />
                    </ScrollView>
                </ModalBody>

                {/* Footer */}
                <ModalFooter className="p-6 border-t border-outline-100 bg-white">
                    <HStack className="w-full gap-3">
                        <Button variant="outline" action="secondary" onPress={onClose} className="flex-1 rounded-2xl h-14 border-outline-300">
                            <ButtonText className="text-typography-600 font-bold">Cancel</ButtonText>
                        </Button>
                        <Button onPress={onSave} isDisabled={isSaving} className="flex-1 rounded-2xl h-14 bg-primary-600 shadow-lg shadow-primary-200">
                            {isSaving ? <Spinner color="white" /> : <ButtonText className="text-white font-bold text-lg">Update Details</ButtonText>}
                        </Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        borderColor: '#E5E7EB', // gray-200
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: 'white',
    },
    dropdownContainer: {
        maxHeight: height * 0.4,
        borderRadius: 12,
    },
    placeholderStyle: {
        color: '#9CA3AF', // Gray-400
        fontSize: 14,
    },
    errorBorder: {
        borderColor: '#EF4444', // red-500
    },
    selectedTextStyle: {
        color: '#111827', // Gray-900
        fontSize: 14,
        fontWeight: '500',
    }
});

export default EditReligionModal;
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Box, Button, ButtonText, FormControl, FormControlError, FormControlErrorText, FormControlLabel, FormControlLabelText, Heading, HStack, Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Spinner, Text, VStack } from '@/src/components/common/GluestackUI';
import { Church, MapPin, Users } from '@/src/components/common/IconUI';
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
                                    {/* Purple/Indigo Glow for Community Feel */}
                                    <Box className="absolute w-16 h-16 rounded-full bg-indigo-500 blur-2xl opacity-20" />

                                    <Box
                                        className="w-16 h-16 rounded-[22px] items-center justify-center bg-indigo-50 border-b-4 border-indigo-200 shadow-sm"
                                        style={{ transform: [{ rotate: '-6deg' }] }}
                                    >
                                        <Icon
                                            as={Users}
                                            size='xl'
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

                            {/* Religion Dropdown */}
                            <FormControl isInvalid={validationTriggered && !formData.religion}>
                                <FormControlLabel className="mb-2">
                                    <FormControlLabelText size="sm" className="font-bold">Select Religion</FormControlLabelText>
                                </FormControlLabel>
                                <Dropdown
                                    style={[
                                        styles.dropdown,
                                        { height: 56, borderRadius: 16, paddingHorizontal: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB' },
                                        (validationTriggered && !formData.religion) && { borderColor: '#DC2626' }
                                    ]}
                                    placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
                                    selectedTextStyle={{ color: '#111827', fontSize: 14 }}
                                    data={RELIGION_DATA}
                                    labelField="label"
                                    valueField="value"
                                    placeholder="Select Religion"
                                    value={formData.religion}
                                    onChange={item => updateForm('religion', item.value)}
                                    renderLeftIcon={() => (
                                        <Icon as={Church} size="sm" className="mr-2 text-typography-400" />
                                    )}
                                />
                                <FormControlError>
                                    <FormControlErrorText>Religion is required</FormControlErrorText>
                                </FormControlError>
                            </FormControl>

                            {/* Community Dropdown */}
                            {formData.religion && (
                                <FormControl isInvalid={validationTriggered && !formData.community}>
                                    <FormControlLabel className="mb-2">
                                        <FormControlLabelText size="sm" className="font-bold">Select Community</FormControlLabelText>
                                    </FormControlLabel>
                                    <Dropdown
                                        style={[
                                            styles.dropdown,
                                            { height: 56, borderRadius: 16, paddingHorizontal: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB' },
                                            (validationTriggered && !formData.community) && { borderColor: '#DC2626' }
                                        ]}
                                        placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
                                        selectedTextStyle={{ color: '#111827', fontSize: 14 }}
                                        data={COMMUNITIES}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Community"
                                        value={formData.community}
                                        onChange={item => updateForm('community', item.value)}
                                        renderLeftIcon={() => (
                                            <Icon as={Users} size="sm" className="mr-2 text-typography-400" />
                                        )}
                                    />
                                    <FormControlError>
                                        <FormControlErrorText>Community is required</FormControlErrorText>
                                    </FormControlError>
                                </FormControl>
                            )}

                            {/* Living In Dropdown */}
                            {formData.community && (
                                <FormControl isInvalid={validationTriggered && !formData.livingIn}>
                                    <FormControlLabel className="mb-2">
                                        <FormControlLabelText size="sm" className="font-bold">Select Living In</FormControlLabelText>
                                    </FormControlLabel>
                                    <Dropdown
                                        style={[
                                            styles.dropdown,
                                            { height: 56, borderRadius: 16, paddingHorizontal: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E7EB' },
                                            (validationTriggered && !formData.livingIn) && { borderColor: '#DC2626' }
                                        ]}
                                        placeholderStyle={{ color: '#9CA3AF', fontSize: 14 }}
                                        selectedTextStyle={{ color: '#111827', fontSize: 14 }}
                                        data={LIVINGIN}
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Living In"
                                        value={formData.livingIn}
                                        onChange={item => updateForm('livingIn', item.value)}
                                        renderLeftIcon={() => (
                                            <Icon as={MapPin} size="sm" className="mr-2 text-typography-400" />
                                        )}
                                    />
                                    <FormControlError>
                                        <FormControlErrorText>Living location is required</FormControlErrorText>
                                    </FormControlError>
                                </FormControl>
                            )}

                        </VStack>
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
    errorBorder: {
        borderColor: '#EF4444', // red-500
    }
});

export default EditReligionModal;
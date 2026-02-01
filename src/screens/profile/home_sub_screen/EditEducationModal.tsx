import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { GraduationCap, School, X, BookOpen } from 'lucide-react-native';
import {
    Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Heading, Text, VStack, Box,
    FormControl, FormControlLabel, FormControlLabelText, Button, ButtonText,
    Input, InputField, ScrollView
} from '@/src/components/common/GluestackUI';
import { Icon } from '@/components/ui/icon';
import { AnimateError } from '../../common/AnimateError';

const { height } = Dimensions.get('window');

const EditEducationModal = ({
    isOpen,
    onClose,
    formData,
    updateForm,
    QUALIFICATIONS,
    validationTriggered,
    handleSave,
    isSaving
}: any) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="full">
            <ModalBackdrop />
            <ModalContent className="bg-white flex-1">
                <ModalHeader className="px-6 pt-10 pb-0 justify-end border-0">
                    <ModalCloseButton className="h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                        <Icon as={X} size="md" className="text-slate-600" />
                    </ModalCloseButton>
                </ModalHeader>

                <ModalBody className="flex-1 p-0">
                    <ScrollView className="px-6" contentContainerStyle={{ paddingBottom: 40 }}>
                        <VStack space="xl">
                            <VStack className="items-center mb-6">
                                <Box className="w-16 h-16 rounded-[22px] items-center justify-center bg-violet-50 border-b-4 border-violet-200">
                                    <Icon as={GraduationCap} size='xl' className="text-violet-600" />
                                </Box>
                                <Heading size="xl" className="mt-4 tracking-tight">Education Details</Heading>
                                <Text size="sm" className="text-typography-500 text-center px-4">
                                    Tell us about your academic achievements
                                </Text>
                            </VStack>

                            <VStack space="xl">
                                {/* Qualification Dropdown */}
                                <FormControl isInvalid={validationTriggered && !formData.qualification}>
                                    <FormControlLabel className="mb-2">
                                        <FormControlLabelText size="sm" className="font-bold">Highest Qualification</FormControlLabelText>
                                    </FormControlLabel>
                                    <Dropdown
                                        style={[
                                            styles.dropdown,
                                            (validationTriggered && !formData.qualification) && { borderColor: '#EF4444' }
                                        ]}
                                        data={QUALIFICATIONS || []}
                                        mode="modal"
                                        labelField="label"
                                        valueField="value"
                                        placeholder="Select Degree"
                                        selectedTextStyle={styles.selectedText}
                                        placeholderStyle={styles.placeholder}
                                        value={formData.qualification}
                                        renderLeftIcon={() => <Icon as={BookOpen} size="sm" className="mr-2 text-violet-500" />}
                                        renderItem={(item) => (
                                            <View className={`px-4 py-4 ${item.isHeader ? 'bg-slate-50 border-b border-slate-100' : 'bg-white'}`}>
                                                <Text className={`${item.isHeader ? 'text-xs font-bold text-violet-600 uppercase tracking-widest' : 'text-base text-slate-800 ml-2'}`}>
                                                    {item.label}
                                                </Text>
                                            </View>
                                        )}
                                        onChange={item => {
                                            if (item.isHeader) return;
                                            updateForm('qualification', item.value);
                                        }}
                                    />
                                </FormControl>

                                {/* College Input */}
                                <FormControl isInvalid={validationTriggered && !formData.college}>
                                    <FormControlLabel className="mb-2">
                                        <FormControlLabelText size="sm" className="font-bold">College / University Name</FormControlLabelText>
                                    </FormControlLabel>
                                    <Input variant="outline" className="h-14 rounded-2xl bg-slate-50 border-slate-200 focus:border-violet-500">
                                        <Box className="pl-4 justify-center">
                                            <Icon as={School} size="sm" className="text-violet-500" />
                                        </Box>
                                        <InputField
                                            placeholder="e.g. Stanford University"
                                            value={formData.college}
                                            onChangeText={(v) => updateForm('college', v)}
                                            className="text-sm"
                                        />
                                    </Input>
                                    <AnimateError isVisible={validationTriggered && !formData.college}>
                                        College name is required
                                    </AnimateError>
                                </FormControl>
                            </VStack>
                        </VStack>
                    </ScrollView>
                </ModalBody>

                <ModalFooter className="p-6">
                    <Button
                        onPress={handleSave}
                        isDisabled={isSaving}
                        className="w-full h-14 bg-violet-600 rounded-2xl shadow-lg shadow-violet-200"
                    >
                        <ButtonText className="font-bold text-white">Save Education</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

const styles = {
    dropdown: {
        height: 56,
        borderRadius: 16,
        paddingHorizontal: 16,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    dropdownContainer: {
        maxHeight: height * 0.65,
        borderRadius: 24,
        marginTop: 8,
        overflow: 'hidden',
        borderWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    selectedText: { fontSize: 14, color: '#1E293B' },
    placeholder: { fontSize: 14, color: '#94A3B8' }
};

export default EditEducationModal;
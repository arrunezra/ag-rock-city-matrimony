import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import {
    Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Heading, Text, VStack, HStack, Box,
    FormControl, FormControlLabel, FormControlLabelText,
    Button, ButtonText, Spinner, Input, InputField
} from '@/src/components/common/GluestackUI';
import { Dropdown } from 'react-native-element-dropdown';
import { GraduationCap, School, Briefcase, Building2, Banknote, UserCog, Icon, ChevronLeftIcon, CloseIcon } from '@/src/components/common/IconUI';
import FuturisticDropdown from '@/src/components/common/FuturisticDropdown';

export const EducationDetailsModal = ({ isOpen, onClose, formData, updateForm, onSave, isSaving }: any) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [validationTriggered, setValidationTriggered] = useState(false);

    const handleNext = () => setCurrentStep(2);
    const handleBack = () => setCurrentStep(1);

    return (
        <Modal isOpen={isOpen} onClose={() => { onClose(); setCurrentStep(1); }} size="full">
            <ModalBackdrop />
            <ModalContent className="bg-white flex-1">

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
                                    <Box className="w-16 h-16 rounded-[22px] bg-violet-50 items-center justify-center border-b-4 border-violet-200">
                                        <Icon as={GraduationCap} size='lg' className="text-violet-600" />
                                    </Box>
                                    <Heading size="xl" className="mt-4">Education</Heading>
                                    <Text size="xs" className="text-center text-slate-500">Step 1 of 2: Academic Background</Text>
                                </VStack>

                                <FormControl>
                                    <FormControlLabel className="mb-2"><FormControlLabelText className="font-bold">Highest Qualification</FormControlLabelText></FormControlLabel>
                                    <FuturisticDropdown
                                        data={[{ label: 'B.E / B.Tech', value: 'B.E / B.Tech' }]}
                                        value={formData.height}
                                        onChange={(item: any) => updateForm('qualification', item.value)}
                                        placeholder="Select "
                                        icon={{ icon: GraduationCap, color: 'text-cyan-500' }}
                                        search={false}
                                        isInvalid={validationTriggered && !formData.height}
                                    />

                                    <Dropdown
                                        style={styles.dropdown}
                                        placeholderStyle={styles.placeholderStyle}
                                        data={[{ label: 'B.E / B.Tech', value: 'B.E / B.Tech' }]}
                                        labelField="label" valueField="value" placeholder="Select Degree"
                                        value={formData.qualification} onChange={item => updateForm('qualification', item.value)}
                                        renderLeftIcon={() => <Icon as={GraduationCap} size="sm" className="mr-2 text-violet-500" />}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormControlLabel className="mb-2"><FormControlLabelText className="font-bold">College(s) Attended</FormControlLabelText></FormControlLabel>
                                    <Input style={styles.inputContainer}>
                                        <Box className="pl-4 justify-center"><Icon as={School} size="sm" className="text-violet-500" /></Box>
                                        <InputField
                                            placeholder="Enter college name"
                                            value={formData.college}
                                            onChangeText={(text) => updateForm('college', text)}
                                        />
                                    </Input>
                                </FormControl>
                            </VStack>
                        ) : (
                            <VStack space="xl">
                                <VStack className="items-center mb-6">
                                    <Box className="w-16 h-16 rounded-[22px] bg-violet-50 items-center justify-center border-b-4 border-violet-200">
                                        <Icon as={Briefcase} size='lg' className="text-violet-600" />
                                    </Box>
                                    <Heading size="xl" className="mt-4">Career Details</Heading>
                                    <Text size="xs" className="text-center text-slate-500">Step 2 of 2: Professional Info</Text>
                                </VStack>

                                <FormControl>
                                    <FormControlLabel className="mb-2"><FormControlLabelText className="font-bold">Working With</FormControlLabelText></FormControlLabel>
                                    <Dropdown style={styles.dropdown} data={[{ label: 'Private Company', value: 'Private Company' }]} labelField="label" valueField="value" placeholder="Select Sector" value={formData.workingWith} onChange={item => updateForm('workingWith', item.value)} renderLeftIcon={() => <Icon as={Building2} size="sm" className="mr-2 text-violet-500" />} />
                                </FormControl>

                                <FormControl>
                                    <FormControlLabel className="mb-2"><FormControlLabelText className="font-bold">Working As</FormControlLabelText></FormControlLabel>
                                    <Dropdown style={styles.dropdown} data={[{ label: 'Software Developer', value: 'Software Developer' }]} labelField="label" valueField="value" placeholder="Select Designation" value={formData.workingAs} onChange={item => updateForm('workingAs', item.value)} renderLeftIcon={() => <Icon as={UserCog} size="sm" className="mr-2 text-violet-500" />} />
                                </FormControl>

                                <FormControl>
                                    <FormControlLabel className="mb-2"><FormControlLabelText className="font-bold">Employer Name</FormControlLabelText></FormControlLabel>
                                    <Input style={styles.inputContainer}>
                                        <Box className="pl-4 justify-center"><Icon as={Briefcase} size="sm" className="text-violet-500" /></Box>
                                        <InputField placeholder="Company name" value={formData.employerName} onChangeText={(text) => updateForm('employerName', text)} />
                                    </Input>
                                </FormControl>

                                <FormControl>
                                    <FormControlLabel className="mb-2"><FormControlLabelText className="font-bold">Annual Income</FormControlLabelText></FormControlLabel>
                                    <Dropdown style={styles.dropdown} data={[{ label: '10-20 Lakhs', value: '10-20' }]} labelField="label" valueField="value" placeholder="Select Income Range" value={formData.annualIncome} onChange={item => updateForm('annualIncome', item.value)} renderLeftIcon={() => <Icon as={Banknote} size="sm" className="mr-2 text-violet-500" />} />
                                </FormControl>
                            </VStack>
                        )}
                        <Box className="h-20" />
                    </ScrollView>
                </ModalBody>

                <ModalFooter className="p-6 border-t border-outline-100">
                    {currentStep === 1 ? (
                        <Button onPress={handleNext} className="w-full rounded-2xl h-14 bg-violet-600 shadow-lg shadow-violet-200">
                            <ButtonText className="text-white font-bold">Continue to Career Details</ButtonText>
                        </Button>
                    ) : (
                        <HStack className="w-full gap-3">
                            <Button variant="outline" onPress={handleBack} className="flex-1 rounded-2xl h-14 border-outline-300">
                                <ButtonText className="text-typography-600 font-bold">Back</ButtonText>
                            </Button>
                            <Button onPress={onSave} isDisabled={isSaving} className="flex-1 rounded-2xl h-14 bg-violet-600">
                                {isSaving ? <Spinner color="white" /> : <ButtonText className="text-white font-bold">Update Profile</ButtonText>}
                            </Button>
                        </HStack>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

const styles = StyleSheet.create({
    dropdown: { height: 56, borderRadius: 16, paddingHorizontal: 16, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#E5E7EB', width: '100%' },
    inputContainer: { height: 56, borderRadius: 16, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row' },
    placeholderStyle: { color: '#9CA3AF', fontSize: 14 },
});
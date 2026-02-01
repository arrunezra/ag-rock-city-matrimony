import React from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { Sparkles, X, Check } from 'lucide-react-native';
import {
    Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Heading, Text, VStack, HStack, Box,
    Button, ButtonText
} from '@/src/components/common/GluestackUI';
import { Icon } from '@/components/ui/icon';
import { HOBBIES } from '@/src/utils/utils';

const HOBBY_OPTIONS = ['Cooking', 'Dancing', 'Music', 'Travel', 'Cricket', 'Gym', 'Reading', 'Photography', 'Gaming', 'Yoga', 'Art', 'Movies'];

const EditHobbiesModal = ({
    isOpen,
    onClose,
    selectedHobbies,
    toggleHobby,
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
                    <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
                        <VStack space="xl">
                            <VStack className="items-center mb-4">
                                <Box className="w-16 h-16 rounded-[22px] items-center justify-center bg-emerald-50 border-b-4 border-emerald-200">
                                    <Icon as={Sparkles} size='xl' className="text-emerald-600" />
                                </Box>
                                <Heading size="xl" className="mt-4">Interests</Heading>
                                <Text size="sm" className="text-typography-500">
                                    {selectedHobbies.length} {selectedHobbies.length === 1 ? 'hobby' : 'hobbies'} selected
                                </Text>
                            </VStack>

                            {/* HOBBY GRID */}
                            <HStack className="flex-wrap justify-center gap-3">
                                {HOBBIES.sort().map((hobby: any, index: number) => {
                                    const isSelected = selectedHobbies.includes(hobby);
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            activeOpacity={0.7}
                                            onPress={() => toggleHobby(hobby)}
                                            className={`px-5 py-3 rounded-2xl border-2 flex-row items-center space-x-2 ${isSelected
                                                ? 'bg-emerald-600 border-emerald-600'
                                                : 'bg-white border-slate-100 shadow-sm'
                                                }`}
                                        >
                                            {isSelected && <Icon as={Check} size='lg' className="text-white mr-2" />}
                                            <Text className={`font-bold ${isSelected ? 'text-white' : 'text-slate-600'}`}>
                                                {hobby}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </HStack>
                        </VStack>
                    </ScrollView>
                </ModalBody>

                <ModalFooter className="p-6">
                    <Button
                        onPress={handleSave}
                        isDisabled={isSaving}
                        className="w-full h-14 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-100"
                    >
                        <ButtonText className="font-bold">Save Interests</ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditHobbiesModal;
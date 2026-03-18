import React, { useEffect, useState } from 'react';
import {
    Modal, ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter,
    Heading, Button, ButtonText, VStack, Text, Box,
    HStack,
    Checkbox,
    CheckboxIndicator,
    CheckboxLabel,
    CheckboxIcon
} from "@/src/components/common/GluestackUI";
import { Dropdown } from 'react-native-element-dropdown';
import { CloseIcon, Icon } from '@/components/ui/icon';
import { Slider } from '@miblanchard/react-native-slider';
import { Check, ShieldCheckIcon } from 'lucide-react-native';

const EditPreferenceModal = ({ isOpen, onClose, fieldType, currentData, onSave, lookups }: any) => {
    console.log('lookups', lookups?.marital_status)
    // 1. Declare ALL hooks at the top level
    const [tempValue, setTempValue] = useState<any>(null);
    // 2. Synchronize the local state whenever the modal opens or the field changes
    useEffect(() => {
        if (isOpen) {
            if (fieldType === 'age') {
                setTempValue([currentData.min_age, currentData.max_age]);
            } else if (fieldType === 'height') {
                setTempValue([parseFloat(currentData.min_height), parseFloat(currentData.max_height)]);
            } else if (fieldType === 'marital') {
                setTempValue(currentData.marital_status || []);
            }

            else {
                setTempValue(currentData);
            }
        }
    }, [isOpen, fieldType, currentData]);

    const handleApply = () => {
        console.log('fieldType==', fieldType)
        if (fieldType === 'age') {
            // Check for the 3-year minimum gap mentioned in your design
            if (tempValue[1] - tempValue[0] < 3) {
                // You could show a toast here
                return;
            }
            onSave('age', { min_age: tempValue[0], max_age: tempValue[1] });
        } else if (fieldType === 'height') {
            onSave('height', { min_height: tempValue[0].toString(), max_height: tempValue[1].toString() });
        } else {
            onSave(fieldType, tempValue);
        }


    };
    const renderAgeSlider = () => (
        <VStack space="xl" className="py-4">
            <Text size="md" className="text-slate-500 leading-6">
                Select a minimum age range of 3 years to get relevant matches
            </Text>

            <VStack space="xs">
                <Text size="xs" className="text-slate-400 font-medium uppercase">Selected age range</Text>
                <Heading size="xl" className="text-slate-900 font-bold">
                    {Math.floor(tempValue[0])} to {Math.floor(tempValue[1])}yrs
                </Heading>
            </VStack>

            <Box className="mt-10 px-2">
                <Slider
                    value={tempValue}
                    onValueChange={(val: any) => setTempValue(val)}
                    minimumValue={18}
                    maximumValue={50}
                    step={1}
                    minimumTrackTintColor="#008B9F"
                    maximumTrackTintColor="#E2E8F0"
                    thumbTintColor="#008B9F"
                    trackStyle={{ height: 4, borderRadius: 2 }}
                    thumbStyle={{ height: 26, width: 26, borderRadius: 13, backgroundColor: '#008B9F' }}
                    renderAboveThumbComponent={(index) => (
                        <Box className="bg-[#008B9F] px-2 py-1 rounded-md mb-2 items-center justify-center min-w-[35px]">
                            <Text className="text-white font-bold text-xs">
                                {Math.floor(tempValue[index])}
                            </Text>
                            {/* Downward Arrow */}
                            <Box
                                style={{
                                    position: 'absolute',
                                    bottom: -4,
                                    width: 8,
                                    height: 8,
                                    backgroundColor: '#008B9F',
                                    transform: [{ rotate: '45deg' }]
                                }}
                            />
                        </Box>
                    )}
                />
                <HStack className="justify-between mt-2">
                    <Text size="xs" className="text-slate-400 font-bold">18yrs</Text>
                    <Text size="xs" className="text-slate-400 font-bold">50yrs</Text>
                </HStack>
            </Box>
        </VStack>
    );
    const cmToFeetInch = (cm: number) => {
        const totalInches = cm / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        return `${feet}' ${inches}"`;
    };

    const renderHeight = () => {

        return (
            <VStack space="xl" className="py-4">
                <Text size="md" className="text-slate-500 leading-6">
                    Select a minimum height range of 6 inches to get relevant matches
                </Text>

                <VStack space="xs">
                    <Text size="xs" className="text-slate-400 font-medium uppercase">
                        Selected height range (ft/inch)
                    </Text>
                    <Heading size="xl" className="text-slate-900 font-bold">
                        {cmToFeetInch(tempValue[0])} to {cmToFeetInch(tempValue[1])}
                    </Heading>
                </VStack>

                <Box className="mt-10 px-2">
                    <Slider
                        value={tempValue}
                        onValueChange={(val: any) => setTempValue(val)}
                        minimumValue={135} // approx 4' 5"
                        maximumValue={213} // approx 7' 0"
                        step={1}
                        minimumTrackTintColor="#008B9F"
                        maximumTrackTintColor="#E2E8F0"
                        thumbTintColor="#008B9F"
                        trackStyle={{ height: 4, borderRadius: 2 }}
                        thumbStyle={{ height: 26, width: 26, borderRadius: 13 }}
                        renderAboveThumbComponent={(index) => (
                            <Box className="bg-[#008B9F] px-2 py-1 rounded-md mb-2 items-center justify-center min-w-[45px]">
                                <Text className="text-white font-bold text-[10px]">
                                    {cmToFeetInch(tempValue[index])}
                                </Text>
                                <Box className="absolute -bottom-1 w-2 h-2 bg-[#008B9F] rotate-45" />
                            </Box>
                        )}
                    />
                    <HStack className="justify-between mt-2">
                        <Text size="xs" className="text-slate-400 font-bold">4' 5"</Text>
                        <Text size="xs" className="text-slate-400 font-bold">7' 0"</Text>
                    </HStack>
                </Box>
            </VStack>
        );
    }
    // Logic to render different inputs based on the field clicked
    const renderFieldInput = () => {
        if (tempValue === null) return null;
        switch (fieldType) {
            case 'marital':
                return renderMaritalStatus();
            case 'age':
                return renderAgeSlider()
            case 'height':
                return renderHeight();
            default:
                return <Text>Loading settings...</Text>;
        }
    };
    const handleMaritalToggle = (value: string) => {
        if (value === 'Open to All') {
            setTempValue([]); // Empty array represents "Open to All"
            return;
        }

        let newList = [...tempValue];
        if (newList.includes(value)) {
            newList = newList.filter(i => i !== value);
        } else {
            newList.push(value);
        }
        setTempValue(newList);
    };
    const renderMaritalStatus = () => {
        const isOpenToAll = tempValue?.length === 0;

        return (
            <VStack space="lg" className="py-2">
                {/* Top Badge/Selection Display */}
                <Box className="flex-row flex-wrap gap-2 mb-2">
                    <Box className={`px-4 py-1.5 rounded-full border ${isOpenToAll ? 'bg-cyan-50 border-cyan-500' : 'bg-slate-50 border-slate-200'}`}>
                        <Text size="xs" className={isOpenToAll ? 'text-cyan-600 font-bold' : 'text-slate-500'}>
                            Open to All
                        </Text>
                    </Box>
                </Box>

                <Text size="sm" className="text-slate-400 font-bold mb-2">Preferences</Text>

                <VStack space="xl">
                    {/* Open to All Checkbox */}
                    <Checkbox
                        value="Open to All"
                        isChecked={isOpenToAll}
                        onChange={() => handleMaritalToggle('Open to All')}
                        size="lg"
                        aria-label="Open to All"
                    >
                        <CheckboxIndicator className="rounded-md border-slate-300 data-[checked=true]:bg-cyan-600 data-[checked=true]:border-cyan-600">
                            <CheckboxIcon as={Check} className="text-white" />
                        </CheckboxIndicator>
                        <CheckboxLabel className="ml-3 text-slate-700 font-medium">Open to All</CheckboxLabel>
                    </Checkbox>

                    {lookups?.marital_status.map((opt: any, index: number) => (
                        <Checkbox
                            key={index}
                            value={opt.value}
                            isChecked={tempValue?.includes(opt.value)}
                            onChange={() => handleMaritalToggle(opt.value)}
                            size="lg"
                            aria-label={opt.label}
                        >
                            <CheckboxIndicator className="rounded-md border-slate-300 data-[checked=true]:bg-cyan-600 data-[checked=true]:border-cyan-600">
                                <CheckboxIcon as={Check} className="text-white" />
                            </CheckboxIndicator>
                            <CheckboxLabel className="ml-3 text-slate-700 font-medium">{opt.label}</CheckboxLabel>
                        </Checkbox>
                    ))}
                </VStack>
            </VStack>
        );
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <ModalBackdrop />
            <ModalContent className="rounded-t-3xl pb-6">
                <ModalHeader className="border-b border-slate-100 p-4">
                    <Heading size="md">Edit {fieldType?.charAt(0).toUpperCase() + fieldType?.slice(1)}</Heading>
                    <Button variant="link" onPress={onClose} className="p-0">
                        <Icon as={CloseIcon} />
                    </Button>
                </ModalHeader>

                <ModalBody className="py-6 px-4">
                    {renderFieldInput()}
                </ModalBody>

                <ModalFooter>
                    <Button
                        className="w-full bg-rose-600 rounded-xl h-12"
                        onPress={() => handleApply()}
                    >
                        <ButtonText>Submit </ButtonText>
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditPreferenceModal;
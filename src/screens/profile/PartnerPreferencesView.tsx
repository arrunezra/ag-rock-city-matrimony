import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import {
    VStack, HStack, Text, Box, Heading, Center
} from '@/src/components/common/GluestackUI';
import {
    Calendar, Ruler, Users, Baby,
    Book, Globe, MapPin,
    ChevronRightIcon,
    User2Icon,
    GraduationCap,
    Briefcase,
    Banknote
} from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

const PreferenceRow = ({ icon: IconComponent, label, value, color, onPress }: any) => (
    <TouchableOpacity onPress={onPress}>
        <HStack className="px-4 py-4 items-center justify-between border-b border-slate-50 last:border-b-0">
            <HStack space="md" className="items-center flex-1">
                <Box className={`w-10 h-10 rounded-full items-center justify-center ${color}`}>
                    <Icon as={IconComponent} size="sm" className="text-white" />
                </Box>
                <VStack>
                    <Text size="xs" className="text-typography-500">{label}</Text>
                    <Text size="md" className="font-semibold text-typography-900">
                        {value || "Open to All"}
                    </Text>
                </VStack>
            </HStack>
            <Icon as={ChevronRightIcon} className="text-slate-300" size="sm" />
        </HStack>
    </TouchableOpacity>
);

const SectionHeader = ({ title }: { title: string }) => (
    <Box className="px-4 pt-6 pb-2">
        <Heading size="md" className="text-slate-900">{title}</Heading>
    </Box>
);

const PartnerPreferencesView = ({ data, onEditField }: any) => {

    return (
        <ScrollView className="bg-slate-50 flex-1">
            <VStack space="sm" className="pb-10">

                {/* Header */}
                <Center className="py-8 px-6">
                    <Heading size="lg" className="text-center">Your Partner Preferences</Heading>
                    <Text size="sm" className="text-center text-slate-500 mt-2 px-4">
                        You will see Matches based on the Preferences you have set
                    </Text>
                    <Text size="xs" className="italic text-slate-400 mt-6">
                        Tap on the field to edit
                    </Text>
                </Center>

                {/* --- BASIC DETAILS --- */}
                <Box className="mx-4 bg-white rounded-3xl shadow-sm overflow-hidden">
                    <SectionHeader title="Basic Details" />
                    <PreferenceRow
                        icon={Calendar} color="bg-green-500"
                        label="Age Range" value={`${data.min_age} to ${data.max_age}`}
                        onPress={() => onEditField('age')}
                    />
                    <PreferenceRow
                        icon={Ruler} color="bg-green-500"
                        label="Height Range" value={`${data.min_height} to ${data.max_height}`}
                        onPress={() => onEditField('height')}
                    />
                    <PreferenceRow
                        icon={Users} color="bg-green-500"
                        label="Marital Status" value={data.marital_status}
                        onPress={() => onEditField('marital')}
                    />
                    <PreferenceRow
                        icon={Baby} color="bg-green-500"
                        label="Profile with Children" value={data.children}
                        onPress={() => onEditField('children')}
                    />
                </Box>

                {/* --- COMMUNITY --- */}
                <Box className="mx-4 mt-4 bg-white rounded-3xl shadow-sm overflow-hidden">
                    <SectionHeader title="Community" />
                    <PreferenceRow
                        icon={Book} color="bg-orange-500"
                        label="Religion" value={data.religions}
                        onPress={() => onEditField('religion')}
                    />
                    <PreferenceRow
                        icon={User2Icon} color="bg-orange-500"
                        label="Community" value={data.communities}
                        onPress={() => onEditField('community')}
                    />
                    <PreferenceRow
                        icon={Globe} color="bg-orange-500"
                        label="Mother Tongue" value={data.mother_tongues}
                        onPress={() => onEditField('language')}
                    />
                </Box>

                {/* --- PROFESSIONAL DETAILS --- */}
                <Box className="mx-4 mt-4 bg-white rounded-3xl shadow-sm overflow-hidden">
                    <SectionHeader title="Professional Details" />
                    <PreferenceRow
                        icon={GraduationCap}
                        color="bg-cyan-600"
                        label="Qualification"
                        value={data.qualifications || "Open to All"}
                        onPress={() => onEditField('qualification')}
                    />
                    <PreferenceRow
                        icon={Briefcase}
                        color="bg-cyan-600"
                        label="Working with"
                        value={data.working_with || "Open to All"}
                        onPress={() => onEditField('working_with')}
                    />
                    <PreferenceRow
                        icon={Banknote}
                        color="bg-cyan-600"
                        label="Annual Income"
                        value={data.income || "Open to All"}
                        onPress={() => onEditField('income')}
                    />
                </Box>
                {/* --- LOCATION --- */}
                <Box className="mx-4 mt-4 bg-white rounded-3xl shadow-sm overflow-hidden">
                    <SectionHeader title="Location" />
                    <PreferenceRow
                        icon={Globe} color="bg-purple-500"
                        label="Country living in" value={data.country}
                        onPress={() => onEditField('location')}
                    />
                    <PreferenceRow
                        icon={MapPin} color="bg-purple-500"
                        label="State living in" value={data.state}
                        onPress={() => onEditField('location')}
                    />
                </Box>

            </VStack>
        </ScrollView>
    );
};

export default PartnerPreferencesView;
import React, { useState, useEffect } from 'react';
import { FlatList, ScrollView, Alert, TouchableOpacity, Linking, Image } from 'react-native';
import {
    Box, VStack, HStack, Input, InputField, Button, ButtonText, Text, Heading, Spinner,
    FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText, Select, SelectTrigger,
    SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectItem, Modal,
    ModalBackdrop, ModalContent, ModalHeader, ModalBody, ModalFooter, Fab, FabIcon,
    BadgeText,
    Badge,
    Avatar,
    AvatarFallbackText,
    AvatarImage
} from '@/src/components/common/GluestackUI';
import api from '@/src/api/api';
import { AddIcon } from '@/src/components/common/IconUI';
const denominations = ["Baptist", "Catholic", "Pentecostal", "Methodist", "Anglican"];
const statuses = ["Active", "Inactive", "Merged", "Closed"];
import ImagePicker from 'react-native-image-crop-picker';
import StaffImageCropView from '@/src/components/common/StaffImageCropView';

export default function ChurchManagement() {
    const [list, setList] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    // Form & Filter State
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [filters, setFilters] = useState({ church_name: '', denomination: '', active_status: '' });
    const [form, setForm] = useState<any>({
        id: null, church_id: '', church_name: '', denomination: '', address: '', city: '', state: '',
        country: 'IND', postal_code: '', pastor_name: '', pastor_phone: '', church_phone: '', church_email: '', active_status: 'Active'
    });
    const roles = ["Pastor", "Administrator", "Youth Leader", "Worship Leader", "Volunteer"];
    const employmentTypes = ["Full-time", "Part-time", "Volunteer", "Contract"];
    const [previewStaff, setPreviewStaff] = useState<any>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [image, setImage] = useState<any>(null);
    const [uploading, setUploading] = useState(false);


    useEffect(() => {
        // Set a timer to update filters after 500ms of inactivity
        const delayDebounceFn = setTimeout(() => {
            setFilters(prev => ({ ...prev, church_name: searchTerm }));
        }, 500);

        // Cleanup: If the user types again within 500ms, the previous timer is cancelled
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);
    useEffect(() => { fetchChurches(1, false); }, [filters]);

    const resetForm = () => {
        setForm({
            id: null, church_id: '', church_name: '', denomination: '', address: '', city: '', state: '',
            country: 'IND', postal_code: '', pastor_name: '', pastor_phone: '', church_phone: '', church_email: '', active_status: 'Active'
        });
        setErrors({});
    };
    const fetchChurches = async (p = 1, append = false) => {
        setLoading(true);
        try {
            const res = await api.post('/church/churchmanagment.php', { action: 'fetch', page: p, ...filters });
            if (res.data.success) {
                setList(append ? [...list, ...res.data.data] : res.data.data);
                setTotalPages(res.data.totalPages);
                setPage(p);
            }
        } finally { setLoading(false); }
    };
    const StatusBadge = ({ status }: { status: string }) => {
        console.log(status);
        // Define color mapping based on your ENUM: 'Active', 'Inactive', 'Merged', 'Closed'
        const getBadgeAction = () => {
            switch (status) {
                case 'Active': return 'success';   // Green
                case 'Inactive': return 'warning'; // Yellow/Orange
                case 'Closed': return 'error';     // Red
                case 'Merged': return 'info';      // Blue
                default: return 'muted';           // Gray
            }
        };

        return (
            <Badge size="md" variant="solid" action={getBadgeAction()} className="rounded-full px-3">
                <BadgeText className="text-xs font-bold uppercase">{status}</BadgeText>
            </Badge>
        );
    };

    const validate = () => {
        let errs: any = {};
        Object.keys(form).forEach(key => {
            if (!form[key] && key !== 'id' && key !== 'church_id') errs[key] = "Required";
        });
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            const res = form.id
                ? await api.put('/church/churchmanagment.php', form)
                : await api.post('/church/churchmanagment.php', { action: 'add', data: form });
            if (res.data.success) { setShowModal(false); fetchChurches(1, false); }
        } catch (e) { console.log(e) }
        finally { setIsSubmitting(false); }
    };
    const RoleBadge = ({ role }: { role: string }) => (
        <Badge size="sm" variant="outline" action="info" className="rounded-md">
            <BadgeText>{role}</BadgeText>
        </Badge>
    );
    const handleOpenPreview = (item: any) => {
        setPreviewStaff(item);
        setShowPreview(true);
        handlePickAndCrop();
    };
    const handlePickAndCrop = () => {
        ImagePicker.openPicker({
            width: 800,
            height: 800,
            cropping: true,
            includeBase64: true,
            compressImageQuality: 0.8,
            mediaType: 'photo',
        }).then((res: any) => {
            setImage(res);
            setShowPreview(true);
        }).catch((err: any) => {
            if (err.code !== 'E_PICKER_CANCELLED') {
                Alert.alert("Error", err.message);
            }
        });
    };
    const handleConfirm = (result: any) => {
        console.log('handleConfirm', result);
        setImage(result);
        setShowPreview(false);
    };
    const handleCancel = () => {
        setImage(null);
        setShowPreview(false);
    };
    const uploadImage = async () => {
        console.log('uploadImage', image);
        if (!image) return;
        setUploading(true);
        try {
            // const response = await api.post('/church/staffmanagement.php', {
            //     action: 'upload_avatar',
            //     data: {
            //         // Send as base64 string
            //         file: `data:${image.mime};base64,${image.data}`,
            //         staff_id: 123 // Replace with actual ID
            //     }
            // });

            // if (response.data.success) {
            //     Alert.alert("Success", "Profile photo updated!");
            //     setShowPreview(false);
            // }

        } catch (error) {
            Alert.alert("Upload Failed", "Check your server connection.");
        } finally {
            setUploading(false);
        }
    };
    return (
        <Box className="flex-1 bg-white">
            {/* FILTER HEADER */}
            <VStack className="p-4 bg-slate-50 gap-2">
                {/* <Input variant="rounded"><InputField placeholder="Search Church Name..." onChangeText={v => setFilters({ ...filters, church_name: v })} /></Input> */}
                <Input variant="rounded">
                    <InputField
                        placeholder="Search Church Name..."
                        value={searchTerm}
                        onChangeText={(v) => setSearchTerm(v)} // Update local state immediately
                    />
                </Input>
                <HStack className="gap-2">
                    <Select className="flex-1" onValueChange={v => setFilters({ ...filters, denomination: v })}>
                        <SelectTrigger><SelectInput placeholder="Denomination" /></SelectTrigger>
                        <SelectPortal><SelectBackdrop /><SelectContent>
                            {denominations.map(d => <SelectItem label={d} value={d} key={d} />)}
                        </SelectContent></SelectPortal>
                    </Select>
                    <Button variant="outline" onPress={() => setFilters({ church_name: '', denomination: '', active_status: '' })}><ButtonText>Reset</ButtonText></Button>
                </HStack>
            </VStack>
            <Avatar size="md" className="bg-primary-500">
                {image &&
                    <AvatarImage source={{ uri: image.path }} />
                }

                {/* {item.profile_image ? (
            <AvatarImage source={{ uri: item.profile_image }} />
        ) : (
            <AvatarFallbackText>{item.name}</AvatarFallbackText>
        )} */}
            </Avatar>
            <FlatList
                data={list}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 16 }}
                onEndReached={() => page < totalPages && fetchChurches(page + 1, true)}
                renderItem={({ item }) => (
                    <Box className="p-4 mb-3 rounded-xl bg-white border border-outline-100 shadow-sm">
                        <HStack space="md" className="items-center">

                            {/* <TouchableOpacity onPress={() => handleOpenPreview(item)}>
                                <Avatar size="md" className="bg-primary-500">
                                    <AvatarFallbackText>{item.name}</AvatarFallbackText>
                                </Avatar>
                            </TouchableOpacity> */}
                            <TouchableOpacity onPress={() => handleOpenPreview(item)}>
                                <Avatar size="md" className="bg-primary-500">


                                    {item?.profile_image ? (
                                        <AvatarImage source={{ uri: item?.profile_image }} />
                                    ) : (
                                        <AvatarFallbackText>{item.name}</AvatarFallbackText>
                                    )}
                                </Avatar>
                            </TouchableOpacity>


                            <VStack className="flex-1">
                                <Text className="font-bold text-typography-900">{item.name}</Text>
                                <Text size="xs" className="text-typography-500">{item.church_name}</Text>
                                <HStack space="xs" className="items-center">
                                    <Box className="mt-1 self-start">
                                        <RoleBadge role={item.role} />
                                    </Box>
                                    <Box className="mt-2 self-start">
                                        <StatusBadge status={item.active_status} />
                                    </Box>
                                </HStack>
                            </VStack>

                            <VStack space="xs">
                                <Button size="xs" variant="outline" onPress={() => { setForm(item); setShowModal(true); }}>
                                    <ButtonText>Edit</ButtonText>
                                </Button>
                                <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.phone}`)}>
                                    <Text size="xs" className="text-primary-600 text-center font-bold">Call</Text>
                                </TouchableOpacity>
                            </VStack>
                        </HStack>
                    </Box>
                    // <Box className="p-4 border-b border-outline-100 bg-white">
                    //     <HStack className="justify-between items-start">
                    //         <VStack space="xs" className="flex-1">
                    //             <Heading size="sm" className="text-typography-900">
                    //                 {item.church_name}
                    //             </Heading>

                    //             <HStack space="xs" className="items-center">
                    //                 <Text size="xs" className="text-typography-500">{item.city}</Text>
                    //                 <Text size="xs" className="text-typography-300">|</Text>
                    //                 <Text size="xs" className="text-typography-500">{item.denomination}</Text>
                    //             </HStack>

                    //             {/* Insert the Badge here */}
                    //             <Box className="mt-2 self-start">
                    //                 <StatusBadge status={item.active_status} />
                    //             </Box>
                    //         </VStack>

                    //         <VStack space="sm" className="items-end">
                    //             <Text size="xs" className="font-mono text-typography-400 bg-slate-100 px-2 py-1 rounded">
                    //                 {item.church_id}
                    //             </Text>
                    //             <Button
                    //                 variant="link"
                    //                 onPress={() => { setForm(item); setShowModal(true); }}
                    //             >
                    //                 <ButtonText className="text-primary-600">Edit</ButtonText>
                    //             </Button>
                    //         </VStack>
                    //     </HStack>
                    // </Box>
                )}
            />

            <Fab className="bg-primary-600" onPress={() => { resetForm(); setShowModal(true); }}><FabIcon as={AddIcon} /></Fab>

            {/* CRUD MODAL */}
            <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
                <ModalBackdrop />
                <ModalContent>
                    <ModalHeader><Heading>Church Details</Heading></ModalHeader>
                    <ModalBody><ScrollView className="max-h-[500px]">
                        <VStack className="gap-4 p-1">
                            {/* Example of Dynamic FormControl Generation */}
                            {['church_name', 'address', 'city', 'state', 'pastor_name', 'pastor_phone', 'postal_code', 'church_phone', 'church_email'].map((field) => (
                                <FormControl key={field} isInvalid={!!errors[field]}>
                                    <FormControlLabel><FormControlLabelText>{field.replace('_', ' ').toUpperCase()}</FormControlLabelText></FormControlLabel>
                                    <Input><InputField value={form[field]} onChangeText={v => setForm({ ...form, [field]: v })} /></Input>
                                    <FormControlError><FormControlErrorText>{errors[field]}</FormControlErrorText></FormControlError>
                                </FormControl>
                            ))}

                            {/* Dropdown for Denomination */}
                            <FormControl isRequired>
                                <FormControlLabel><FormControlLabelText>STATUS</FormControlLabelText></FormControlLabel>
                                <Select
                                    onValueChange={(v) => setForm({ ...form, active_status: v })}
                                    selectedValue={form.active_status}
                                >
                                    <SelectTrigger>
                                        <SelectInput placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectPortal>
                                        <SelectBackdrop />
                                        <SelectContent>
                                            {statuses.map(s => (
                                                <SelectItem label={s} value={s} key={s} />
                                            ))}
                                        </SelectContent>
                                    </SelectPortal>
                                </Select>
                            </FormControl>

                            <FormControl isInvalid={!!errors.denomination}>
                                <FormControlLabel><FormControlLabelText>DENOMINATION</FormControlLabelText></FormControlLabel>
                                <Select onValueChange={v => setForm({ ...form, denomination: v })} selectedValue={form.denomination}>
                                    <SelectTrigger><SelectInput placeholder="Select..." /></SelectTrigger>
                                    <SelectPortal><SelectBackdrop /><SelectContent>
                                        {denominations.map(d => <SelectItem label={d} value={d} key={d} />)}
                                    </SelectContent></SelectPortal>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormControlLabel><FormControlLabelText>ROLE</FormControlLabelText></FormControlLabel>
                                <Select onValueChange={v => setForm({ ...form, role: v })} selectedValue={form.role}>
                                    <SelectTrigger><SelectInput placeholder="Select Role" /></SelectTrigger>
                                    <SelectPortal><SelectBackdrop /><SelectContent>
                                        {roles.map(r => <SelectItem label={r} value={r} key={r} />)}
                                    </SelectContent></SelectPortal>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormControlLabel><FormControlLabelText>EMPLOYMENT TYPE</FormControlLabelText></FormControlLabel>
                                <Select onValueChange={v => setForm({ ...form, employment_type: v })} selectedValue={form.employment_type}>
                                    <SelectTrigger><SelectInput placeholder="Select Type" /></SelectTrigger>
                                    <SelectPortal><SelectBackdrop /><SelectContent>
                                        {employmentTypes.map(e => <SelectItem label={e} value={e} key={e} />)}
                                    </SelectContent></SelectPortal>
                                </Select>
                            </FormControl>


                        </VStack>
                    </ScrollView></ModalBody>
                    <ModalFooter className="gap-2">
                        <Button variant="outline" onPress={() => setShowModal(false)}><ButtonText>Cancel</ButtonText></Button>
                        <Button className="bg-primary-600" onPress={handleSave} isDisabled={isSubmitting}>
                            <ButtonText>{isSubmitting ? "Saving..." : "Save"}</ButtonText>
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* IMAGE PREVIEW MODAL */}
            {/* <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} size="full">
                <ModalBackdrop className="bg-black" />
                <ModalContent className="bg-black border-0 shadow-none">
                    <VStack className="flex-1 justify-center p-4">
                        <Heading className="text-white mb-4 text-center">Preview & Zoom</Heading>

                        <Box className="w-full aspect-square rounded-lg overflow-hidden">
                            {image && (<StaffImageCropView imageUri={image} onConfirm={handleConfirm} onCancel={handleCancel} />)
                            }

                        </Box>

                        <Text className="text-slate-400 text-center mt-2">Pinch to zoom, double tap to reset</Text>

                        <HStack space="md" className="mt-10 justify-center">
                            <Button variant="outline" action="secondary" onPress={() => setShowPreview(false)}>
                                <ButtonText className="text-white">Cancel</ButtonText>
                            </Button>
                            <Button action="primary" onPress={uploadImage} isDisabled={uploading}>
                                <ButtonText>{uploading ? "Uploading..." : "Confirm Upload"}</ButtonText>
                            </Button>
                        </HStack>
                    </VStack>
                </ModalContent>
            </Modal> */}

        </Box>


    );
}
import React, { useEffect, useRef, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView } from 'react-native';
import {
  Box, VStack, HStack, Text, Heading, Fab, FabIcon, Card,
  Spinner, Modal, ModalBackdrop, ModalContent, ModalHeader,
  ModalBody, ModalFooter, Button, ButtonText, Input, InputField, Divider,
  InputIcon, Switch,
  Center
} from '@/src/components/common/GluestackUI';
import { AddIcon, ChevronUpIcon, EditIcon, Icon, SearchIcon } from '@/src/components/common/IconUI';


import api from '@/src/api/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  FormControl, FormControlLabel, FormControlLabelText,
  FormControlError, FormControlErrorText, FormControlHelper, FormControlHelperText
} from '@/components/ui/form-control';
import { RefreshControl } from 'react-native';

export default function StaffManagement() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [errors, setErrors] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const flatListRef = useRef<any>(null);
  const [showTopButton, setShowTopButton] = useState(false);

  const [activeFilters, setActiveFilters] = useState({
    activeStatus: '',
    department: ''
  });

  useEffect(() => { fetchStaff(); }, []);

  useEffect(() => {
    const filtered = staffList.filter((item: any) => {
      const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
      const dept = item.department.toLowerCase();
      const query = searchQuery.toLowerCase();

      return fullName.includes(query) || dept.includes(query);
    });
    setStaffList(filtered);
  }, [searchQuery, staffList]);


  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchStaff(1, false);
    setRefreshing(false);
  };

  // Form State matching your columns
  const [form, setForm] = useState({
    firstName: '', lastName: '', department: '', role: '',
    designation: '', church_Id: 'CH001', mobileNo: '',
    alrenativeMobileNo: '', address: '', activeStatus: 1, staff_id: ''
  });

  const fetchStaff = async (pageNumber = 1, shouldAppend = false) => {
    if (loading || (pageNumber > totalPages)) return;

    setLoading(true);
    try {
      const res = await api.post('/staff_api.php', {
        action: 'fetch', // Tells PHP to handle pagination, not insert
        Church_Id: 'CH001',
        page: pageNumber,
        limit: 10,
        search: searchQuery
      });

      if (res.data.success) {
        setStaffList(prev => shouldAppend ? [...prev, ...res.data.data] : res.data.data);
        setTotalPages(res.data.pagination.total_pages);
        setPage(pageNumber);
      }
    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsMoreLoading(false);
    }
  };
  const clearFilters = () => {
    setActiveFilters({ activeStatus: '', department: '' });
    setShowFilterModal(false);
    fetchStaff(1, false);
  };
  const handleLoadMore = () => {
    // Only trigger if we aren't already loading and there are more pages left
    if (page < totalPages) {
      setIsMoreLoading(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchStaff(nextPage, true); // true tells fetchStaff to append data
    }
  };

  const openEditModal = (staff: any) => {
    setEditId(staff.id);
    setForm({
      staff_id: staff.staff_id,
      firstName: staff.firstName,
      lastName: staff.lastName,
      department: staff.department,
      role: staff.role,
      designation: staff.designation,
      church_Id: staff.church_Id,
      mobileNo: staff.mobileNo,
      alrenativeMobileNo: staff.alrenativeMobileNo || '',
      address: staff.address,
      activeStatus: staff.activeStatus // Keep existing status
    });
    setShowModal(true);
  };
  const toggleStatus = async (id: number, currentStatus: number) => {
    const nextStatus = currentStatus === 1 ? 0 : 1;
    setForm({ ...form, activeStatus: nextStatus }); // Reset partial
  };
  const validateStaffForm = () => {
    const newErrors: any = {};
    if (!form.firstName) newErrors.firstName = 'First name is required';
    if (!form.lastName) newErrors.lastName = 'Last name is required';
    if (!form.department) newErrors.department = 'Department is required';
    if (!form.mobileNo) {
      newErrors.mobileNo = 'Mobile number is required';
    } else if (form.mobileNo.length < 10) {
      newErrors.mobileNo = 'Enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveOrUpdate = async () => {
    if (!validateStaffForm()) return;
    // If editing, show a confirmation first
    if (editId) {
      Alert.alert(
        "Confirm Update",
        `Are you sure you want to update the details for ${form.firstName}?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Update",
            onPress: () => processSubmit(),
            style: "default"
          }
        ]
      );
    } else {
      // If adding new staff, just proceed
      processSubmit();
    }
  };
  // Separate the API logic into its own function
  const processSubmit = async () => {
    setIsSubmitting(true); // Start loading
    try {
      const res = editId
        ? await api.put('/staff/staffdetails.php', { ...form, id: editId })
        : await api.post('/staff/staffdetails.php', form);

      if (res.data.success) {

        setShowModal(false);
        setEditId(null);
        fetchStaff();

        // Optional: Show a success message
        Alert.alert("Success", editId ? "Staff updated!" : "Staff added!");
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not save staff details.");
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };
  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    // Show button if scrolled more than 400 pixels
    if (offsetY > 400) {
      setShowTopButton(true);
    } else {
      setShowTopButton(false);
    }
  };


  const renderItem = ({ item }: any) => (
    <Pressable
      onPress={() => navigation.navigate('StaffDetail', { staff: item })}
      className="flex-1"
    >
      <Card variant="elevated" className="p-4 mb-3 mx-4 border-l-4 border-primary-500">

        <HStack className="justify-between">
          <VStack className="flex-1">
            <Text className="font-bold text-lg">{item.firstName} {item.lastName}</Text>
            <Text size="sm" className="text-typography-500">{item.designation} • {item.department}</Text>
            <Text size="xs" className="text-primary-600 mt-1">{item.mobileNo}</Text>
          </VStack>
          <Box className={item.activeStatus == 1 ? "bg-success-100 px-2 py-1 h-7 rounded" : "bg-error-100 px-2 py-1 h-7 rounded"}>
            <VStack className="items-end gap-1">
              <Text size="xs" className={item.activeStatus == 1 ? "text-success-700" : "text-error-700"}>
                {item.activeStatus == 1 ? 'Active' : 'Inactive'}
              </Text>
              <Switch
                size="sm"
                value={item.activeStatus == 1}
                onValueChange={() => toggleStatus(item.id, item.activeStatus)}
              />
            </VStack>
          </Box>
          <HStack className="gap-4 items-center">
            <Pressable onPress={() => openEditModal(item)}>
              <Icon as={EditIcon} className="text-primary-600" />
            </Pressable>
            <Switch
              value={item.activeStatus == 1}
              onValueChange={() => toggleStatus(item.id, item.activeStatus)}
            />
          </HStack>
          <VStack className="mt-2">
            <Text size="xs" className="text-typography-400 italic">
              Last Updated: {new Date(item.UpdatetedDate).toLocaleDateString()}
            </Text>
          </VStack>
        </HStack>
      </Card>
    </Pressable>

  );

  return (
    <Box className="flex-1 bg-background-50">
      {/* Search Header Section */}
      <VStack className="bg-white px-4 pb-4 pt-2 border-b border-outline-50">
        <Heading size="lg" className="mb-3">Staff Directory</Heading>
        <Input variant="rounded" size="md">
          <InputIcon className="ml-3">
            <Icon as={SearchIcon} />
          </InputIcon>
          <InputField
            placeholder="Search by name or department..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Input>
      </VStack>

      <FlatList
        data={staffList} // Use filtered list here
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id.toString()}
        ref={flatListRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4F46E5']}
            tintColor="#4F46E5"
          />
        }
        onEndReachedThreshold={0.5}
        onEndReached={handleLoadMore}
        ListHeaderComponent={
          <VStack className="bg-white px-4 pb-4 pt-2 border-b border-outline-50">
            <Heading size="lg" className="mb-3">Staff Directory</Heading>
            <Input variant="rounded" size="md">
              <InputIcon className="ml-3">
                <Icon as={SearchIcon} />
              </InputIcon>
              <InputField
                placeholder="Search by name or department..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </Input>
          </VStack>
        }
        // Footer shows spinner only when loading next page
        ListFooterComponent={
          isMoreLoading ? (
            <Center className="py-4">
              <Spinner size="small" />
            </Center>
          ) : <Box className="h-10" /> // Small spacer at bottom
        }
        ListEmptyComponent={loading ?
          <Spinner size="large" className="mt-10" /> :
          <Text className="text-center mt-10">{searchQuery ? "No matches found" : "No staff found"}</Text>}
      />
      {showTopButton && (
        <Fab
          size="md"
          placement="bottom right"
          onPress={scrollToTop}
          className="bg-primary-600 mb-20 mr-4 shadow-lg"
        >
          <FabIcon as={ChevronUpIcon} />
        </Fab>
      )}
      <Fab size="lg" placement="bottom right" onPress={() => {
        setEditId(null);
        setForm({
          firstName: '', lastName: '', department: '', role: '',
          designation: '', church_Id: 'CH001', mobileNo: '',
          alrenativeMobileNo: '', address: '', activeStatus: 1, staff_id: ''
        });

        setShowModal(true);
      }}
        className="bg-primary-600">
        <FabIcon as={AddIcon} />
      </Fab>


      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setErrors({}); }} size="lg">
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md">{editId ? 'Edit Staff Member' : 'Add Staff Member'}</Heading>
          </ModalHeader>
          <ModalBody className="relative">
            {isSubmitting && (
              <Box className="absolute inset-0 z-10 bg-white/50 flex items-center justify-center">
                <Spinner size="large" />
              </Box>
            )}
            <ScrollView className="max-h-[450px]">
              <VStack className="gap-5 pb-4">

                {/* Names Row */}
                <HStack className="gap-2">
                  <FormControl className="flex-1" isInvalid={!!errors.firstName}>
                    <FormControlLabel><FormControlLabelText>First Name</FormControlLabelText></FormControlLabel>
                    <Input><InputField value={form.firstName} placeholder="John" onChangeText={(v) => { setForm({ ...form, firstName: v }); setErrors({ ...errors, firstName: null }) }} /></Input>
                    <FormControlError><FormControlErrorText>{errors.firstName}</FormControlErrorText></FormControlError>
                  </FormControl>

                  <FormControl className="flex-1" isInvalid={!!errors.lastName}>
                    <FormControlLabel><FormControlLabelText>Last Name</FormControlLabelText></FormControlLabel>
                    <Input><InputField value={form.lastName} placeholder="Doe" onChangeText={(v) => { setForm({ ...form, lastName: v }); setErrors({ ...errors, lastName: null }) }} /></Input>
                    <FormControlError><FormControlErrorText>{errors.lastName}</FormControlErrorText></FormControlError>
                  </FormControl>
                </HStack>

                {/* Department */}
                <FormControl isInvalid={!!errors.department} isRequired>
                  <FormControlLabel><FormControlLabelText>Department</FormControlLabelText></FormControlLabel>
                  <Input><InputField value={form.department} placeholder="Administration" onChangeText={(v) => { setForm({ ...form, department: v }); setErrors({ ...errors, department: null }) }} /></Input>
                  <FormControlError><FormControlErrorText>{errors.department}</FormControlErrorText></FormControlError>
                </FormControl>

                {/* Role & Designation Row */}
                <HStack className="gap-2">
                  <FormControl className="flex-1">
                    <FormControlLabel><FormControlLabelText>Designation</FormControlLabelText></FormControlLabel>
                    <Input><InputField value={form.designation} placeholder="Senior Pastor" onChangeText={(v) => setForm({ ...form, designation: v })} /></Input>
                  </FormControl>
                  <FormControl className="flex-1">
                    <FormControlLabel><FormControlLabelText>Role</FormControlLabelText></FormControlLabel>
                    <Input><InputField value={form.role} placeholder="Staff" onChangeText={(v) => setForm({ ...form, role: v })} /></Input>
                  </FormControl>
                </HStack>

                <Divider className="my-2" />

                {/* Contact Section */}
                <FormControl isInvalid={!!errors.mobileNo} isRequired>
                  <FormControlLabel><FormControlLabelText>Mobile Number</FormControlLabelText></FormControlLabel>
                  <Input>
                    <InputField
                      value={form.mobileNo}
                      placeholder="10-digit number"
                      keyboardType="phone-pad"
                      onChangeText={(v) => { setForm({ ...form, mobileNo: v }); setErrors({ ...errors, mobileNo: null }) }}
                    />
                  </Input>
                  <FormControlError><FormControlErrorText>{errors.mobileNo}</FormControlErrorText></FormControlError>
                </FormControl>

                <FormControl>
                  <FormControlLabel><FormControlLabelText>Alternative Mobile</FormControlLabelText></FormControlLabel>
                  <Input><InputField value={form.alrenativeMobileNo} placeholder="Optional" keyboardType="phone-pad" onChangeText={(v) => setForm({ ...form, alrenativeMobileNo: v })} /></Input>
                </FormControl>

                <FormControl>
                  <FormControlLabel><FormControlLabelText>Residential Address</FormControlLabelText></FormControlLabel>
                  <Input className="h-20">
                    <InputField
                      value={form.address}
                      placeholder="Full address here..."
                      multiline
                      className="text-start align-top py-2"
                      onChangeText={(v) => setForm({ ...form, address: v })}
                    />
                  </Input>
                </FormControl>

              </VStack>
            </ScrollView>
          </ModalBody>
          <ModalFooter className="gap-2">
            <Button variant="outline" action="secondary" onPress={() => { setShowModal(false); setErrors({}); }} isDisabled={isSubmitting}>
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button className="bg-primary-600" onPress={handleSaveOrUpdate}>
              <ButtonText>{editId ? 'Update Staff' : 'Save Staff'}</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
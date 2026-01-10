import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView } from 'react-native';
import { 
  Box, VStack, HStack, Text, Heading, Fab, FabIcon, Card, 
  Spinner, Modal, ModalBackdrop, ModalContent, ModalHeader, 
  ModalBody, ModalFooter, Button, ButtonText, Input, InputField, Divider,
  InputIcon,Switch
} from '@/src/components/common/GluestackUI';
import { AddIcon, EditIcon, Icon, SearchIcon } from '@/src/components/common/IconUI';


import api from '@/src/api/api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function StaffManagement() {
const navigation = useNavigation<NativeStackNavigationProp<any>>();
    
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => { fetchStaff(); }, []);
  
  useEffect(() => {
  const filtered = staffList.filter((item: any) => {
      const fullName = `${item.Firstname} ${item.LastName}`.toLowerCase();
      const dept = item.Department.toLowerCase();
      const query = searchQuery.toLowerCase();
      
      return fullName.includes(query) || dept.includes(query);
  });
  setStaffList(filtered);
  }, [searchQuery, staffList]);

  // Form State matching your columns
  const [form, setForm] = useState({
    Firstname: '', LastName: '', Department: '', Role: '', 
    designation: '', Church_Id: 'CH001', MobileNo1: '', 
    AlrenativemobileNO: '', Address: '',activeStatus: 1
  });

  const fetchStaff = async () => {
    try {
      const res = await api.get('/staff_api.php?church_id=CH001');
      if (res.data.success) setStaffList(res.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      const res = await api.post('/staff_api.php', form);
      if (res.data.success) {
        setShowModal(false);
        fetchStaff();
        setForm({ ...form, Firstname: '', LastName: '', MobileNo1: '' }); // Reset partial
      }
    } catch (e) { console.error(e); }
  };
  const openEditModal = (staff: any) => {
    setEditId(staff.id);
    setForm({
      Firstname: staff.Firstname,
      LastName: staff.LastName,
      Department: staff.Department,
      Role: staff.Role,
      designation: staff.designation,
      Church_Id: staff.Church_Id,
      MobileNo1: staff.MobileNo1,
      AlrenativemobileNO: staff.AlrenativemobileNO || '',
      Address: staff.Address,
      activeStatus: staff.activeStatus // Keep existing status
    });
    setShowModal(true);
  };
const toggleStatus = async (id: number, currentStatus: number) => {
  const nextStatus = currentStatus === 1 ? 0 : 1;
    setForm({ ...form, activeStatus: nextStatus }); // Reset partial
};

const handleSaveOrUpdate = async () => {

    // If editing, show a confirmation first
  if (editId) {
    Alert.alert(
      "Confirm Update",
      `Are you sure you want to update the details for ${form.Firstname}?`,
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
  try {
    const res = editId 
      ? await api.put('/staff_api.php', { ...form, id: editId }) 
      : await api.post('/staff_api.php', form);

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
          <Text className="font-bold text-lg">{item.Firstname} {item.LastName}</Text>
          <Text size="sm" className="text-typography-500">{item.designation} • {item.Department}</Text>
          <Text size="xs" className="text-primary-600 mt-1">{item.MobileNo1}</Text>
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
        ListHeaderComponent={<Heading size="xl" className="p-4">Staff Directory</Heading>}
        renderItem={renderItem}
        keyExtractor={(item: any) => item.id.toString()}
        ListEmptyComponent={loading ? 
        <Spinner size="large" className="mt-10" /> : 
        <Text className="text-center mt-10">{searchQuery ? "No matches found" : "No staff found"}</Text>}
      />

      <Fab size="lg" placement="bottom right" onPress={() => {
            setEditId(null); 
            setForm({
            Firstname: '', LastName: '', Department: '', Role: '', 
            designation: '', Church_Id: 'CH001', MobileNo1: '', 
            AlrenativemobileNO: '', Address: '',activeStatus: 1
            });

            setShowModal(true);
            }} 
            className="bg-primary-600">
        <FabIcon as={AddIcon} />
      </Fab>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} size="lg">
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader><Heading size="md">Add Staff Member</Heading></ModalHeader>
          <ModalBody>
            <ScrollView className="max-h-[400px]">
              <VStack className="gap-4 pb-4">
                <HStack className="gap-2">
                  <Input className="flex-1"><InputField placeholder="First Name" onChangeText={(v) => setForm({...form, Firstname: v})} /></Input>
                  <Input className="flex-1"><InputField placeholder="Last Name" onChangeText={(v) => setForm({...form, LastName: v})} /></Input>
                </HStack>
                <Input><InputField placeholder="Department" onChangeText={(v) => setForm({...form, Department: v})} /></Input>
                <Input><InputField placeholder="Designation" onChangeText={(v) => setForm({...form, designation: v})} /></Input>
                <Input><InputField placeholder="Role" onChangeText={(v) => setForm({...form, Role: v})} /></Input>
                <Divider />
                <Input><InputField placeholder="Mobile No 1" keyboardType="phone-pad" onChangeText={(v) => setForm({...form, MobileNo1: v})} /></Input>
                <Input><InputField placeholder="Alt Mobile No" keyboardType="phone-pad" onChangeText={(v) => setForm({...form, AlrenativemobileNO: v})} /></Input>
                <Input><InputField placeholder="Residential Address" multiline onChangeText={(v) => setForm({...form, Address: v})} /></Input>
              </VStack>
            </ScrollView>
          </ModalBody>
          <ModalFooter className="gap-2">
            <Button variant="outline" action="secondary" onPress={() => setShowModal(false)}><ButtonText>Cancel</ButtonText></Button>
            <Button className="bg-primary-600" onPress={handleSave}><ButtonText>Save Staff</ButtonText></Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
import  { useState } from 'react';
 // Local UI Imports
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { ScrollView } from '@/components/ui/scroll-view';
import { Pressable } from '@/components/ui/pressable';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Button, ButtonText } from '@/components/ui/button';
 
const staffData = [
  {
    id: 1,
    name: 'John Smith',
    role: 'Manager',
    department: 'Operations',
    status: 'active',
    email: 'john@example.com',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'Developer',
    department: 'IT',
    status: 'active',
    email: 'sarah@example.com',
  },
  {
    id: 3,
    name: 'Mike Wilson',
    role: 'Designer',
    department: 'Creative',
    status: 'on_leave',
    email: 'mike@example.com',
  },
  // Add more staff members...
];

export default function StaffScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredStaff = staffData.filter((staff) => {
    const matchesSearch = staff.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      selectedFilter === 'all' || 
      staff.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const statusColors = {
    active: '$success',
    on_leave: '$warning',
    inactive: '$muted',
  };

  const statusText = {
    
    active: 'Active',
    on_leave: 'On Leave',
    inactive: 'Inactive',
  };

  return (
    <Box className="flex-1 bg-background-0">
      {/* Header & Filters */}
      <Box className="px-4 pt-6 pb-4">
        <Heading size="xl" className="mb-4">
          Staff Management
        </Heading>
        
        {/* Search Bar */}
        <Box className="mb-4">
          <Input variant="rounded">
            <InputField
              placeholder="Search staff by name or department..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Input>
        </Box>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack className="gap-2 pb-2">
            {['all', 'active', 'on_leave', 'inactive'].map((filter: any) => (
              <Pressable
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full border ${
                  selectedFilter === filter 
                    ? 'bg-primary-500 border-primary-500' 
                    : 'bg-background-0 border-outline-300'
                }`}
              >
                <Text
                  className={`text-sm capitalize ${
                    selectedFilter === filter ? 'text-white' : 'text-typography-700'
                  }`}
                >
                  {filter === 'all' ? 'All' : statusText[filter as keyof typeof statusText]}
                </Text>
              </Pressable>
            ))}
          </HStack>
        </ScrollView>
      </Box>

      {/* Staff List */}
      <ScrollView className="px-4 mb-20"> {/* Margin bottom for FAB space */}
        <VStack className="gap-3">
          {filteredStaff.map((staff: any) => (
            <Pressable key={staff.id} onPress={() => {}}>
              <Card variant="elevated" className="p-4">
                <HStack className="gap-4 items-center">
                  <Avatar size="lg" className="bg-amber-600">
                    <AvatarFallbackText className="text-white">
                      {staff.name.charAt(0)}
                    </AvatarFallbackText>
                  </Avatar>
                  
                  <VStack className="flex-1 gap-1">
                    <HStack className="justify-between items-center">
                      <Text className="font-semibold text-lg text-typography-900">
                        {staff.name}
                      </Text>
                      {/* Using dynamic BG color from statusColors map if needed */}
                      <Badge size="sm" variant="solid" className={statusColors[staff.status as keyof typeof statusText]}>
                        <BadgeText>{statusText[staff.status as keyof typeof statusText]}</BadgeText>
                      </Badge>
                    </HStack>
                    
                    <Text className="text-typography-500 text-sm">{staff.role}</Text>
                    
                    <HStack className="justify-between mt-1">
                      <Text className="text-sm text-typography-700">{staff.department}</Text>
                      <Text className="text-sm text-primary-600 font-medium">
                        {staff.email}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>
              </Card>
            </Pressable>
          ))}
        </VStack>
      </ScrollView>

      {/* Add Staff Floating Action Button (FAB) */}
      <Box className="absolute bottom-6 right-6 shadow-lg">
        <Button
          size="lg"
          className="rounded-full h-14 px-6"
          onPress={() => {}}
        >
          <ButtonText>Add Staff</ButtonText>
        </Button>
      </Box>
    </Box>
  );
}
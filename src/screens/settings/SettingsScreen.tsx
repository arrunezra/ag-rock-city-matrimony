import React from 'react';
import { Pressable, ScrollView } from 'react-native';
//import { Box, VStack, HStack, Text, Heading, Icon, Pressable, Divider, ChevronRightIcon } from '@/components/ui';
import { User, Lock, Bell, Shield, Trash2 } from 'lucide-react-native';
import { Box, VStack, HStack, Text , Divider } from '@/src/components/common/GluestackUI';
import { ChevronRightIcon, Icon } from '@/src/components/common/IconUI';
 
export default function SettingsScreen({ navigation }: any) {
  const settingsSections = [
    {
      header: "Profile Settings",
      items: [
        { label: "Edit Personal Info", icon: User, route: "EditProfile" },
        { label: "Update Preferences", icon: Shield, route: "PartnerPreferences" },
      ]
    },
    {
      header: "Security",
      items: [
        { label: "Change Password", icon: Lock, route: "ChangePassword" },
        { label: "Push Notifications", icon: Bell, type: 'toggle' },
      ]
    }
  ];

  return (
    <Box className="flex-1 bg-background-50">
      <ScrollView>
        {settingsSections.map((section, idx) => (
          <VStack key={idx} className="mt-6">
            <Text className="px-6 mb-2 text-xs font-bold uppercase text-typography-400">
              {section.header}
            </Text>
            <Box className="bg-white border-y border-outline-50">
              {section.items.map((item, itemIdx) => (
                <VStack key={itemIdx}>
                  <Pressable 
                    onPress={() => item.route && navigation.navigate(item.route)}
                    className="px-6 py-4 active:bg-background-50"
                  >
                    <HStack className="items-center justify-between">
                      <HStack className="items-center gap-4">
                        <Icon as={item.icon} size="sm" className="text-typography-500" />
                        <Text className="text-md font-medium text-typography-800">{item.label}</Text>
                      </HStack>
                      <Icon as={ChevronRightIcon} size="xs" className="text-typography-300" />
                    </HStack>
                  </Pressable>
                  {itemIdx < section.items.length - 1 && <Divider className="ml-16 mr-6" />}
                </VStack>
              ))}
            </Box>
          </VStack>
        ))}

        {/* Danger Zone */}
        <VStack className="mt-10 mb-10">
          <Pressable className="bg-white border-y border-outline-50 px-6 py-4 active:bg-error-50">
            <HStack className="items-center gap-4">
              <Icon as={Trash2} size="sm" className="text-error-600" />
              <Text className="text-md font-medium text-error-600">Delete Account</Text>
            </HStack>
          </Pressable>
        </VStack>
      </ScrollView>
    </Box>
  );
}
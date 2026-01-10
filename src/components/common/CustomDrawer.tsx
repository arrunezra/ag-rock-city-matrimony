 
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAuth } from '../../context/AuthContext';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Pressable } from '@/components/ui/pressable';
import { Divider } from '@/components/ui/divider';
const CustomDrawer = (props:any) => {
  const { user, logout } = useAuth();
  const { navigation } = props;

  const menuItems = [
    { label: 'Dashboard', icon: 'home', route: 'Home' },
    { label: 'Profile', icon: 'user', route: 'Profile' },
    { label: 'Staff', icon: 'users', route: 'Staff' },
    { label: 'Settings', icon: 'settings', route: 'Settings' },
    { label: 'Wizard', icon: 'wizard', route: 'WizardScreen' },
    { label: 'Profile Access', icon: 'wizard', route: 'ProfileAccess' },
    
  ];

  const handleLogout = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
     <Box className="flex-1 bg-background-0">
      <DrawerContentScrollView {...props}> 
        <Box className="bg-primary-600 px-4 py-6">
          <HStack className="items-center gap-3">
            <Avatar size="lg" className="bg-amber-600">
              <AvatarFallbackText>
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallbackText>
            </Avatar>
            <VStack>
              <Text className="text-white font-semibold text-lg">
                {user?.name || 'User'}
              </Text>
              <Text className="text-white text-sm">
                {user?.email || 'user@example.com'}
              </Text>
            </VStack>
          </HStack>
        </Box>
 
        <VStack className="gap-1 mt-6 px-4">
          {menuItems.map((item: any) => (
            <Pressable
              key={item.route}
              onPress={() => navigation.navigate(item.route)}
              // _pressed logic -> className="active:bg-primary-100"
              className="py-3 px-2 rounded-md active:bg-primary-100 transition-colors"
            >
              <HStack className="items-center gap-3">
                {/* Placeholder for icons */}
                <Box className="w-6 h-6" />
                <Text className="text-md text-typography-700">
                  {item.label}
                </Text>
              </HStack>
            </Pressable>
          ))}
        </VStack>

        <Divider className="my-4" />

        {/* Additional Menu Items */}
        <VStack className="px-4">
          <Pressable
            onPress={() => {}}
            className="py-3 px-2 rounded-md active:bg-primary-100"
          >
            <HStack className="items-center gap-3">
              <Box className="w-6 h-6" />
              <Text className="text-md text-typography-700">
                Help & Support
              </Text>
            </HStack>
          </Pressable>
        </VStack>
      </DrawerContentScrollView>
 
      <Box className="border-t border-outline-100">
        <Pressable
          onPress={handleLogout}
          className="py-4 px-6 active:bg-error-100"
        >
          <HStack className="items-center gap-3">
            <Box className="w-6 h-6" />
            <Text className="text-md text-error-600">
              Logout
            </Text>
          </HStack>
        </Pressable>
        </Box>
    </Box> 
  );
};

export default CustomDrawer;
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeartIcon, HomeIcon, Icon, LockIcon, MessageCircleIcon } from "../components/common/IconUI";
import AdminDashboard from "../screens/Admin/AdminDashboard";
import ProfileSummary from "../screens/profile/ProfileSummary";
import InboxScreen from "../screens/profile/InboxScreen";
import StaffDashboard from "../screens/staff/StaffDashboard";
import StaffRegistration from "../screens/staff/StaffRegistration";
import StaffDetailsScreen from "../screens/staff/StaffDetailScreen";
import ChurchRegistrationScreen from "../screens/Church/ChurchRegistrationScreen";
import { Box, Button, Center, Heading, Spinner, Text, VStack } from "../components/common/GluestackUI";
import ProfileHomeScreen from "../screens/profile/ProfileHomeScreen";
import MatchesScreen from "../screens/profile/MatchesScreen";
import ViewStaffinforamtion from "../screens/staff/ViewStaffinforamtion";
import StaffSummaryView from "../screens/staff/SummaryView";
import PartnerPreferences from "../screens/profile/PartnerPreferences";
import MyPhotos from "../screens/profile/MyPhotos";
import AcceptedScreen from "../screens/profile/AcceptedScreen";
import ReceivedScreen from "../screens/profile/ReceivedScreen";
import ChurchDashboard from "../screens/Church/ChurchDashboard";
import ChurchSummary from "../screens/Church/ChurchSummary";
import BaptismScreen from "../screens/Document/BaptismScreen";
import ProfileDetailScreen from "../screens/profile/ProfileDetailScreen";
import ProfileEditScreen from "../screens/profile/ProfileEditScreen";
import DMSUploadScreen from "../screens/DMS/DMSUploadScreen";
import DMSSummaryScreen from "../screens/DMS/DMSSummaryScreen";
import UserDocumentUpload from "../screens/members/UserDocumentUpload";
import ShowProfileGalleryScreen from "../screens/profile/ShowProfileGalleryScreen";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export const ROLE_DRAWER_CONFIG: Record<string, any[]> = {
  admin: [
    { name: "StaffDashboard", component: StaffDashboard, options: { title: "Staff Overview" } },
    { name: "ChurchDashboard", component: ChurchDashboard, options: { title: "Church Overview" } },
  ],
  member: [
    { name: "ReceivedRequests", component: ReceivedScreen },
    { name: "AcceptedRequests", component: AcceptedScreen },
    { name: "MyPhotos", component: MyPhotos, options: { title: "My Photos" } },
    { name: "PartnerPreferences", component: PartnerPreferences, options: { title: "Partner Preferences" } },
    { name: "UserDocumentUpload", component: UserDocumentUpload, options: { title: "My Documents" } },

  ],
  staff: [
    { name: "BaptismRecords", component: BaptismScreen, options: { title: "Baptism Records" } },
  ],
};

// 1. Define the Tab Configuration
const TAB_CONFIG = {
  admin: [
    { name: "Dashboard", component: AdminDashboard, icon: HomeIcon, title: "Admin Home" },
    { name: "Profile", component: ProfileSummary, icon: HeartIcon, title: "Profile" },
    { name: "Inbox", component: InboxScreen, icon: MessageCircleIcon, title: "Inbox" },
  ],
  staff: [
    { name: "Dashboard", component: StaffDashboard, icon: HomeIcon, title: "Staff Home" },
    { name: "Profile", component: ProfileSummary, icon: HeartIcon, title: "Profile" },
    { name: "Inbox", component: InboxScreen, icon: MessageCircleIcon, title: "Inbox" },
  ],
  member: [
    { name: "Home", component: ProfileHomeScreen, icon: HomeIcon, title: "Home" },
    { name: "Matches", component: MatchesScreen, icon: HeartIcon, title: "Matches" },
    { name: "Favourites", component: InboxScreen, icon: MessageCircleIcon, title: "Favourites" },
  ],
};

// 2. Define Shared Stack Screens (DRY - Don't Repeat Yourself)
const SHARED_STACKS = (role: string) => (
  <Stack.Group screenOptions={{ headerShown: false }}>
    {/* Common Staff Screens available to both Admin and Staff */}
    {(role === 'admin' || role === 'staff') && (
      <>
        <Stack.Screen name="StaffRegistration" component={StaffRegistration} />
        <Stack.Screen name="StaffDetail" component={StaffDetailsScreen} />
        <Stack.Screen name="ViewStaffinforamtion" component={ViewStaffinforamtion} />
        <Stack.Screen name="StaffSummaryView" component={StaffSummaryView} />
        <Stack.Screen name="DMSUpload" component={DMSUploadScreen} />
        <Stack.Screen name="DMSSummary" component={DMSSummaryScreen} />

      </>
    )}
    {/* Admin Only Modals */}
    {role === 'admin' && (
      <><Stack.Screen name="ChurchRegistration" component={ChurchRegistrationScreen} options={{ presentation: 'fullScreenModal' }} />
        <Stack.Screen name="ChurchSummary" component={ChurchSummary} options={{ title: 'Church Summary' }} /></>
    )}
    {role === 'member' && (
      <>
        <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />

      </>
    )}
    <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
    <Stack.Screen name="ShowProfileGallery" component={ShowProfileGalleryScreen} />
  </Stack.Group>
);

// 3. Dynamic Tab Component
const DynamicTabs = ({ route }: any) => {
  const { role } = route.params;
  const tabs = TAB_CONFIG[role as keyof typeof TAB_CONFIG] || TAB_CONFIG.staff;
  const firstTabName = role === 'member' ? 'Matches' : tabs[0]?.name;
  return (
    <Tab.Navigator
      initialRouteName={firstTabName}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#16a34a",
        tabBarIcon: ({ color }) => {
          const config = tabs.find(t => t.name === route.name);
          return <Icon as={config?.icon} color={color} size="lg" />;
        },
      })}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{ title: tab.title }}
        />
      ))}
    </Tab.Navigator>
  );
};



// 4. The Master Dynamic Router
const DynamicStackRouter = ({ userRole, logout }: { userRole: string, logout: any }) => {
  // 1. Role Guard: Check if user exists
  if (!userRole) {
    return (
      <Center className="flex-1 bg-white p-6">
        <VStack space="lg" className="items-center">
          <Box className="p-4 bg-error-50 rounded-full">
            <Icon as={LockIcon} size="xl" className="text-error-600" />
          </Box>
          <VStack space="xs" className="items-center">
            <Heading size="md">Access Denied</Heading>
            <Text className="text-center text-slate-500">
              You are not authorized to view this section or your session has expired.
            </Text>
          </VStack>
          <Button onPress={logout} variant="outline" className="mt-4 border-error-600">
            <Text className="text-error-600 font-bold">Back to Login</Text>
          </Button>
        </VStack>
      </Center>
    );
  }

  // 2. Allowed Roles: Check if role is valid
  const allowedRoles = ['admin', 'staff', 'member'];
  if (!allowedRoles.includes(userRole)) {
    return (
      <Center className="flex-1">
        <Spinner size="large" color="#0891b2" />
        <Text className="mt-4 text-slate-400 font-medium">Configuring your workspace...</Text>
      </Center>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Set initial params so the Tab navigator knows which role to render */}
      <Stack.Screen
        name="MainTabs"
        component={DynamicTabs}
        initialParams={{ role: userRole }}
      />

      {/* Inject Shared Stack Screens */}
      {SHARED_STACKS(userRole)}
    </Stack.Navigator>
  );
};

export default DynamicStackRouter;
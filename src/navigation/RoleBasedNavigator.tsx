import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileHomeScreen from '../screens/profile/ProfileHomeScreen';
import MatchesScreen from '../screens/profile/MatchesScreen';
import InboxScreen from '../screens/profile/InboxScreen';
import AdminDashboard from '../screens/Admin/AdminDashboard';
import ProfileSummary from '../screens/profile/ProfileSummary';
import StaffScreen from '../screens/staff/StaffScreen';
import ReceivedScreen from '../screens/profile/ReceivedScreen';
import AcceptedScreen from '../screens/profile/AcceptedScreen';
import BaptismScreen from '../screens/Document/BaptismScreen';
import ChurchSummaryScreen from '../screens/Church/ChurchSummaryScreen';
import React from 'react';
import CustomDrawerContent from './CustomDrawerContent';
import { HeaderNotification } from '../components/common/HeaderNotification';
import { HeartIcon, HomeIcon, Icon, MessageCircleIcon } from '../components/common/IconUI';
import MyPhotos from '../screens/profile/MyPhotos';
import PartnerPreferences from '../screens/profile/PartnerPreferences';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileDetailScreen from '../screens/profile/ProfileDetailScreen';
import ProfileEditScreen from '../screens/profile/EditProfileScreen';
import StaffDashboard from '../screens/staff/StaffDashboard';
import StaffManagement from '../screens/staff/StaffManagement';
import StaffDetailsScreen from '../screens/staff/StaffDetailScreen';
import StaffRegistration from '../screens/staff/StaffRegistration';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
// --- TABS BASED ON ROLE ---

//#region Member Router
const MemberStackRouter = () => (
    <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
        {/* The Tabs stay as the main entry point */}
        <Stack.Screen name="Tabs" component={MemberTabs} />

        {/* The Detail screen is pushed on top of the tabs */}
        <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
        <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
    </Stack.Navigator>
);
const MemberTabs = () => (
    <Tab.Navigator
        initialRouteName="Matches"
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: "#16a34a", // Emerald/Green 600
            tabBarInactiveTintColor: "#6b7280", // Gray 500
            tabBarIcon: ({ color, size }) => {
                let iconAsset;

                if (route.name === "Home") {
                    iconAsset = HomeIcon;
                } else if (route.name === "Matches") {
                    iconAsset = HeartIcon;
                } else if (route.name === "Inbox") {
                    iconAsset = MessageCircleIcon;
                }

                // Gluestack v3 Icon component
                return (
                    <Icon
                        as={iconAsset}
                        color={color}
                        size="lg" // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
                    />
                );
            },
            tabBarLabelStyle: {
                fontSize: 12,
                paddingBottom: 5,
            },
            tabBarStyle: {
                height: 65,
                paddingTop: 5,
            },
        })}
    >
        <Tab.Screen name="Home" component={ProfileHomeScreen} options={{ title: 'Home' }} />
        <Tab.Screen name="Matches" component={MatchesScreen} options={{ title: 'Matches' }} />
        <Tab.Screen name="Inbox" component={InboxScreen} options={{ title: 'Inbox' }} />

    </Tab.Navigator>
);

//#endregion

//#region Admin Router

const AdminStackRouter = () => (
    <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
        {/* The Tabs stay as the main entry point */}
        <Stack.Screen name="Tabs" component={AdminTabs} />

        {/* The Detail screen is pushed on top of the tabs */}
        <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
        <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
        <Stack.Screen name="StaffDetail" component={StaffDetailsScreen} />
        <Stack.Screen name="Staffmanager" component={StaffManagement} />
        <Stack.Screen name="StaffDashboard" component={StaffDashboard} />
        <Stack.Screen name="StaffScreen" component={StaffScreen} />
        <Stack.Screen name="StaffRegistration" component={StaffRegistration} />
    </Stack.Navigator>
);


const AdminTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: "#16a34a", // Emerald/Green 600
            tabBarInactiveTintColor: "#6b7280", // Gray 500
            tabBarIcon: ({ color, size }) => {
                let iconAsset;

                if (route.name === "Dashboard") {
                    iconAsset = HomeIcon;
                } else if (route.name === "Profile") {
                    iconAsset = HeartIcon;
                } else if (route.name === "Inbox") {
                    iconAsset = MessageCircleIcon;
                }
                // Gluestack v3 Icon component
                return (
                    <Icon
                        as={iconAsset}
                        color={color}
                        size="lg"
                    />
                );
            },
            tabBarLabelStyle: {
                fontSize: 12,
                paddingBottom: 5,
            },
            tabBarStyle: {
                height: 65,
                paddingTop: 5,
            },
        })}
    >
        <Tab.Screen name="Dashboard" component={AdminDashboard} options={{ title: 'Dashboard' }} />
        <Tab.Screen name="Profile" component={ProfileSummary} options={{ title: 'Profile' }} />
        <Tab.Screen name="Inbox" component={InboxScreen} options={{ title: 'Inbox' }} />
    </Tab.Navigator>
);
//#endregion

//#region Staff Router
const StaffStackRouter = () => (
    <Stack.Navigator initialRouteName="Tabs" screenOptions={{ headerShown: false }}>
        {/* The Tabs stay as the main entry point */}
        <Stack.Screen name="Tabs" component={StaffTabs} />

        {/* The Detail screen is pushed on top of the tabs */}
        <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
        <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
    </Stack.Navigator>
);
//#endregion

//#region Staff Router  
const StaffTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: "#16a34a", // Emerald/Green 600
            tabBarInactiveTintColor: "#6b7280", // Gray 500
            tabBarIcon: ({ color, size }) => {
                let iconAsset;

                if (route.name === "Dashboard") {
                    iconAsset = HomeIcon;
                } else if (route.name === "Profile") {
                    iconAsset = HeartIcon;
                } else if (route.name === "Inbox") {
                    iconAsset = MessageCircleIcon;
                }
                // Gluestack v3 Icon component
                return (
                    <Icon
                        as={iconAsset}
                        color={color}
                        size="lg"
                    />
                );
            },
            tabBarLabelStyle: {
                fontSize: 12,
                paddingBottom: 5,
            },
            tabBarStyle: {
                height: 65,
                paddingTop: 5,
            },
        })}
    >
        <Tab.Screen name="Dashboard" component={StaffDashboard} options={{ title: 'Dashboard' }} />
        <Tab.Screen name="Profile" component={ProfileSummary} options={{ title: 'Profile' }} />
        <Tab.Screen name="Inbox" component={InboxScreen} options={{ title: 'Inbox' }} />
    </Tab.Navigator>
);
//#endregion    

// --- MAIN DRAWER (The Wrapper) ---
export function RoleBasedNavigator({ userRole, user, logout }: { userRole: string, user: any, logout: any }) {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} userRole={userRole} user={user} logout={logout} />}
            screenOptions={({ navigation }) => ({
                headerTitleAlign: 'left', // Matches the image layout
                headerRight: () => (
                    <HeaderNotification
                        count={13} // This would come from your global state or API
                        onPress={() => {
                            const targetScreen = userRole === 'member' ? 'Inbox' : 'Inbox';
                            // Path: Main (Drawer) -> Tabs (Stack) -> Inbox (Tab)
                            navigation.navigate('Main', {
                                screen: 'Tabs',
                                params: { screen: targetScreen }
                            });
                        }}
                    />
                ),
                headerStyle: {
                    elevation: 0, // Removes shadow on Android
                    shadowOpacity: 0, // Removes shadow on iOS
                    borderBottomWidth: 1,
                    borderBottomColor: '#f4f4f5',
                },
            })}
        >
            {/* The first screen in the drawer is usually the Tab Navigator */}
            {userRole === 'member' ? (
                <Drawer.Screen name="Main" component={MemberStackRouter} options={{ title: 'My Shaadi' }} />
            ) : userRole === 'admin' ? (
                <Drawer.Screen name="Main" component={AdminStackRouter} options={{ title: 'Admin Panel' }} />
            ) : (
                <Drawer.Screen name="Main" component={StaffStackRouter} options={{ title: 'Staff Panel' }} />
            )}

            {/* Role-Specific Secondary Screens inside Drawer */}
            {userRole === 'member' && (
                <>
                    <Drawer.Screen name="ReceivedRequests" component={ReceivedScreen} />
                    <Drawer.Screen name="AcceptedRequests" component={AcceptedScreen} />
                    <Drawer.Screen name="MyPhotos" component={MyPhotos} options={{ title: 'My Photos' }} />
                    <Drawer.Screen name="PartnerPreferences" component={PartnerPreferences} options={{ title: 'Partner Preferences' }} />
                </>
            )}

            {(userRole === 'admin' || userRole === 'staff') && (
                <>
                    <Drawer.Screen name="StaffManage" component={StaffScreen} />
                    <Drawer.Screen name="ChurchConfig" component={ChurchSummaryScreen} />
                    <Drawer.Screen name="BaptismRecords" component={BaptismScreen} />
                </>
            )}
        </Drawer.Navigator>
    );
}
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileHomeScreen from '../screens/profile/ProfileHomeScreen';
import MatchesScreen from '../screens/profile/MatchesScreen';
import InboxScreen from '../screens/profile/InboxScreen';
import React from 'react';
import CustomDrawerContent from './CustomDrawerContent';
import { HeartIcon, HomeIcon, Icon, MessageCircleIcon } from '../components/common/IconUI';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileDetailScreen from '../screens/profile/ProfileDetailScreen';
import DynamicStackRouter, { ROLE_DRAWER_CONFIG } from './DynamicStackRouter';
import ProfileEditScreen from '../screens/profile/ProfileEditScreen';

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


// --- MAIN DRAWER (The Wrapper) ---
export function RoleBasedNavigator({ userRole, user, logout }: any) {
    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} userRole={userRole} user={user} logout={logout} />}
        >
            <Drawer.Screen name="Main" options={{ title: userRole === 'admin' ? 'Admin Dashboard' : userRole === 'staff' ? 'Staff Dashboard' : 'Member Dashboard' }}>
                {() => <DynamicStackRouter userRole={userRole} logout={logout} />}
            </Drawer.Screen>

            {ROLE_DRAWER_CONFIG[userRole]?.map(({ name, component, options }) => (
                <Drawer.Screen key={name} name={name} component={component} options={options} />
            ))}

        </Drawer.Navigator>
    );
}
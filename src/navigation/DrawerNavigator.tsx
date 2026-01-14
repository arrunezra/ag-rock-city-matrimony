import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import CustomDrawer from '../components/common/CustomDrawer';
import LandingScreen from '../screens/main/LandingScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import StaffScreen from '../screens/staff/StaffScreen';
import WizardScreen from '../screens/main/WizardScreen';
import ProfileAccess from '../screens/profile/ProfileAccess';
import ProfileDetailScreen from '../screens/profile/ProfileDetailScreen';
import TabNavigator from './TabNavigator';
import StaffDetailScreen from '../screens/staff/StaffDetailScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import StaffManagement from '../screens/staff/StaffManagement';
import ChurchManagement from '../screens/Church/ChurchManagement';
import ChurchDashboard from '../screens/Church/ChurchDashboard';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="Landing" component={LandingScreen} />
    <Stack.Screen
      name="StaffDetail"
      component={StaffDetailScreen}
      options={{ title: 'Staff Information' }}
    />
    {/* Add other screens that don't need drawer here */}
  </Stack.Navigator>
);

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: true,
        drawerStyle: {
          width: '80%',
        },
      }}>
      {/* 1. Main App (Tabs) */}
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{
          title: 'Dashboard',
          drawerLabel: 'Home',
        }}
      />

      <Drawer.Screen
        name="MainStack"
        component={MainStack}
        options={{
          title: 'Dashboard',
          drawerLabel: 'Homes',
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'My Profile',
          drawerLabel: 'Profile',
        }}
      />
      <Drawer.Screen
        name="Staff"
        component={StaffScreen}
        options={{
          title: 'Staff hardcoded',
          drawerLabel: 'Staff',
        }}
      />
      <Drawer.Screen
        name="StaffManagement"
        component={StaffManagement}
        options={{
          title: 'Staff from API',
          drawerLabel: 'Staff',
        }}
      />
      <Drawer.Screen
        name="WizardScreen"
        component={WizardScreen}
        options={{
          title: 'Wizard',
          drawerLabel: 'Wizard',
        }}
      />
      <Drawer.Screen
        name="ProfileAccess"
        component={ProfileAccess}
        options={{
          title: 'Profile Access',
          drawerLabel: 'Profile Access',
        }}
      />
      {/* Hidden Detail Screens (Not visible in drawer menu) */}
      <Drawer.Screen
        name="ProfileDetail"
        component={ProfileDetailScreen}
        options={{
          drawerItemStyle: { display: 'none' }, // Hides from menu
          title: 'Profile Detail'
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerItemStyle: { display: 'none' }, // Hides from menu
          title: 'Settings'
        }}
      />
      <Drawer.Screen
        name="ChurchDashboard"
        component={ChurchDashboard}
        options={{
          drawerItemStyle: { display: 'none' }, // Hides from menu
          title: 'Church Dashboard'
        }}
      />
      <Drawer.Screen
        name="Church"
        component={ChurchManagement}
        options={{
          drawerItemStyle: { display: 'none' }, // Hides from menu
          title: 'Church Management'
        }}
      />
    </Drawer.Navigator>
  );
}
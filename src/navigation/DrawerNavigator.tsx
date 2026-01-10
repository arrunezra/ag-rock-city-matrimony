import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import CustomDrawer from '../components/common/CustomDrawer';
import LandingScreen from '../screens/main/LandingScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import StaffScreen from '../screens/main/StaffScreen';
import WizardScreen from '../screens/main/WizardScreen';
import ProfileAccess from '../screens/profile/ProfileAccess';
import ProfileDetailScreen from '../screens/profile/ProfileDetailScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MainStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="Landing" component={LandingScreen} />
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
      <Drawer.Screen
        name="Home"
        component={MainStack}
        options={{
          title: 'Dashboard',
          drawerLabel: 'Home',
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
          title: 'Staff Management',
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
      <Drawer.Screen
        name="ProfileDetail"
        component={ProfileDetailScreen}
        options={{
          title: 'Profile Detail',
          drawerLabel: 'Profile Detail',
        }}
      />
    </Drawer.Navigator>
  );
}
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../screens/common/LoadingScreen';
import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';
import { RoleBasedNavigator } from './RoleBasedNavigator';
import SplashScreen from '../components/common/SplashScreen';

export default function AppNavigator() {
  const { isLoading, isAuthenticated, userRole, user, logout } = useAuth();

  if (isLoading) {
    // return <LoadingScreen/>
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {/* {isAuthenticated ? <DrawerNavigator /> : <AuthNavigator />} */}
      {isAuthenticated ? <RoleBasedNavigator userRole={userRole || ''} user={user || null} logout={logout} /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
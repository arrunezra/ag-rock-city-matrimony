import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import { RoleBasedNavigator } from './RoleBasedNavigator';
import SplashScreen from '../components/common/SplashScreen';

export default function AppNavigator() {
  const { isLoading, isAuthenticated, userRole, user, logout } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <RoleBasedNavigator userRole={userRole || ''} user={user || null} logout={logout} /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
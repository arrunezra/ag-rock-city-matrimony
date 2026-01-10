import  { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/authService';
import { AuthContextType,User } from '../utils/models';

 

// 3. Create the Context with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  useEffect(() => {
    checkAuthStatus();
  }, []);

const checkAuthStatus = async () => {
    try {
      // Updated keys to match our new logic
      const access = await AsyncStorage.getItem('accessToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (access && userData) {
        setAccessToken(access);
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth status check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

 const login = async (credentials: any) => {
    try {
      const response = await authService.login(credentials);
      
      // The backend returns access_token and refresh_token now
      if (response.access_token) {
        await AsyncStorage.setItem('accessToken', response.access_token);
        await AsyncStorage.setItem('refreshToken', response.refresh_token);
        
        if (response.user) {
          await AsyncStorage.setItem('userData', JSON.stringify(response.user));
          setUser(response.user);
        }
        
        setAccessToken(response.access_token);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error: any) {
      return { success: false, message: error.response?.message || error.message };
    }
  };
  const logout = async () => {
    try {
      // 1. Notify Backend (Optional)
      await authService.logout();
    } catch (e) {
      // Even if network fails, we clear local session
    } finally {
      // 2. Clear ALL local data
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);
      return { success: true };
    }
  };
const signup = async (userData: any) => {
    try {
      return await authService.signup(userData);
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

 

const updateUser = async (updatedData: any) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
      setUser(updatedData);
    } catch (error) {
      console.error('Update user error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading, 
        accessToken,
        isAuthenticated,
        login,
        signup,
        logout,
        updateUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Custom hook with error handling for undefined context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
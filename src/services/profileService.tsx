import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";

 
export const authService = {
  login: async (credentials: any) => {
    console.log('credentials',credentials)
    const response = await api.post('/auth/login.php', credentials);
    console.log(response);
    return response.data;
  },
   uploadImage: async (credentials: any) => {

    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      credentials.headers.Authorization = `Bearer ${token}`;
    }



    console.log('credentials',credentials)
    const response = await api.post('/upload_handler.php', credentials);
    console.log(response);
    return response.data;
  },
//   signup: async (userData: any) => {
//     const response = await api.post('/users/register.php', userData);
//     return response.data;
//   },
  
//  logout: async () => {
//     try {
//       // Optional: Tell backend to invalidate the refresh token in DB
//       await api.post('/auth/logout.php'); 
//     } finally {
//       // Always clear local storage
//       await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
//     }
//   },
//   getUser: async () => {
//     const data = await AsyncStorage.getItem('userData');
//     return data ? JSON.parse(data) : null;
//   },
//   verifyToken: async () => {
//     const response = await api.get('/auth/verify.php');
//     return response.data;
//   },
//   forgotPassword: async (email: string) => {
//     const response = await api.post('/auth/forgot_password.php', { email });
//     return response.data;
//   },
};

export default authService;
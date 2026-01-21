import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";


export const profileService = {
  login: async (credentials: any) => {
    console.log('credentials', credentials)
    const response = await api.post('/auth/login.php', credentials);
    console.log(response);
    return response.data;
  },
  uploadImage: async (credentials: any) => {

    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      credentials.headers.Authorization = `Bearer ${token}`;
    }
    console.log('credentials', credentials)
    const response = await api.post('/upload_handler.php', credentials);
    console.log(response);
    return response.data;
  },
  sendInterest: async (credentials: any) => {
    console.log('credentials', credentials)
    const response = await api.post('/interest/send_interest.php', credentials);
    console.log(response);
    return response.data;
  },
  getprofile: async (credentials: any) => {
    console.log('credentials', credentials)
    const response = await api.post('/profile/getprofile.php', credentials);
    console.log(response);
    return response.data;
  },
};

export default profileService;
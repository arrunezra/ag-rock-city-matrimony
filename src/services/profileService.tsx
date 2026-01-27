import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";


export const profileService = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/login.php', credentials);
    return response.data;
  },
  uploadImage: async (credentials: any) => {

    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      credentials.headers.Authorization = `Bearer ${token}`;
    }
    const response = await api.post('/upload_handler.php', credentials);
    return response.data;
  },
  sendInterest: async (credentials: any) => {
    const response = await api.post('/interest/send_interest.php', credentials);
    return response.data;
  },
  createProfile: async (profile: any) => {
    const response = await api.post('/profile/complete_profile.php', profile)
    return response.data;
  },
  getCities: async (stateId: any, searchQuery: string | null = null) => {
    const url = searchQuery
      ? `/helpers/get_cities.php?statecode=${stateId}&search=${encodeURIComponent(searchQuery)}`
      : `/helpers/get_cities.php?statecode=${stateId}`;
    const response = await api.get(url);
    return response.data;
  },
  getprofile: async (credentials: any) => {
    const response = await api.post('/profile/getprofile.php', credentials);
    return response.data;
  },
  validateMobileOrEmail: async (credentials: any) => {
    const response = await api.post('/profile/validate_mobileno.php', credentials);
    return response.data;
  },
};

export default profileService;
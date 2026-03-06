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
  getDashboardData: async () => {
    try {
      const response = await api.get('/profile/get_dashboard.php');
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: "Network connection failed" };
    }
  },
  fetchProfileDetailsByID: async (id: any) => {
    try {
      const response = await api.get(`/profile/get_profile_details_by_id.php?id=${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: "Network connection failed" };
    }
  },
  verifyorStatusUpdate: async (id: any, status: any, aciton: string) => {
    try {
      const response = await api.get(`/profile/Verifiy_profile.php?id=${id}&status=${status}&action=${aciton}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: "Network connection failed" };
    }
  },
  fetchProfileGallery: async (userid: any, profile_id: any) => {
    try {
      const response = await api.get(`/profile/get_profile_gallery.php?userid=${userid}&profile_id=${profile_id}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: "Network connection failed" };
    }
  },
  setDefaultOrDeleteProfileImage: async (profile_id: any, image_id: any, action: string) => {
    try {
      const response = await api.post(`/profile/set_default_or_delete_profile_image.php`, {
        action: action,
        profile_id: profile_id,
        image_id: image_id,
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return error.response.data;
      }
      return { success: false, message: "Network connection failed" };
    }
  },
};

export default profileService;
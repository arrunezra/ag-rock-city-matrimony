// hooks/useProfileUpload.ts
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import NetInfo from "@react-native-community/netinfo";
import { cleanupImage, handleImageCompression } from '../utils/ImageService';
import api from '../api/api';
import { useAlert } from '../context/AlertContext';

export const useProfileUpload = (userid: string, profileid: any, onUploadSuccess: (urls: any) => void) => {
  const { showAlert, hideAlert } = useAlert();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isOffline, setIsOffline] = useState(false);

  // Monitor Network
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  const startUpload = async (from: any, profilepic: any) => {
    console.log('profileid=', from, profileid)
    let url = `/files/${from == 'gallery' ? 'profile_gallery_upload.php' : 'profile_photo_upload.php'}`;
    if (isOffline) {
      Alert.alert("Offline", "Please check your internet connection.");
      return;
    }

    let tempUri: string | undefined;

    try {
      const image = await ImagePicker.openPicker({
        cropping: true,
        cropperCircleOverlay: from !== 'gallery',
        mediaType: 'photo',
        multiple: false
      });

      setIsUploading(true);
      setUploadProgress(0);

      // 1. Optimize
      const compressed = await handleImageCompression(image);
      if (!compressed) throw new Error("Compression failed");
      tempUri = compressed.uri;

      // 2. Upload
      const uploadData = new FormData();
      uploadData.append('file', {
        uri: compressed.uri,
        type: compressed.type,
        name: compressed.name,
      } as any);
      uploadData.append('userid', userid);
      uploadData.append('profile_id', profileid);
      const response = await api.post(url, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: ({ loaded, total }) => {
          if (total && total > 0) {
            // Calculate progress and clamp it to a maximum ceiling of 100
            const progressPercentage = Math.min(Math.round((loaded * 100) / total), 100);
            setUploadProgress(progressPercentage);
          }

        }
      });

      if (response.data.success) {
        onUploadSuccess(response.data);
      } else {
        throw new Error(response.data.message || "Upload failed");
      }

    } catch (error: any) {
      if (error.message !== 'User cancelled image selection') {
        showAlert({
          type: 'error',
          title: 'Gallery Info.',
          message: error.message || "Something went wrong. Please try again.",
          confirmText: "OK",
          onConfirm: async () => {
            setIsUploading(false);
            hideAlert();
          }
        });
        // Alert.alert("Error", error.message);
      }
    } finally {
      setIsUploading(false);
      if (tempUri) await cleanupImage(tempUri);
    }
  };

  return { startUpload, isUploading, uploadProgress, isOffline };
};
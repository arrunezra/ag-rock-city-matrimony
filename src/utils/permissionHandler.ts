import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { Platform, Alert } from 'react-native';

export const PermissionTypes = {
  STORAGE: Platform.OS === 'ios'  ? PERMISSIONS.IOS.PHOTO_LIBRARY : (Platform.OS === 'android' && Platform.Version >= 33 ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE),
  //LOCATION: Platform.OS === 'ios'  ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE   : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  CAMERA: Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
};

export const requestPermission = async (permission: any) => {
  const status = await check(permission);

  switch (status) {
    case RESULTS.GRANTED:
      return true;
    case RESULTS.DENIED:
      // Request permission if not already denied permanently
      const requestStatus = await request(permission);
      return requestStatus === RESULTS.GRANTED;
    case RESULTS.BLOCKED:
      // Permission is permanently denied, send user to settings
      Alert.alert(
        'Permission Blocked',
        'Please enable this permission in your device settings to use this feature.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => openSettings() }
        ]
      );
      return false;
    default:
      return false;
  }
};
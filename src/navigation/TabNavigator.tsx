import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 import api from '@/src/api/api';
import LandingScreen from '../screens/main/LandingScreen';
import ProfileAccess from '../screens/profile/ProfileAccess';
import { Icon, HomeIcon,  UserIcon  } from '@/src/components/common/IconUI';

 
//import RequestsScreen from '../screens/RequestsScreen'; // This is your 'Interests' screen

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch interest count for the badge
  const updateBadge = async () => {
    try {
      const res = await api.get('/get_notification_count.php');
      if (res.data.success) setUnreadCount(res.data.count);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    updateBadge();
    const interval = setInterval(updateBadge, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // Drawer will provide the header
        tabBarActiveTintColor: '#06b6d4', // Cyan color from your UI
        tabBarStyle: { height: 60, paddingBottom: 8 },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={LandingScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Icon as={HomeIcon} className={color} />,
        }}
      />
      <Tab.Screen 
        name="ProfileAccess" 
        component={ProfileAccess} 
        options={{
          tabBarLabel: 'Access',
          tabBarIcon: ({ color }) => <Icon as={UserIcon} className={color} />,
        }}
      />
     
    </Tab.Navigator>
  );
}
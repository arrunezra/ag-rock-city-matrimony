import React from 'react';
import { FlatList } from 'react-native';
import { Box, VStack } from '@/src/components/common/GluestackUI';
import SectionHorizontalList from './home_sub_screen/SectionHorizontalList';
import FastImage from '@d11/react-native-fast-image';
import UserTopProfile from './home_sub_screen/UserTopProfile';
import { useAuth } from '@/src/context/AuthContext';
import { HOME_DATA } from '@/src/utils/constants';

const ProfileHomeScreen = () => {
    const { user } = useAuth();
    const VipBanner = () => (
        <Box className="mx-4 my-2 rounded-3xl overflow-hidden bg-purple-50">
            <FastImage
                source={require('../../assets/images/aglogo.png')}
                style={{ width: '100%', height: 180 }}
                resizeMode={FastImage.resizeMode.stretch}
            />
        </Box>
    );
    const renderItem = ({ item }: any) => {
        switch (item.type) {
            case 'USER_HEADER':
                return <UserTopProfile profile={user} />;
            // case 'BANNER_SLIDER':
            //     return <VipBanner />;
            case 'PREMIUM_MATCHES':
            case 'NEW_MATCHES':
                return (
                    <SectionHorizontalList
                        title={item.title}
                        data={item.data}
                        isPremium={item.type === 'PREMIUM_MATCHES'}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Box className="flex-1 bg-white">
            <FlatList
                data={HOME_DATA}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.type + index}
                showsVerticalScrollIndicator={false}
                // Optimization props
                removeClippedSubviews={true}
                initialNumToRender={3}
                maxToRenderPerBatch={5}
                windowSize={5}
            />
        </Box>
    );
}

export default ProfileHomeScreen;

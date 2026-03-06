import { useAuth } from '@/src/context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import UserTopProfile from './home_sub_screen/UserTopProfile';
import SectionHorizontalList from './home_sub_screen/SectionHorizontalList';
import { Box } from '@/src/components/common/GluestackUI';
import { FlatList } from 'react-native';
import { HOME_DATA } from '@/src/utils/constants';

const ProfileHomeScreen = () => {
    const { user } = useAuth();
    const navigation = useNavigation<any>();

    const renderItem = ({ item }: any) => {
        switch (item.type) {
            case 'USER_HEADER':
                return (
                    <UserTopProfile
                        profile={user}
                        onAddPhoto={() => navigation.navigate('ShowProfileGallery')}
                        onEdit={() => navigation.navigate('ProfileEdit', { profile: user })}
                    />
                );
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
            />
        </Box>
    );
}
export default ProfileHomeScreen;
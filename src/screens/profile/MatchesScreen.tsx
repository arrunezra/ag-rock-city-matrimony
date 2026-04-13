import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, ActivityIndicator, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Box, Spinner, Center, HStack, Text } from '@/src/components/common/GluestackUI';
import api from '@/src/api/api';
import { ProfileCard } from './ProfileCard';
import { useNavigation } from '@react-navigation/native';
import { profileService } from '@/src/services/profileService';
import LottieView from 'lottie-react-native';
import NotFoundScreen from '../common/NotFoundScreen';
import FailedScreen from '../common/FailedScreen';
import { SkeletonItem } from '../common/SkeletonItem';
import { SearchActionsheet } from './home_sub_screen/SearchActionsheet';
import { ProfileCardSkeleton } from '../common/ProfileCardSkeleton';
import { useAuth } from '@/src/context/AuthContext';

const MatchesScreen = () => {
    const { user } = useAuth();

    const navigation = useNavigation<any>();
    const [profiles, setProfiles] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('New');
    const [showFilters, setShowFilters] = useState(false); // Fix for More Match click

    const [filters, setFilters] = useState({
        gender: '',
        marital_status: '',
        annual_income: '',
        min_age: 24,
        max_age: 54
    });

    // Added 'currentFilters' argument to prevent stale state issues
    const fetchProfiles = async (pageNumber: number, shouldRefresh = false, currentFilters = filters) => {
        if (loading || (pageNumber > totalPages && !shouldRefresh)) return;

        setLoading(true);
        try {
            let postBody = {
                page: pageNumber,
                ...currentFilters,
                filter_type: selectedFilter // Usually needed by backends to distinguish tabs
            };

            const response = await profileService.getprofile(postBody);

            if (response.success) {
                const newData = response.data;
                // Correctly handling totalPages from response structure
                setTotalPages(response.totalPages || 1);
                setProfiles(shouldRefresh ? newData : [...profiles, ...newData]);
                setPage(pageNumber);
            } else {
                if (response.message === "Record not found") {
                    setProfiles([]);
                }
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Initial Load
    useEffect(() => {
        fetchProfiles(1, true);
    }, []);

    // Trigger fetch when tab changes
    useEffect(() => {
        fetchProfiles(1, true);
    }, [selectedFilter]);

    const handleRefresh = async () => {
        setRefreshing(true);
        setPage(1);
        await fetchProfiles(1, true);
    };

    const handleLoadMore = () => {
        if (!loading && page < totalPages) {
            const nextPage = page + 1;
            fetchProfiles(nextPage);
        }
    };

    // This is what your "Search Now" button should call
    const applyFilters = (newFilters: any) => {
        setFilters(newFilters);
        setShowFilters(false);
        setPage(1);
        fetchProfiles(1, true, newFilters); // Pass directly to avoid async state lag
    };

    const renderFooter = () => {
        if (!loading || profiles.length === 0) return null;
        return (
            <Center className="py-10">
                <Spinner size="large" color="$cyan500" />
            </Center>
        );
    };

    const renderContent = () => {
        if (loading && profiles.length === 0) {
            return (
                //Its working but not mathch this scenario i want card view so i commented this
                // <Box className="px-4 py-2">
                //     {[1, 2, 3, 4, 5].map((i) => <SkeletonItem key={i} />)}
                // </Box>
                <Box className="px-4 py-2">
                    <ProfileCardSkeleton />
                </Box>
            );
        }

        return (
            <FlatList
                data={profiles}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item }) => (
                    <Box className="px-4">
                        <ProfileCard
                            user={user}
                            profile={item}
                            onPress={() => navigation.navigate('ProfileDetail', { profile_id: item.profile_id })}
                        />
                    </Box>
                )}
                ListEmptyComponent={!loading ? <NotFoundScreen /> : null}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.3} // Better for smooth infinite scroll
                ListFooterComponent={renderFooter}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            />
        );
    };

    return (

        <Box className="flex-1 bg-background-50">
            {/* 1. Header / Tabs (Height determined by content) */}
            <Box className="pt-4 bg-white border-b border-outline-50">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <HStack className="gap-2 pb-4 px-4">
                        {['New', 'My Match', 'More Match'].map((filter: any) => (
                            <Pressable
                                key={filter}
                                onPress={() => filter === 'More Match' ? setShowFilters(true) : setSelectedFilter(filter)}
                                className={`px-5 py-2.5 rounded-full border shadow-sm ${selectedFilter === filter ? 'bg-primary-500 border-primary-500' : 'bg-white border-outline-200'
                                    }`}
                            >
                                <Text className={`text-sm font-bold ${selectedFilter === filter ? 'text-white' : 'text-typography-600'}`}>
                                    {filter}
                                </Text>
                            </Pressable>
                        ))}
                    </HStack>
                </ScrollView>
            </Box>

            {/* 2. Content Area (Fills the entire remaining screen) */}
            <Box className="flex-1">
                {renderContent()}
            </Box>

            <SearchActionsheet
                isOpen={showFilters}
                onClose={() => setShowFilters(false)}
                initialFilters={filters}
                onApply={(newFilters: any) => {
                    setFilters(newFilters);
                    setShowFilters(false);
                }}
            />
        </Box>
    );
}

export default MatchesScreen;

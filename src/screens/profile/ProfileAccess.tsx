import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, ActivityIndicator } from 'react-native';
import { Box, Spinner, Center } from '@/src/components/common/GluestackUI';
import api from '@/src/api/api';
import { ProfileCard } from './ProfileCard';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    marital_status: '',
    annual_income: '',
    min_age: '',
    max_age: ''
  });
  const fetchProfiles = async (pageNumber: number, shouldRefresh = false) => {
    if (loading || (pageNumber > totalPages && !shouldRefresh)) return;

    setLoading(true);
    try {
      // CONVERTED TO POST
      const response = await api.post('/profile/getprofiles.php', {
        page: pageNumber,
        ...filters // Send all filter values in the body
      });

      if (response.data.success) {
        const newData = response.data.data;
        setProfiles(shouldRefresh ? newData : [...profiles, ...newData]);
        setTotalPages(response.data.totalPages);
        setPage(pageNumber);
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

  // Pull to Refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchProfiles(1, true);
  };

  // Load More (Pagination)
  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProfiles(nextPage);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <Center className="py-10">
        <Spinner size="large" color="$cyan500" />
      </Center>
    );
  };

  return (
    <Box className="flex-1 bg-background-50">
      <FlatList
        data={profiles}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <Box className="px-4">
            <ProfileCard profile={item} onPress={() => navigation.navigate('ProfileDetail', { profile: item })} />
          </Box>
        )}
        // Performance Props
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={5}
        // Pagination & Refresh
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} // Load more when 50% from bottom
        ListFooterComponent={renderFooter}
      />
    </Box>
  );
}
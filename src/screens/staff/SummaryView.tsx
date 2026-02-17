import { RefreshControl, TouchableOpacity, Linking, Pressable, ScrollView, FlatList, ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { MotiView } from 'moti';
import {
    VStack, HStack, Box, Text, Heading,
    Input,
    InputSlot,
    InputField,
} from '@/src/components/common/GluestackUI';
import {
    Icon,
    PhoneIcon, Users, CheckCircle2
} from '@/src/components/common/IconUI';

import LinearGradient from "react-native-linear-gradient";
import FastImage from "@d11/react-native-fast-image";
import { Edit3Icon, SearchIcon, Settings2, XCircle, XIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import StaffService from "@/src/services/StaffService";
import { StaffSummarySkeleton } from "./DashboardSkeleton";
const StaffItem = ({ item, index, navigation }: any) => (
    <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{
            type: 'timing',
            duration: 400,
            delay: index * 100
        }}
    >
        <Pressable
            onPress={() => navigation.navigate("Main", { screen: "ViewStaffinforamtion", params: { id: item.id } })}
            className="mb-3 mx-4 active:scale-[0.98] transition-transform"
        >
            <LinearGradient
                colors={['#ffffff', '#f8fafc']}
                style={{
                    borderLeftWidth: 6,
                    borderLeftColor: item.activeStatus === 'Active' ? '#10b981' : '#cbd5e1'
                }}
                className="p-4 rounded-r-[28px] rounded-l-[10px] border border-slate-100 flex-row items-center shadow-sm"
            >
                <Box className="h-14 w-14 rounded-full bg-slate-100 border-2 border-white shadow-sm items-center justify-center overflow-hidden">
                    <Text className="font-bold text-slate-400 text-lg">{item.full_name[0]}</Text>
                </Box>

                <VStack className="ml-4 flex-1">
                    <Text className="font-bold text-slate-800 text-base" numberOfLines={1}>
                        {item.full_name}
                    </Text>
                    <Text className="text-[11px] text-slate-500 font-bold uppercase tracking-wide">
                        {item.designation_name}
                    </Text>
                </VStack>

                <HStack space="xs" className="items-center">
                    <TouchableOpacity
                        onPress={() => item.mobileNo && Linking.openURL(`tel:${item.mobileNo}`)}
                        className="h-10 w-10 bg-cyan-600 rounded-full items-center justify-center shadow-md shadow-cyan-100"
                    >
                        <Icon as={PhoneIcon} size="sm" className="text-white" />
                    </TouchableOpacity>
                </HStack>
            </LinearGradient>
        </Pressable>
    </MotiView>
);
const StaffSummaryView = ({ navigation }: any) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [filters, setFilters] = useState({ church_name: '', denomination: '', active_status: 'Active' });
    const [staffList, setStaffList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        // Set a timer to update filters after 500ms of inactivity
        const delayDebounceFn = setTimeout(() => {
            setFilters(prev => ({ ...prev, church_name: searchTerm }));
        }, 500);

        // Cleanup: If the user types again within 500ms, the previous timer is cancelled
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);


    useEffect(() => { fetchStaff(1, false); }, [filters]);

    const fetchStaff = async (pageNumber = 1, shouldAppend = false) => {
        // 1. Double check page limits
        if (pageNumber > totalPages && shouldAppend) return;

        // Set loading states based on whether it's the first page or pagination
        if (shouldAppend) {
            setIsMoreLoading(true);
        } else {
            setLoading(true);
        }

        try {
            const res = await StaffService.fetchSummaryStaffData({
                action: 'fetch',
                Church_Id: '',
                page: pageNumber,
                limit: 10,
                search: searchQuery
            });

            if (res.success) {
                // Functional state update is safer for list manipulation
                setStaffList(prev => shouldAppend ? [...prev, ...res.data] : res.data);
                setTotalPages(res.pagination.total_pages);
                setPage(pageNumber);
            }
        } catch (e) {
            console.error("Fetch Error:", e);
        } finally {
            setTimeout(() => {
                setLoading(false);
                setRefreshing(false);
                setIsMoreLoading(false);
            }, 2000);
        }
    };

    const handleLoadMore = () => {
        // 2. Added isMoreLoading check to prevent "Double Fetching"
        if (!isMoreLoading && page < totalPages) {
            const nextPage = page + 1;
            fetchStaff(nextPage, true);
        }
    };
    const onRefresh = async () => {
        setRefreshing(true);
        setPage(1);
        await fetchStaff(1, false);
        setRefreshing(false);
    };


    return (

        /* 1. REMOVE the outer ScrollView/KeyboardAwareScrollView entirely */

        <FlatList
            data={staffList || []}
            keyExtractor={(item: any) => item.id.toString()}
            renderItem={({ item, index }) => (
                <StaffItem item={item} index={index} navigation={navigation} />
            )}

            /* 2. Put EVERYTHING top-level into the Header */
            ListHeaderComponent={() => (
                <VStack space="lg" className="p-4">
                    {/* Search & Filter Section */}
                    <VStack space="md" className="mt-2">
                        <HStack space="sm" className="items-center">
                            <Input variant="rounded" className="flex-1 h-12 bg-white border-slate-100 shadow-sm shadow-slate-200/50">
                                <InputSlot className="pl-4">
                                    <Icon as={SearchIcon} className="text-cyan-600" size="sm" />
                                </InputSlot>
                                <InputField
                                    placeholder="Search staff members..."
                                    value={searchTerm}
                                    onChangeText={setSearchTerm}
                                    className="text-sm font-semibold text-slate-800"
                                />
                                {searchTerm.length > 0 && (
                                    <InputSlot className="pr-3">
                                        <TouchableOpacity onPress={() => setSearchTerm('')} className="bg-slate-100 rounded-full p-1">
                                            <Icon as={XIcon} size="xs" className="text-slate-500" />
                                        </TouchableOpacity>
                                    </InputSlot>
                                )}
                            </Input>
                            <TouchableOpacity className="w-12 h-12 bg-slate-900 rounded-2xl items-center justify-center shadow-lg">
                                <Icon as={Settings2} className="text-cyan-400" size="sm" />
                            </TouchableOpacity>
                        </HStack>

                        {/* Horizontal Filter Chips */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <HStack space="xs">
                                {['Active', 'Inactive'].map((filter) => {
                                    const isActive = filters.active_status === filter;
                                    return (
                                        <TouchableOpacity
                                            key={filter}
                                            onPress={() => setFilters({ ...filters, active_status: isActive ? '' : filter })}
                                            className={`px-5 py-2.5 rounded-2xl border ${isActive ? 'bg-slate-900 border-slate-900 shadow-md' : 'bg-white border-slate-200 shadow-sm'}`}
                                        >
                                            <HStack space="xs" className="items-center">
                                                {isActive && <Box className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1" />}
                                                <Text className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                                    {filter}
                                                </Text>
                                            </HStack>
                                        </TouchableOpacity>
                                    );
                                })}
                            </HStack>
                        </ScrollView>
                    </VStack>

                    {/* Title Section */}
                    <HStack className="justify-between items-center px-1 mt-2">
                        <VStack>
                            <Heading size="md" className="text-slate-800 font-black">Recent Members</Heading>
                            <Text className="text-slate-400 text-xs font-medium">Recently updated profiles</Text>
                        </VStack>
                    </HStack>
                </VStack>
            )}

            ListEmptyComponent={() => (
                loading ? (
                    <StaffSummarySkeleton />
                ) : (
                    <VStack className="py-20 items-center justify-center">
                        <Text className="text-slate-400 font-bold">No Staff Found</Text>
                    </VStack>
                )
            )}

            /* 3. Footer for Infinite Loading */
            ListFooterComponent={() => isMoreLoading && (
                <Box className="py-10">
                    <ActivityIndicator color="#0891b2" />
                </Box>
            )}

            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#0891b2"
                />
            }
            onEndReachedThreshold={0.5}
            onEndReached={handleLoadMore}
            showsVerticalScrollIndicator={false}
            className="flex-1 bg-slate-50"
        />

    );
};

export default StaffSummaryView;
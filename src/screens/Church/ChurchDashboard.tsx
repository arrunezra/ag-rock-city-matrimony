import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Box, VStack, HStack, Text, Heading, Spinner, Divider, Center } from '@/src/components/common/GluestackUI';
import api from '@/src/api/api';

export default function ChurchDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await api.post('/church/churchmanagment.php', { action: 'fetch_stats' });
            if (res.data.success) setStats(res.data);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchStats(); }, []);

    if (loading) return <Center className="flex-1"><Spinner size="large" /></Center>;

    return (
        <ScrollView className="flex-1 bg-background-50 p-4">
            <Heading size="xl" className="mb-4 text-primary-900">System Overview</Heading>

            {/* Primary Metric: Total Churches */}
            <Box className="bg-primary-600 p-6 rounded-2xl shadow-md mb-6">
                <Text className="text-primary-100 font-bold uppercase tracking-wider">Total Registered Churches</Text>
                <Heading size="4xl" className="text-white mt-2">{stats?.total}</Heading>
            </Box>

            {/* Row: Status Breakdown */}
            <Heading size="md" className="mb-3">Church Status</Heading>
            <HStack space="md" className="mb-6 flex-wrap">
                {stats?.by_status.map((item: any) => (
                    <Box key={item.label} className="bg-white p-4 rounded-xl border border-outline-100 flex-1 min-w-[140px] mb-2">
                        <Text size="xs" className="text-typography-500 uppercase font-bold">{item.label}</Text>
                        <Text size="xl" className="font-bold text-primary-700">{item.value}</Text>
                    </Box>
                ))}
            </HStack>

            <Divider className="my-4" />

            {/* Row: Denomination Breakdown */}
            <Heading size="md" className="mb-3">By Denomination</Heading>
            <VStack space="sm">
                {stats?.by_denomination.map((item: any) => (
                    <HStack key={item.label} className="bg-white p-4 rounded-xl items-center justify-between border border-outline-100">
                        <Text className="font-medium text-typography-700">{item.label}</Text>
                        <Box className="bg-primary-100 px-3 py-1 rounded-full">
                            <Text className="text-primary-700 font-bold">{item.value}</Text>
                        </Box>
                    </HStack>
                ))}
            </VStack>
        </ScrollView>
    );
}
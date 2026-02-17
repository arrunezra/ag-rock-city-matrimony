import { View, Text } from 'react-native'
import React from 'react'
import { Box, Link, LinkText } from '@/src/components/common/GluestackUI'

const AdminDashboard = ({ navigation }: any) => {
    return (
        <View>
            <Text>Admin Dashboard</Text>
            <Box className="flex flex-col gap-6">
                <Link onPress={() =>
                    navigation.navigate('Main', {
                        screen: 'StaffScreen'
                    })}>
                    <LinkText className="text-primary-500 font-semibold no-underline">
                        Staff
                    </LinkText>
                </Link>
                <Link onPress={() =>
                    navigation.navigate('Main', {
                        screen: 'Staffmanager'
                    })}>
                    <LinkText className="text-primary-500 font-semibold no-underline">
                        Staffmanager
                    </LinkText>
                </Link>

                <Link onPress={() =>
                    navigation.navigate('Main', {
                        screen: 'StaffDetail'
                    })}>
                    <LinkText className="text-primary-500 font-semibold no-underline">
                        StaffDetail
                    </LinkText>
                </Link>
                <Link onPress={() =>
                    navigation.navigate('Main', {
                        screen: 'StaffRegistration'
                    })}>
                    <LinkText className="text-primary-500 font-semibold no-underline">
                        StaffRegistration
                    </LinkText>
                </Link>
            </Box>
        </View>
    )
}

export default AdminDashboard
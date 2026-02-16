import { View, Text } from 'react-native'
import React from 'react'
import { Box, Link, LinkText } from '@/src/components/common/GluestackUI'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdminStackParamList } from '@/src/types/navigation';
type Props = {
    navigation: NativeStackNavigationProp<AdminStackParamList, 'ChurchSummary'>;
};
const ChurchSummaryScreen = ({ navigation }: Props) => {
    return (
        <View>
            <Text>ChurchSummaryScreen</Text>
            {/* Sign Up Link */}

        </View>
    )
}

export default ChurchSummaryScreen
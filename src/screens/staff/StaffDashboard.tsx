import { Box, Link, LinkText } from "@/src/components/common/GluestackUI";
import { Text, View } from "react-native";

const StaffDashboard = ({ navigation }: any) => {
    return (
        <View>
            <Text>StaffDashboard</Text>
            <Box className="flex flex-col gap-6">
                <Link onPress={() => navigation.navigate('StaffScreen')}>
                    <LinkText className="text-primary-500 font-semibold no-underline">
                        Staff
                    </LinkText>
                </Link>
                <Link onPress={() => navigation.navigate('Staffmanager')}>
                    <LinkText className="text-primary-500 font-semibold no-underline">
                        Staffmanager
                    </LinkText>
                </Link>

                <Link onPress={() => navigation.navigate('StaffDetail')}>
                    <LinkText className="text-primary-500 font-semibold no-underline">
                        StaffDetail
                    </LinkText>
                </Link>
                <Link onPress={() => navigation.navigate('StaffRegistration')}>
                    <LinkText className="text-primary-500 font-semibold no-underline">
                        StaffRegistration
                    </LinkText>
                </Link>

            </Box>
        </View>
    );
};

export default StaffDashboard;

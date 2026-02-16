import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../types/navigation";
import ChurchDashboard from "../screens/Church/ChurchDashboard";
import ChurchSummaryScreen from "../screens/Church/ChurchSummaryScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HeartIcon, HomeIcon, Icon, MessageCircleIcon } from "../components/common/IconUI";
import AdminDashboard from "../screens/Admin/AdminDashboard";
import ProfileSummary from "../screens/profile/ProfileSummary";
import InboxScreen from "../screens/profile/InboxScreen";
import ChurchManagement from "../screens/Church/ChurchManagement";
import ChurchRegistrationScreen from "../screens/Church/ChurchRegistrationScreen";

const Stack = createNativeStackNavigator<AdminStackParamList>();
const Tab = createBottomTabNavigator();


const AdminTabs = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: "#16a34a", // Emerald/Green 600
            tabBarInactiveTintColor: "#6b7280", // Gray 500
            tabBarIcon: ({ color, size }) => {
                let iconAsset;

                if (route.name === "Dashboard") {
                    iconAsset = HomeIcon;
                } else if (route.name === "Profile") {
                    iconAsset = HeartIcon;
                } else if (route.name === "Inbox") {
                    iconAsset = MessageCircleIcon;
                }
                // Gluestack v3 Icon component
                return (
                    <Icon
                        as={iconAsset}
                        color={color}
                        size="lg"
                    />
                );
            },
            tabBarLabelStyle: {
                fontSize: 12,
                paddingBottom: 5,
            },
            tabBarStyle: {
                height: 65,
                paddingTop: 5,
            },
        })}
    >
        <Tab.Screen name="Dashboard" component={AdminDashboard} options={{ title: 'Dashboard' }} />
        <Tab.Screen name="Profile" component={ProfileSummary} options={{ title: 'Profile' }} />
        <Tab.Screen name="Inbox" component={InboxScreen} options={{ title: 'Inbox' }} />
    </Tab.Navigator>
);

const AdminStackRouter = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={AdminTabs} />
        <Stack.Group screenOptions={{ presentation: 'fullScreenModal', headerShown: false }}>
            <Stack.Screen name="ChurchRegistration" component={ChurchRegistrationScreen} options={{ title: 'Church Registration' }} />
        </Stack.Group>
        <Stack.Screen name="ChurchSummary" component={ChurchSummaryScreen} options={{ title: 'Church Details' }} />
        <Stack.Screen name="ChurchManagement" component={ChurchManagement} options={{ title: 'Church Management' }} />
        {/* TypeScript will now error if you use "Churchdash" here! */}
    </Stack.Navigator>
);

export default AdminStackRouter
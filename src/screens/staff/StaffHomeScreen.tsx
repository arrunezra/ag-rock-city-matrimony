import { Box, Heading, HStack, Link, LinkText, VStack } from "@/src/components/common/GluestackUI";
import { Icon, UserCheck } from "@/src/components/common/IconUI";
import StaffService from "@/src/services/StaffService";
import { Activity, ChevronRight, Edit2, Edit3Icon, Phone, PhoneIcon, Plus, Users, UserX } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { Alert, Linking, Pressable, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import LinearGradient from "react-native-linear-gradient";
import { StatusAlert } from "../common/StatusAlert";
import { MotiView } from "moti";
import DashboardSkeleton from "./DashboardSkeleton";

const StaffInboxScreen = ({ navigation }: any) => {

    return (
        <KeyboardAwareScrollView bottomOffset={0} className="flex-1 bg-slate-50 p-4" showsVerticalScrollIndicator={false}   >

            <Text>Staff Inbox Screen
                New verificaion photos
            </Text>
        </KeyboardAwareScrollView>
    );
}

export default StaffInboxScreen;

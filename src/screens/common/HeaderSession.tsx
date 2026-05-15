import React from 'react';
import { Platform, StatusBar, TouchableOpacity } from 'react-native';
import { Box, VStack, HStack, Heading, Text } from '@/src/components/common/GluestackUI';
import { MotiView, MotiText } from 'moti';
import { Menu, Bell, ChevronLeft, Search, X } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from '@/src/components/common/IconUI';

interface HeaderProps {
    title: string;
    theme?: 'midnight' | 'emerald' | 'slate';
    leftIconType?: 'menu' | 'back' | 'none';
    onLeftPress?: () => void;
    showRightIcon?: boolean;
    rightIconType?: 'bell' | 'search' | 'close';
    onRightPress?: () => void;
}
// Use this to get the height on Android/iOS
const getStatusBarHeight = () => {
    return Platform.select({
        ios: 44, // Standard iOS height, though useSafeAreaInsets is better for Dynamic Island
        android: StatusBar.currentHeight || 0,
        default: 0,
    });
};
const HeaderSession = ({
    title,
    theme = 'emerald',
    leftIconType = 'menu',
    onLeftPress,
    showRightIcon = true,
    rightIconType = 'close',
    onRightPress
}: HeaderProps) => {

    const palettes = {
        midnight: ['#1E1B4B', '#0F172A'],
        emerald: ['#064E3B', '#022C22'],
        slate: ['#334155', '#0F172A']
    };

    const LeftIcon = leftIconType === 'menu' ? Menu : ChevronLeft;
    const RightIcon = rightIconType === 'bell' ? Bell : (rightIconType === 'search' ? Search : X);
    const STATUS_BAR_HEIGHT = getStatusBarHeight();
    return (
        <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
        >
            <LinearGradient
                colors={palettes[theme]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                    paddingTop: STATUS_BAR_HEIGHT + 10, // Added 10px extra gap from status bar
                    paddingBottom: 20,                  // Added padding for better height
                    //borderBottomLeftRadius: 32,
                    //borderBottomRightRadius: 32,
                    // --- PREMIUM SHADOW ---
                    elevation: 15,
                    shadowColor: palettes[theme][0],    // Shadow matches the theme color
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 15,
                }}
            >
                <HStack className="px-6 items-center justify-between">
                    {/* LEFT ICON - INCREASED SIZE */}
                    <Box className="w-12">
                        {leftIconType !== 'none' && (
                            <TouchableOpacity
                                onPress={onLeftPress}
                                className="p-3 bg-white/10 rounded-2xl active:scale-90 transition-all"
                            >
                                <Icon as={LeftIcon} size="lg" color="white" />
                            </TouchableOpacity>
                        )}
                    </Box>

                    {/* CENTER TITLE - BETTER VERTICAL GAP */}
                    <VStack className="items-center flex-1 mx-2">
                        <Heading
                            numberOfLines={1}
                            className="text-white font-extrabold text-xl tracking-tight text-center"
                        >
                            {title}
                        </Heading>
                    </VStack>

                    {/* RIGHT ICON - INCREASED SIZE */}
                    <Box className="w-12 items-end">
                        {showRightIcon && (
                            <TouchableOpacity
                                onPress={onRightPress}
                                className="p-3 bg-white/10 rounded-2xl active:scale-90 transition-all"
                            >
                                <Box className="relative">
                                    <Icon as={RightIcon} size="lg" color="white" />
                                    {rightIconType === 'bell' && (
                                        <Box className="absolute top-0 right-0 w-3 h-3 bg-cyan-400 rounded-full border-2 border-[#064E3B]" />
                                    )}
                                </Box>
                            </TouchableOpacity>
                        )}
                    </Box>
                </HStack>
            </LinearGradient>
        </MotiView>
    );
};

export default HeaderSession;
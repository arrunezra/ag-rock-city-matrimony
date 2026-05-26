import HeaderSession from '@/src/screens/common/HeaderSession';
import React from 'react';
import { View, Image, ActivityIndicator, StyleSheet, Dimensions, ImageBackground, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ImageBackground
                source={require('@/src/assets/images/bgimage.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.darkOverlay} />

                <View style={styles.logoContainer}>
                    <Image
                        source={require('@/src/assets/logo/splace_screen.jpg')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* <View style={styles.centerSpinnerContainer}>
                    <ActivityIndicator size="large" color="#e2b45c" />
                </View> */}
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#041512',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(4, 21, 18, 0.15)',
    },
    logoContainer: {
        width: width * 0.85,
        height: height * 0.80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    centerSpinnerContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        top: 60,
    },
});

export default SplashScreen;
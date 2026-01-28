import { GIRL_DEFAULT_PROFILEs } from '@/src/assets/checking';
import React from 'react';
import { View, ActivityIndicator, Image, StyleSheet } from 'react-native';

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            {/* Replace with your logo */}
            <Image
                source={require('@/src/assets/images/aglogo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <ActivityIndicator size="large" color="green" style={{ marginTop: 20 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    logo: {
        width: 200,
        height: 100,
    },
});

export default SplashScreen;
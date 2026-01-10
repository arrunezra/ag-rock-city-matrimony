import React, { useEffect } from 'react';
import { config } from './config';
import { View, ViewProps } from 'react-native';
import { OverlayProvider } from '@gluestack-ui/core/overlay/creator';
import { ToastProvider } from '@gluestack-ui/core/toast/creator';
import { useColorScheme } from 'nativewind';

export type ModeType = 'light' | 'dark' | 'system';
export type ThemeFlavor = 'blue' | 'green';

export function GluestackUIProvider({
  mode = 'light',
  flavor = 'blue', // New prop
  ...props
}: {
  mode?: ModeType;
  flavor?: ThemeFlavor;
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);
// Combine flavor and colorScheme (e.g., "blue-dark")
  const activeConfigKey = `${flavor}-${colorScheme}` as keyof typeof config;
  const activeStyles = config[activeConfigKey] || config['green-light'];
  return (
    <View
      style={[
        activeStyles,
        { flex: 1, height: '100%', width: '100%' },
        props.style,
      ]}
    >
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}

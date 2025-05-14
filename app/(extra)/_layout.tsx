import { Slot } from 'expo-router';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';

export default function ExtraLayout() {
    const colorScheme = useColorScheme()
    return (<Slot />);
}

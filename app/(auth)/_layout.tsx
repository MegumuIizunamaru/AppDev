import { useAuth } from '@/components/AuthContext';
import { Redirect, Slot } from 'expo-router';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router'
import React from 'react';

export default function AuthLayout() {
  const { isLoggedIn } = useAuth();
  const colorScheme = useColorScheme();

  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  return <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
    <Stack>
      <Stack.Screen name="login" options={{ title: "Log In" }} />
      <Stack.Screen name="register" options={{ title: "Register" }} />
    </Stack>
  </ThemeProvider>;
}

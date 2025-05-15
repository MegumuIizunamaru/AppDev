import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { useAuth } from '@/components/AuthContext';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {Drawer} from "expo-router/drawer"
import Ionicons from '@expo/vector-icons/build/Ionicons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Redirect href="/login"/>;
  }

  if (Platform.OS === 'web') 
    return (
            <Drawer>
                <Drawer.Screen name="index" options={{ title: "Pets" }} />
                <Drawer.Screen name="explore" options={{ title: "Users" }} />
                <Drawer.Screen name="schedule" options={{ title: "Schedule" }} />
                { isLoggedIn && <Drawer.Screen name="setting" options={{ title: "Setting" }} />}
                <Drawer.Screen name="petpage" options={{ title: "Pet Info", drawerItemStyle: {height: 0}}}/>
            </Drawer>
        )
  else
    return (
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explorer',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="schedule"
          options={{
            title: 'Schedule',
            tabBarIcon: ({ color }) => <Ionicons size={28} name="calendar-outline" color={color} />,
          }}
        />
        <Tabs.Screen
          name="setting"
          options={{
            title: 'Setting',
            tabBarIcon: ({ color }) => <Ionicons name="settings" size={28}  color={color} />,
          }}
        />
      </Tabs>
    );
}

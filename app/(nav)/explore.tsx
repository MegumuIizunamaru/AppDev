import { StyleSheet, Image, Platform, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { getCurrentUser, CurrentUserType } from '@/components/CurrentUser';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React, {useEffect, useState} from 'react';
import { Timestamp } from 'firebase/firestore'

export default function TabTwoScreen() {
  const user = getCurrentUser();
  const date = user?.createdAt;
  const newDate = date instanceof Timestamp ? date.toDate() : date
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
        {!user ? (<View>
          <ThemedText>
            User not found!
          </ThemedText>
        </View>):
        (<View><ThemedText>Username: {user.username}</ThemedText>
        <ThemedText>Email: {user.email}</ThemedText>
        <ThemedText>Joined: {newDate?.toDateString()}</ThemedText>
        </View>)}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

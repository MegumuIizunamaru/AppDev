import { StyleSheet, Image, Platform, View, useColorScheme } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { getCurrentUser, CurrentUserType } from '@/components/CurrentUser';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React, {useEffect, useState} from 'react';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore'
import PetList from '@/components/PetListSchedule'
import { db } from '@/components/FirebaseConfig';

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const user = getCurrentUser();
  const [name,setName] = useState('');
  const uid = user?._id;
  const date = user?.createdAt;
  const newDate = date instanceof Timestamp ? date.toDate() : date
  useEffect(() => {
      if (!uid) return;
      const userRef = doc(db, 'users', uid);
      const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          console.log(userData)
          setName(userData?.username || 'Unknown User');
        }
      });
      return () => unsubscribe();
    }, [uid])
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
      }
    >
      {user !== null ? (
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <ThemedText style={[styles.label, styles.text]}>Username:</ThemedText>
            <ThemedText style={[styles.value, styles.text]}>{name}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <ThemedText style={[styles.label, styles.text]}>Email:</ThemedText>
            <ThemedText style={[styles.value, styles.text]}>{user.email}</ThemedText>
          </View>

          <View style={styles.infoRow}>
            <ThemedText style={[styles.label, styles.text]}>Joined:</ThemedText>
            <ThemedText style={[styles.value, styles.text]}>{newDate?.toDateString()}</ThemedText>
          </View>
        </View>
      ) : (
        <View style={styles.errorContainer}>
          <ThemedText style={[styles.errorText, styles.text]}>User not found!</ThemedText>
        </View>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    alignSelf: 'center',
    marginTop: 20,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: 'transparent', // Allow the background from ParallaxScrollView to show through
  },
  infoRow: {
    flexDirection: 'row',  // Align label and value side by side
    marginBottom: 10, // Add some space between each row
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  value: {
    fontSize: 16,
    color: '#555', // Lighter text color for values
  },
  text: {
    fontFamily: 'SpaceMono', // Use your custom font
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#FFDDC1', // Light background for error message
    borderRadius: 10,
  },
  errorText: {
    fontSize: 18,
    color: '#D8000C', // Red color for error message
    fontWeight: 'bold',
  },
});

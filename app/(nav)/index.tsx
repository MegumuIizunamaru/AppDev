import { Button, StyleSheet, View, Alert } from 'react-native';
import 'react-native-gesture-handler'

import * as React from 'react'
import { useRouter } from 'expo-router';
import PetList from '@/components/PetList'
// import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Banner from '@/components/Banner'
import { getAuth, signOut } from 'firebase/auth'
import { useAuth } from '@/components/AuthContext'
import { setCurrentUser, getCurrentUser } from '@/components/CurrentUser';
import { useEffect, useState } from 'react';
import { db } from '@/components/FirebaseConfig';
import { setPet } from '@/components/Pet';
import { PetItem } from '@/interface';
import { doc, onSnapshot } from 'firebase/firestore';
import ScheduleList from '@/components/ScheduleList';

const HomeScreen: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const user = getCurrentUser()
  const [name,setName] = useState('');
  const uid = user?._id;
  const handleLogout = async () => {
    const auth = getAuth();

    try {
      await signOut(auth);
      setCurrentUser(null);
      router.replace('/(auth)/login')
    }
    catch (error) {
      console.error('Kaboom, error!');
      Alert.alert('Error', 'You are not logging out.')
    }
  }
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
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Banner />}>
      <View>
        <ThemedText type='title'>{isLoggedIn ? `Greetings, ${name}.` : "User isn't logged in"}</ThemedText>
        {isLoggedIn ? (<View style={styles.buttonStyle}><Button title='Log Out' onPress={() => handleLogout()} /></View>) : null}
      </View>
      <PetList />
      <ScheduleList/>
    </ParallaxScrollView>

  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  inputContainer: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFF',
    width: "50%",
    marginTop: 5,
    marginBottom: 10,
    color: '#FFF'
  },
  buttonStyle: {
    width: 100,
    marginTop: 20
  }
});

export default HomeScreen;
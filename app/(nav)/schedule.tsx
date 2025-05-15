import { Button, StyleSheet, TextInput, View, Alert } from 'react-native';
import 'react-native-gesture-handler'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'expo-router';
// import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { AuthProvider } from '@/components/AuthContext'
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Banner from '@/components/Banner'
import { getAuth, signOut } from 'firebase/auth'
import { useAuth } from '@/components/AuthContext'
import { setCurrentUser, getCurrentUser } from '@/components/CurrentUser';
import AddPetForm from '@/components/RegisterLoginPet'
import PetList from '@/components/PetListSchedule'
import { getSelectedPet } from '@/components/Pet';
import { PetItem } from '@/interface';

const HomeScreen: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [selectedPet, setSelectedPet] = useState<PetItem | null>(getSelectedPet());
  const router = useRouter();
  const user = getCurrentUser()
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Banner />}>
      <View>
        {selectedPet !== null ? (<ThemedText type="subtitle">Scheduling for: {selectedPet.name}</ThemedText>) : <ThemedText>Which pet?</ThemedText>}
        <View><PetList onSelectPet={setSelectedPet}/></View>
      </View>
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
    marginTop: 10
  }
});

export default HomeScreen;
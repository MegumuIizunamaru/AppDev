import { Button, StyleSheet, TextInput, View, Alert, Text } from 'react-native';
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
import { DatePickerModal } from 'react-native-paper-dates';
import { useColorScheme } from '@/hooks/useColorScheme';
import SelectDropdown from 'react-native-select-dropdown';
import { db } from '@/components/FirebaseConfig';
import { addDoc, collection, doc } from 'firebase/firestore';
import { Schedule } from '@/interface'

type NewSchedule = Omit<Schedule, '_id'>;
const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme();
  const C = colorScheme === "dark" ? "#FFF" : "#000"
  const textStyles = [styles.label, { color: C }]
  const inputStyles = [styles.input, { color: C }]
  const { isLoggedIn } = useAuth();
  const [selectedPet, setSelectedPet] = useState<PetItem | null>(getSelectedPet());
  const router = useRouter();
  const user = getCurrentUser();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [vetName, setVetName] = useState('')

  const veterinaryClinicNames = [
    "Paws & Claws Thailand",
    "The Siam Pet Care Center",
    "Tail Waggers Vet Clinic",
    "Furry Friends Animal Hospital",
    "Meow & Woof Vet Haven"
  ];


  const onDatePickerCOnfirm = (params: { date: Date | undefined }) => {
    setShowDatePicker(false);
    setScheduleDate(params.date)
  }

  const handleSubmit = async () => {
    console.log(selectedPet?.name + "\n" + vetName + "\n" + scheduleDate)
    const uid = user?._id;
    if (!uid || !selectedPet || vetName === '' || scheduleDate === undefined) throw new Error("Nuh uh, fill all boxes!");
    const docRef = collection(db, "users", user._id, "schedule");
    await addDoc(docRef, {
      pet: selectedPet,
      location: vetName,
      scheduleDate: scheduleDate
    });
    router.back();
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Banner />}>
      <View>
        {selectedPet !== null ? (<ThemedText type="subtitle">Scheduling for: {selectedPet.name}</ThemedText>) : <ThemedText type="subtitle">Which pet?</ThemedText>}
        <View><PetList onSelectPet={setSelectedPet} /></View>
      </View>
      <View><ThemedText type="subtitle">Name of Vet Clinic:</ThemedText></View>
      <SelectDropdown
        data={veterinaryClinicNames}
        onSelect={(chosenOne) => { setVetName(chosenOne) }}
        renderButton={(selectedItem) => {
          return (
            <View style={styles.input}>
              <ThemedText type="defaultSemiBold">
                {(selectedItem) || "Choose the clinic!"}
              </ThemedText>
            </View>
          );
        }}
        renderItem={(item) => {
          return (
            <View>
              <ThemedText type="defaultSemiBold" style={{ color: '#000' }}>{item}</ThemedText>
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}

      />
      <View><Button title="Select Schedule Date" onPress={() => setShowDatePicker(true)} /></View>
      <View><ThemedText type="subtitle">Date Selected: {scheduleDate?.toDateString()}</ThemedText></View>
      <DatePickerModal
        locale='en'
        mode="single"
        visible={showDatePicker}
        onDismiss={() => setShowDatePicker(false)}
        date={scheduleDate}
        onConfirm={onDatePickerCOnfirm}
      />
      <View><Button title="Confirm" onPress={() => handleSubmit()} /></View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  label: { marginTop: 12, marginBottom: 4, fontWeight: 'bold' },
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    padding: 8,
  },
});

export default HomeScreen;
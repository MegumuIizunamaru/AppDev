// app/(nav)/pets/[petId]/edit.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    Button,
    Alert,
    ScrollView,
    Text,
    StyleSheet, Image
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SelectDropdown from 'react-native-select-dropdown';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { getSelectedPet } from './Pet';
import { PetItem } from '@/interface';
import { useColorScheme } from '@/hooks/useColorScheme';
import { getCurrentUser } from './CurrentUser';
import { db } from './FirebaseConfig';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import * as FileSystem from 'expo-file-system'
import { getAuth } from 'firebase/auth';

type NewPet = Omit<PetItem, '_id'>;

export default function EditPetScreen() {
    const selectedPet = getSelectedPet()
    const petId = selectedPet?._id;
    const uid = getAuth().currentUser?.uid;
    const colorScheme = useColorScheme();
    const C = colorScheme === 'dark' ? '#FFF' : '#000';

    const updatePet = async (updates: Partial<NewPet>) => {
        

        if (!uid || !petId) throw new Error("Not authenticated.");
        const petRef = doc(db, 'users', uid, petId);
        await updateDoc(petRef, updates);
    }
    if (!selectedPet) return;

    const [pet, setPet] = useState(selectedPet);
    const [loading, setLoading] = useState(true);

    // 2) Handle image pick & compress
    const pickImage = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });
        if (res.canceled) return;
        const uri = res.assets[0].uri;
        try {
            const manip = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 800 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );
            const b64 = await FileSystem.readAsStringAsync(manip.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            const dataUri = `data:image/jpeg;base64,${b64}`;
            //console.log(dataUri);
            setPet(p => ({ ...p, picture: dataUri }));
        } catch {
            console.log("What the sigma?");
            setPet(p => ({ ...p, picture: uri }));
        }
    };
    const handleUpdate = async () => {
        if (!pet.name || !pet.type || !pet.breed) {
            Alert.alert('Validation', 'Name, type and breed are required');
            return;
        }
        try {
            await updatePet({
                name: pet.name,
                sex: pet.sex,
                type: pet.type,
                breed: pet.breed,
                weight: pet.weight,
                picture: pet.picture,
                condition: pet.condition,
            });

            Alert.alert('Success!');
            console.log("SUCCESS.")
        } catch (e) {
            console.error(e);
            Alert.alert('Error :(');
        }
    }
    const test = async () => {
        const uid = getAuth().currentUser?.uid;

        if (!uid || !petId) throw new Error("Not authenticated.");
        const petDocRef = doc(db,'users',uid,'pets',petId);
        await updateDoc(petDocRef,{name:pet.name, type: pet.type,sex:pet.sex, picture:pet.picture});

    }

    const sexSelect = [{ title: 'Male' }, { title: 'Female' }];

    const textStyles = [styles.label, { color: C }];
    const inputStyles = [styles.input, { color: C }];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={textStyles}>Name</Text>
            <TextInput
                style={inputStyles}
                value={pet.name}
                onChangeText={txt => setPet(p => ({ ...p, name: txt }))}
            />
            <Text style={textStyles}>Type</Text>
            <TextInput
                style={inputStyles}
                value={pet.type}
                onChangeText={txt => setPet(p => ({ ...p, type: txt }))}
            />

            <Text style={textStyles}>Sex</Text>
            <SelectDropdown
                data={sexSelect}
                defaultValue={{ title: pet.sex }}
                onSelect={item => setPet(p => ({ ...p, sex: item.title }))}
                renderButton={selected =>
                    <View >
                        <Text style={{ color: C, fontWeight: 'bold' }}>
                            {selected?.title || "Select sex"}
                        </Text>
                    </View>
                }
                renderItem={item =>
                    <View style={styles.dropdownItem}>
                        <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
                    </View>
                }
            />

            {/* … same inputs for type, breed, weight, conditions … */}

            <Button title="Pick New Image" onPress={pickImage} />
            {pet.picture ? <Image source={{uri:pet.picture}}/> : null}

            <View style={styles.submit}>
                <Button title="Update Pet" onPress={test} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    loading: { flex: 1, textAlign: 'center', marginTop: 50 },
    container: { padding: 20 },
    label: { marginTop: 12, marginBottom: 4, fontWeight: 'bold' },
    input: {
        borderWidth: 1, borderColor: '#888', borderRadius: 8, padding: 8
    },
    preview: { marginTop: 8, color: 'green' },
    submit: { marginTop: 24 },
    dropdownItem: { padding: 8 },
    error: { color: 'red', textAlign: 'center', marginTop: 40 },
});

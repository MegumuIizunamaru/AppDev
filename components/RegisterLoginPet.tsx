// components/AddPetForm.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    TextInput,
    Button,
    Alert,
    ScrollView,
    Text,
    StyleSheet,
} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator'
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/components/FirebaseConfig';
import { useRouter } from 'expo-router';
import { PetItem } from '@/interface';
import { useColorScheme } from '@/hooks/useColorScheme';
import { textColor } from './utils';

type NewPet = Omit<PetItem, '_id'> & { createdAt: Date };

export default function AddPetForm() {
    const router = useRouter();
    const uid = getAuth().currentUser?.uid;
    if (!uid) {
        return <Text style={styles.error}>You must be logged in to add a pet.</Text>;
    }

    const [pet, setPet] = useState<NewPet>({
        name: '',
        sex: '',
        type: '',
        breed: '',
        weight: 0,
        picture: '',
        condition: [],
        createdAt: new Date(),
    });
    const [condInput, setCondInput] = useState('');

    const pickImage = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });
        if (!res.canceled) {
            const uri = res.assets[0].uri;
            try {
                // Resize to max width 800px & compress to 70%
                const manipResult = await ImageManipulator.manipulateAsync(
                    uri,
                    [{ resize: { width: 800 } }],
                    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                );
                setPet((p) => ({ ...p, picture: manipResult.uri }));
            } catch (e) {
                console.error('Image manipulation error:', e);
                setPet((p) => ({ ...p, picture: uri }));
            }
        }
    };

    const handleSubmit = async () => {
        if (!pet.name || !pet.type || !pet.breed) {
            Alert.alert('Validation', 'Please fill in name, type, and breed');
            return;
        }
        try {
            const ref = collection(db, 'users', uid, 'pets');
            await addDoc(ref, pet);
            Alert.alert('Success', 'Pet added!');
            setCondInput('');
            setPet({
                name: '',
                sex: '',
                type: '',
                breed: '',
                weight: 0,
                picture: '',
                condition: [],
                createdAt: new Date()
            })
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to add pet');
        }
    };

    const colorScheme = useColorScheme();
    const C = colorScheme === "dark" ? "#FFF" : "#000"
    const textStyles = [styles.label, { color: C }]
    const inputStyles = [styles.input, { color: C }]
    const sexSelect = [{ title: 'Male' }, { title: 'Female' }]

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={textStyles}>Name</Text>
            <TextInput
                style={inputStyles}
                value={pet.name}
                onChangeText={txt => setPet(p => ({ ...p, name: txt }))}
            />
            <Text style={textStyles}>Sex</Text>
            <SelectDropdown data={sexSelect} onSelect={(selectedItem) => setPet(p => ({ ...p, sex: selectedItem.title }))}
                renderButton={(selectedItem) => {
                    return (
                        <View>
                            <Text style={{ fontWeight: 'bold', color: C }}>
                                {(selectedItem && selectedItem.title) || "What is the pet's sex?"}
                            </Text>
                        </View>
                    );
                }}
                renderItem={(item) => {
                    return (
                        <View>
                            <Text style={{fontWeight:'bold'}}>{item.title}</Text>
                        </View>
                    );
                }}
                showsVerticalScrollIndicator={false}/>

            <Text style={textStyles}>Type</Text>
            <TextInput
                style={inputStyles}
                value={pet.type}
                onChangeText={txt => setPet(p => ({ ...p, type: txt }))}
            />

            <Text style={textStyles}>Breed</Text>
            <TextInput
                style={inputStyles}
                value={pet.breed}
                onChangeText={txt => setPet(p => ({ ...p, breed: txt }))}
            />

            <Text style={textStyles}>Weight (kg)</Text>
            <TextInput
                style={inputStyles}
                keyboardType="decimal-pad"
                value={pet.weight.toString()}
                onChangeText={txt => setPet(p => ({ ...p, weight: parseFloat(txt) || 0 }))}
            />

            <Text style={textStyles}>Conditions</Text>
            <TextInput
                style={[{ marginBottom: 24 }, inputStyles]}
                placeholder="comma separated"
                value={condInput}
                onChangeText={setCondInput}
                onBlur={() =>
                    setPet(p => ({
                        ...p,
                        condition: condInput
                            .split(',')
                            .map(s => s.trim())
                            .filter(Boolean),
                    }))
                }
            />

            <Button title="Pick Image" onPress={pickImage} />
            {pet.picture ? <Text style={styles.preview}>✓ Image selected</Text> : null}

            <View style={styles.submit}>
                <Button title="Save Pet" onPress={handleSubmit} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    label: { marginTop: 12, marginBottom: 4, fontWeight: 'bold' },
    input: {
        borderWidth: 1,
        borderColor: '#888',
        borderRadius: 8,
        padding: 8,
    },
    preview: { marginTop: 8, color: 'green' },
    submit: { marginTop: 24 },
    error: { flex: 1, textAlign: 'center', color: 'red', marginTop: 40 },
    dropdownButtonStyle: {
        width: 200,
        height: 50,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownMenuStyle: {
        borderRadius: 8,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
});

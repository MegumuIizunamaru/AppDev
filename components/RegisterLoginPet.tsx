// components/AddPetForm.tsx
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
import SelectDropdown from 'react-native-select-dropdown'
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator'
import * as FileSystem from 'expo-file-system';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/components/FirebaseConfig';
import { useRouter } from 'expo-router';
import { PetItem } from '@/interface';
import { useColorScheme } from '@/hooks/useColorScheme';
import { textColor } from './utils';
import { ThemedText } from './ThemedText';

type NewPet = Omit<PetItem, '_id' | 'vaccinationHistory'> & { createdAt: Date };

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
    const [image, setImage] = useState('')
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
                    { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG }
                );
                const b64 = await FileSystem.readAsStringAsync(manipResult.uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                const dataUri = `data:image/jpeg;base64,${b64}`;
                console.warn("Image uploaded.");
                setImage(dataUri);
                setPet((p) => ({ ...p, picture: dataUri }));
            } catch (e) {
                console.error('Image manipulation error:', e);
                setImage(uri);
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
            router.back();
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
            <View style={{ width: '50%' }}>
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
                                <Text style={inputStyles}>
                                    {(selectedItem && selectedItem.title) || "What is the pet's sex?"}
                                </Text>
                            </View>
                        );
                    }}
                    renderItem={(item) => {
                        return (
                            <View>
                                <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
                            </View>
                        );
                    }}
                    showsVerticalScrollIndicator={false} />

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
                <View>
                    <Button title="Pick Image" onPress={pickImage} />
                    {pet.picture ? <View><Text style={styles.preview}>✓ Image selected</Text></View> : null}
                    <View style={{ marginTop: 5, borderWidth: 2, padding: 8, borderColor: '#888', borderRadius: 8 }}>
                        <ThemedText type="title" style={{ marginBottom: 20 }}>Image Preview:</ThemedText>
                        <Image source={{ uri: pet?.picture }} style={{ width: 300, height: 300 }} />
                    </View>
                </View>

                <View style={styles.submit}>
                    <Button title="Save Pet" onPress={handleSubmit} />
                </View>

            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flexDirection: 'row' },
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

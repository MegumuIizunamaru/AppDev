// components/DateForm.tsx
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
import * as FileSystem from 'expo-file-system';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '@/components/FirebaseConfig';
import { useRouter } from 'expo-router';
import { PetItem } from '@/interface';
import { useColorScheme } from '@/hooks/useColorScheme';
import { textColor } from './utils';

type NewPet = Omit<PetItem, '_id' | 'vaccinationHistory'> & { createdAt: Date };

export default function AddDateForm() {

    const [condInput, setCondInput] = useState('');
    const [scheduleDate,setScheduleDate]= useState('');

 
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


import { View, StyleSheet, Image, Text, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getSelectedPet } from '@/components/Pet';
import { Card } from 'react-native-paper'
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import EditPetScreen from '@/components/UpdatePet';
import { ScrollView } from 'react-native-gesture-handler';
import { PetItem } from '@/interface';
import { useFocusEffect, useRouter } from 'expo-router';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/components/FirebaseConfig';
import { getCurrentUser } from '@/components/CurrentUser';
// Can you put style on ThemedText?
export default function PetPage() {
    const item = getSelectedPet();
    const uid = getCurrentUser()?._id;
    const colorScheme = useColorScheme();
    const c = colorScheme === 'dark' ? '#FFF' : '#000'
    const [pet, setPet] = useState(item);
    const router = useRouter();
    const [appear, setAppear] = useState(false);
    const handleInfo = (item : PetItem | null) => {
        console.log(item?._id);
        setAppear(true);
    }
    useEffect(() => {
        if(!uid || !item?._id) return;
        const petRef = doc(db,'users',uid,'pets',item._id);
        const unsubscribe = onSnapshot(petRef, (docSnapshot) => {
            if (docSnapshot.exists()){
                setPet(docSnapshot.data() as PetItem);
            }
        });
        return () => unsubscribe();
    },[uid,item?._id])

    useFocusEffect(
        React.useCallback(() => {
            setAppear(false);
        }, [])
    );
    //FLAT LIST  GET PETS RETURN LIST
    return (<ScrollView style={{marginTop:100}}>
        <View style={[styles.container, { borderColor: c }]}>
            <ThemedText type="title" style={styles.text}>{pet?.name}</ThemedText>
            <Image
                source={{ uri: pet?.picture }}
                style={styles.image}
                resizeMode='stretch' />
            <View style={{ alignContent: 'center', margin: 10 }}>
                <ThemedText type="subtitle" style={styles.text}>
                    {`Type: ${pet?.type}\nBreed: ${item?.breed}\nGender: ${pet?.sex}\nWeight: ${pet?.weight} Kilogram`}
                </ThemedText>
                <View style={{ marginTop: 15, width: 100, alignSelf: 'center' }}>
                    <Button title="Edit Info" onPress={() => handleInfo(item)} />
                </View>
            </View>
        </View>
        <View>
            {appear && <EditPetScreen/>}
        </View>
    </ScrollView>
    )

    // Time to test.
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center', borderWidth: 3, borderRadius: 15, marginTop: 10
    },
    image: {
        width: 280,
        height: 280,
        borderRadius: 140,
        margin: 10
    },
    text: {
        alignSelf: 'center', marginTop: 20
    },
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

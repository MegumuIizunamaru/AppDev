
import { View, StyleSheet, Image, Text, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@react-navigation/native';
import { getSelectedPet } from '@/components/Pet';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import EditPetScreen from '@/components/UpdatePet';
import { ScrollView } from 'react-native-gesture-handler';
import { PetItem } from '@/interface';
import { useFocusEffect, useRouter } from 'expo-router';
import { deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/components/FirebaseConfig';
import { getCurrentUser } from '@/components/CurrentUser';
// Can you put style on ThemedText?
export default function PetPage() {
    const item = getSelectedPet();
    const uid = getCurrentUser()?._id;
    const { colors } = useTheme();
    const colorScheme = useColorScheme();
    const c = colorScheme === 'dark' ? '#FFF' : '#000'
    const [pet, setPet] = useState(item);
    const router = useRouter();
    const [appear, setAppear] = useState(false);
    const handleInfo = (item: PetItem | null) => {
        console.log(item?._id);
        setAppear(true);
    }
    const handleDelete = async () => {
        if (item === null || uid === undefined) return;
        const docRef = doc(db, "users", uid, "pets", item?._id)
        await deleteDoc(docRef)
        console.log("Deleted!");
        router.back()
    }
    useEffect(() => {
        if (!uid || !item?._id) return;
        const petRef = doc(db, 'users', uid, 'pets', item._id);
        const unsubscribe = onSnapshot(petRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                setPet(docSnapshot.data() as PetItem);
            }
        });
        return () => unsubscribe();
    }, [uid, item?._id])

    useFocusEffect(
        React.useCallback(() => {
            setAppear(false);
        }, [])
    );
    //FLAT LIST  GET PETS RETURN LIST
    return (<ScrollView style={{ marginTop: 100, backgroundColor: colors.background }}>
        <View style={{ width: 125, alignSelf: 'center', marginTop: 10 }}>
            <Button title="Return Home" onPress={() => router.back()} />
        </View>
        <View style={[styles.container, { borderColor: c }]}>
            <ThemedText type="title" style={styles.text}>{pet?.name}</ThemedText>
            <Image
                source={{ uri: pet?.picture }}
                style={styles.image}
                resizeMode='contain' />
            <View style={{ alignContent: 'center', margin: 10 }}>
                <ThemedText type="subtitle" style={styles.text}>
                    {`Type: ${pet?.type}\nBreed: ${pet?.breed}\nGender: ${pet?.sex}\nWeight: ${pet?.weight} Kilogram`}
                </ThemedText>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 15,
                    }}
                >
                    <View style={{ marginRight: 10 }}>
                        <Button title="Edit Info" onPress={() => handleInfo(item)} />
                    </View>
                    <View>
                        <Button title="DELETE THIS" onPress={() => handleDelete()} color="#FF0000" />
                    </View>
                </View>


            </View>
        </View>
        <View>
            {appear && <EditPetScreen />}
        </View>
    </ScrollView>
    )
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

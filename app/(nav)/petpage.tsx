
import { View, StyleSheet, Image, Text, Button } from 'react-native';
import React from 'react';
import { getSelectedPet } from '@/components/Pet';
import { Card } from 'react-native-paper'
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import EditPetScreen from '@/components/UpdatePet';
// Can you put style on ThemedText?
export default function PetPage() {
    const item = getSelectedPet();
    const colorScheme = useColorScheme();
    const c = colorScheme === 'dark' ? '#FFF' : '#000'
    //FLAT LIST  GET PETS RETURN LIST
    return (<View style={[styles.container, { borderColor: c }]}>
        <ThemedText type="title" style={styles.text}>{item?.name}</ThemedText>
        <Image
            source={{ uri: item?.picture }}
            style={styles.image}
            resizeMode='stretch' />
        <View style={{ alignContent: 'center', margin: 10 }}>
            <ThemedText type="subtitle" style={styles.text}>
                {`Type: ${item?.type}\nBreed: ${item?.breed}\nGender: ${item?.sex}\nWeight: ${item?.weight} Kilogram`}
            </ThemedText>
            <View style={{ marginTop: 15, width: 100, alignSelf: 'center' }}>
                <Button title="Edit Info" onPress={() => console.log(item?._id)} />
            </View>
        </View>
    </View>
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
        alignSelf: 'center'
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

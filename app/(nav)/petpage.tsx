
import { View, StyleSheet } from 'react-native';
import React from 'react';
import { getSelectedPet } from '@/components/Pet';
import { Card } from 'react-native-paper'
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
// Can you put style on ThemedText?
export default function PetPage() {
    const item = getSelectedPet();
    const colorScheme = useColorScheme();
    //FLAT LIST  GET PETS RETURN LIST
    return (<View>
        <Card>
            <Card.Content>
                <ThemedText>{item?.type}, Breed: {item?.breed}</ThemedText>
                <ThemedText>Gender: {item?.sex}, Weight: {item?.weight}</ThemedText>
            </Card.Content>

        </Card>
    </View>
    )

    // Time to test.
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

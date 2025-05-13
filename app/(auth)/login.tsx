import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, useColorScheme, Image, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/components/FirebaseConfig';
import { getDoc, collection, doc } from 'firebase/firestore'
import { router } from 'expo-router';
import { textColor } from "@/components/utils"
import { ThemedText } from '@/components/ThemedText';
import { ExternalLink } from '@/components/ExternalLink';
import { setCurrentUser } from '@/components/CurrentUser';
import { blue } from 'react-native-reanimated/lib/typescript/Colors';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const A = useColorScheme();
    const textColor = A === 'dark' ? '#FFF' : '#000';

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user;
            if (!user) return;
            const UID = user.uid;
            console.log("User "+UID+" has logged in.");
            const docRef = doc(db, 'users', UID);
            const userSnap = await getDoc(docRef);

            if (userSnap.exists()) {
                const data = userSnap.data();
                setCurrentUser({
                    _id: data._id,
                    email: user.email ?? '',
                    username: data.username,
                    createdAt: data.createdAt,
                });
                console.log(data);

                router.replace('/');
                Alert.alert("Login done.")
            }
            else {
                setError('User not found.')
            }
        }
        catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <View style={[styles.container]}>
            <Image source={require("@/assets/images/app_icon.png")} style={styles.image} />
            <ThemedText style={[styles.textAbove, { marginTop: 50, color: textColor }]}>Email:</ThemedText>
            <TextInput
                style={[styles.input, { color: textColor }]}
                value={email}
                onChangeText={setEmail}
            />
            <ThemedText style={[styles.textAbove, { color: textColor }]}>Password:</ThemedText>
            <TextInput
                style={[styles.input, { color: textColor }]}
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />
            <View style={styles.button}>
                <Button title='Log in' onPress={handleLogin} />
                <ThemedText style={{ color: textColor, marginTop: 20 }}>
                    Aw, you don't have an account?{' '}
                    <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                        <ThemedText style={{color: "#528AAE"}}>Register here!</ThemedText>
                    </TouchableOpacity>
                </ThemedText>
            </View>
        </View>
    )
}

const diameter = 100

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    image: {
        height: diameter,
        width: diameter,
        borderRadius: diameter / 2,
        marginTop: 100,
        alignSelf: 'center'

    },
    input: {
        width: "100%",
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        paddingLeft: 10,
    },
    textAbove: {
        fontSize: 20,
        fontWeight: "bold"
    },
    registerText: {
        marginTop: 10,
        color: 'blue',
    },
    button: {
        marginTop: 25,
        alignItems: 'center',
        fontSize: 30
    }
});
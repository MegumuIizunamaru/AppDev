import { Button, StyleSheet, TextInput, View, Alert, useColorScheme, Image } from 'react-native';
import 'react-native-gesture-handler'

import * as React from 'react'
import { useState } from 'react'
import { useRouter } from 'expo-router';
// import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Banner from '@/components/Banner'
//import Box from '@/components/Box'
import Card from '@/components/Card'
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/components/FirebaseConfig';
import { getAuth, createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { setCurrentUser } from '@/components/CurrentUser';

export default function RegisterScreen() {
  const colorScheme = useColorScheme();
  const dark = colorScheme === 'dark'
  const textColor = dark ? "#FFF" : "#000";
  const router = useRouter();


  const [email, setEmail] = useState('');
  const [username, setUser] = useState('');
  const [password, setPW] = useState('');

  //const pw = "Thechopin1";


  //let name = '';
  const goToSomewhere = () => router.push('/');
  const validateEmail = (email: string): boolean => {
    // Regular expression for validating email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email); // Returns true if the email matches the pattern
  };
  const goodToGo = (email + username + password !== '') && validateEmail(email);


  const handleRegister = async () => {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const date = new Date();
      const UID = user.uid;
      await setDoc(doc(db, 'users', UID), {
        email: email,
        username: username,
        createdAt: date,
        _id: UID,
      });
      setCurrentUser({
        _id: user.uid,
        email: user.email ?? '',
        username: username,
        createdAt: date,
      });

      Alert.alert('User registered!');
      DoTheThing();
      goToSomewhere();
    } catch (e) {
      Alert.alert('Failed...');
    }
  };

  const DoTheThing = async () => {
    setEmail(''); setUser(''); setPW('');
  }
  return (
    <View style={styles.titleContainer}>
      <Image source={require("@/assets/images/app_icon.png")} style={styles.image} />
      <ThemedText type='title' style={{ marginTop: 30, marginBottom: 30, alignSelf: 'center' }}>Welcome to PetCare!</ThemedText>
      <View>
        <ThemedText style={styles.textAbove}>Email:</ThemedText>
        <TextInput
          style={[styles.inputContainer, { color: textColor }]}
          placeholderTextColor={textColor}
          //placeholder="Type character's name here..."
          value={email}
          onChangeText={setEmail}
        />
        <ThemedText style={styles.textAbove}>Username:</ThemedText>
        <TextInput
          style={[styles.inputContainer, { color: textColor }]}
          placeholderTextColor={textColor}
          //placeholder="Type character's name here..."
          value={username}
          onChangeText={setUser}
        />
        <ThemedText style={styles.textAbove}>Password:</ThemedText>
        <TextInput
          secureTextEntry={true}
          style={[styles.inputContainer, { color: textColor }]}
          placeholderTextColor={textColor}
          //placeholder="Type character's name here..."
          value={password}
          onChangeText={setPW}
        />
        <View style={styles.button}>
          <Button title="Register" onPress={() => goodToGo ? handleRegister() : Alert.alert('Skill issue!')} />
        </View>
      </View>
    </View>
  )
}

const diameter = 100

const styles = StyleSheet.create({
  titleContainer: {
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
  textAbove: {
    fontSize: 20,
    fontWeight: "bold"
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
    width: "100%",
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
  },
  button: {
    marginTop: 25,
    alignItems: 'center',
    fontSize: 30
  }

});
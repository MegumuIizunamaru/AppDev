import React, { useState } from 'react';
import { View, Image, Button, Alert, StyleSheet, TextInput, useColorScheme } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/components/FirebaseConfig';
import { getCurrentUser } from '@/components/CurrentUser';
import { ThemedText } from '@/components/ThemedText';
import { getAuth } from 'firebase/auth';
import { router } from 'expo-router';

export default function ProfileImageUploader() {
  const user = getCurrentUser();
  const currentName = user?.username;
  const UID = user?._id;
  const [name, setName] = useState(currentName);
  const A = useColorScheme();
  const textColor = A === 'dark' ? '#FFF' : '#000';

  const handleUpdate = async() => {
          if (!UID) throw new Error("Not authenticated.");
          const DocRef = doc(db, 'users', UID);
          await updateDoc(DocRef, { 
              username: name});
          router.back();
  }

  return (
    <View style={{alignSelf:'center', alignItems:'center', marginTop:100, borderWidth: 2, borderColor:'#FFF', padding: 20, width: '20%', borderRadius:100}}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <ThemedText style={{ marginRight: 5 }}>Edit Name:</ThemedText>
        <TextInput
          style={[styles.box, { color: textColor }]}
          value={name}
          onChangeText={setName} />
      </View>
      <View style={{width: 150, padding: 10}}>
        <Button title="Confirm Change" color="#5DBB63" onPress={handleUpdate}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonStyle: {
    marginTop: 100,
    alignItems: 'center',
    fontSize: 30
  },
  box: {
    borderWidth: 1, borderColor: '#888', borderRadius: 8, padding: 8, width: 100, fontWeight: 'bold'
  }
});
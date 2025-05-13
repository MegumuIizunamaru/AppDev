import React, { useState } from 'react';
import { View, Image, Button, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { auth } from '@/components/FirebaseConfig';

export default function ProfileImageUploader() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      uploadImageAsync(imageUri);
    }
  };

  const uploadImageAsync = async (uri: string) => {
    try {
      const blob = await uriToBlob(uri);
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const storage = getStorage();
      const imageRef = ref(storage, `profile_pictures/${uid}.jpg`);
      await uploadBytes(imageRef, blob);

      const downloadURL = await getDownloadURL(imageRef);
      setImageUrl(downloadURL);

      const db = getFirestore();
      await updateDoc(doc(db, 'users', uid), {
        profilePicture: downloadURL,
      });

      Alert.alert('Upload complete!');
    } catch (e) {
      console.error(e);
      Alert.alert('Upload failed.');
    }
  };

  const uriToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    return await response.blob();
  };

  return (
    <View style={styles.buttonStyle}>
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={{ width: 150, height: 150, borderRadius: 75 }} />
      )}
      <Button title="Upload Profile Picture" onPress={pickImage} />
    </View>
  );
}

const styles = StyleSheet.create({
    buttonStyle: {
        marginTop: 100,
        alignItems: 'center',
        fontSize: 30
    }
});
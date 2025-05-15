//Similar to venue Catalog
// Just change from venue to pet? maybe

import React, { useEffect, useState } from "react";
import { Alert, Button, useWindowDimensions, View } from "react-native";
//import Card from "./Card";
import { auth, db } from "./FirebaseConfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { ThemedText } from "./ThemedText";
import { FlatList } from "react-native-gesture-handler";
import Card from './Card';
import { PetItem } from "@/interface";
import { setPet } from "./Pet";

export default function PetList({onSelectPet}:{ onSelectPet:(pet: PetItem) => void}) {
    const uid = auth.currentUser?.uid;
    const [petData, setPetData] = useState<PetItem[]>([])
    const SM_SCREEN = 576
    const MD_SCREEN = 768
    const { height, width } = useWindowDimensions()
    const numColums = width < SM_SCREEN ? 1 : width < MD_SCREEN ? 2 : 4
    useEffect(() => {
        if (!uid) return;
        const petsRef = collection(db, 'users', uid, 'pets');
        const q = query(petsRef, orderBy("createdAt", "desc"));

        const unsub = onSnapshot(q, snapshot => {
            const list = snapshot.docs.map(doc => ({
                _id: doc.id,
                ...(doc.data() as Omit<PetItem, "_id">)
            }));
            setPetData(list);
        })
        return () => unsub();
    }, [uid]);

    const handleInfo = (item: PetItem) => {
        console.log(item?.name);
        onSelectPet(item);
    }

    const renderItem = ({ item }: { item: PetItem }) => (
        // <Card name={item.name} img={require("@/assets/images/paw_placeholder.jpg")} onPress={() => Alert.alert(item.name)}></Card>
        //May also need to add the if img found change to that 
        <Card name={item.name} img={item.picture} onPress={function (): void {
            handleInfo(item);
        }} />
    )

    return (
        <View>
            {
                (petData.length > 0) ?
                    <FlatList
                        data={petData}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                        numColumns={numColums}
                        key={numColums}
                        contentContainerStyle={{ padding:5, margin: 5, gap: 15 }}
                        scrollEnabled={false}
                    /> :
                    <ThemedText type="title">No pets? Please register one.</ThemedText>
            }
        </View>
    )


}


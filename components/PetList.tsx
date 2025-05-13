//Similar to venue Catalog
// Just change from venue to pet? maybe

import React, { useEffect, useState } from "react";
import { Alert, Button, useWindowDimensions, View } from "react-native";
//import Card from "./Card";
import { auth, db } from "./FirebaseConfig";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { ThemedText } from "./ThemedText";
import { FlatList } from "react-native-gesture-handler";
import {Card, Text} from "react-native-paper"
import { PetItem } from "@/interface";
import { setPet } from "./Pet";
import { router } from "expo-router";

export default function PetList() {
    const uid = auth.currentUser?.uid;
    const [petData, setPetData] = useState<PetItem[]>([])
    const SM_SCREEN = 576
    const MD_SCREEN = 768
    const { height, width } = useWindowDimensions()
    const numColums = width < SM_SCREEN ? 1 : width < MD_SCREEN ? 2 : 4
    useEffect(() => {
        // const fetchPets = async () => {
        //     const data = await getPets();
        //     setPetData(data);
        // };
        // fetchPets();
        if (!uid) return;
        const petsRef = collection(db,'users',uid,'pets');
        const q = query(petsRef, orderBy("createdAt","desc"));

        const unsub = onSnapshot(q,snapshot => {
            const list = snapshot.docs.map(doc => ({
                _id: doc.id,
                ...(doc.data() as Omit<PetItem, "_id">)
            }));
            setPetData(list);
        })
        return ()=>unsub();
    }, [uid]);

    const handleInfo = (item : PetItem) => {
        setPet(item);
        router.push('/(nav)/petpage');
    }

    const renderItem = ({ item }: { item: PetItem }) => (
        // <Card name={item.name} img={require("@/assets/images/paw_placeholder.jpg")} onPress={() => Alert.alert(item.name)}></Card>
        //May also need to add the if img found change to that 
         <Card style={{ 
            margin: 5, 
            width: "25%",
            justifyContent: 'center'
        }}>
            <Card.Title title={item.name} titleStyle={{fontWeight: "bold", fontSize:20}}/>
            <Card.Cover source={{ uri: item.picture }}/>
            
            <Card.Content> 
                <Text>{item.type}, Breed: {item.breed}</Text>
                <Text>Gender: {item.sex}, Weight: {item.weight}</Text>
            </Card.Content>
            <Card.Actions>
                <Button title="View Info"
                onPress={()=>{handleInfo(item)}}/>
            </Card.Actions>
        </Card>
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
                        contentContainerStyle={{ padding: 1, margin: 5 }}
                         /> :
                    <ThemedText type="title">No pets? Please register one.</ThemedText>
            }
        </View>
    )


}


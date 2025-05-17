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
import { ThemedView } from "./ThemedView";

export default function PetList() {
    const uid = auth.currentUser?.uid;
    const [petData, setPetData] = useState<PetItem[]>([])
    const SM_SCREEN = 576
    const MD_SCREEN = 768
    const { height, width } = useWindowDimensions()
    const numColums = width < SM_SCREEN ? 1 : width < MD_SCREEN ? 2 : 4
    useEffect(() => {
        if (!uid) return;
        const petsRef = collection(db,'users',uid,'pets');
        const q = query(petsRef, orderBy("createdAt","asc"));

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
        router.push('/(extra)/petpage');
    }

    const renderItem = ({ item }: { item: PetItem }) => (
        // <Card name={item.name} img={require("@/assets/images/paw_placeholder.jpg")} onPress={() => Alert.alert(item.name)}></Card>
        //May also need to add the if img found change to that 
         <Card style={{ 
            margin: 5, 
            flex: 1,
            justifyContent: 'center'
        }}>
            <Card.Title title={item.name} titleStyle={{fontWeight: "bold", fontSize:25, alignSelf:'center'}}/>
            <Card.Cover source={{ uri: item.picture }} resizeMode="contain" style={{height:300, width:300, alignSelf: 'center'}}/>
            
            <Card.Content> 
                <ThemedText style={{color: '#000', fontWeight: 'bold', alignSelf:'center'}}>{`Type: ${item.type}\nBreed: ${item.breed}\nGender: ${item.sex}\nWeight: ${item.weight} Kilogram`}</ThemedText>
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
                <View style={{borderWidth: 2, borderColor: '#808080', padding: 20, borderRadius: 8}}>
                    <ThemedText type='subtitle'>Your registered pets:</ThemedText>
                    <FlatList
                        data={petData}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                        numColumns={numColums}
                        key={numColums}
                        contentContainerStyle={{ padding: 1, margin: 5 }}
                        scrollEnabled={false} />
                        </View> :
                    <ThemedText type="title">No pets? Please register one.</ThemedText>
            }
        </View>
    )


}


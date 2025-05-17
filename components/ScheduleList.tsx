import { Schedule } from "@/interface";
import { useEffect, useState } from "react";
import { auth, db } from "./FirebaseConfig";
import { useWindowDimensions, View, Image } from "react-native";
import { collection, query, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { ThemedText } from "./ThemedText";
import React from "react";
import { FlatList } from "react-native-gesture-handler";

export default function ScheduleList() {
    const uid = auth.currentUser?.uid;
    const [scheduleData, setData] = useState<Schedule[]>([])
    const SM_SCREEN = 576
    const MD_SCREEN = 768
    const { height, width } = useWindowDimensions()
    const numColums = width < SM_SCREEN ? 1 : width < MD_SCREEN ? 2 : 4
    useEffect(() => {
        if (!uid) return;
        const reference = collection(db, 'users', uid, 'schedule');
        const q = query(reference, orderBy("scheduleDate", "asc"));

        const unsub = onSnapshot(q, snapshot => {
            const list = snapshot.docs.map((doc, index) => ({
                index,
                _id: doc.id,
                ...(doc.data() as Omit<Schedule, '_id'>)
            }));
            setData(list)
        })
        return () => unsub();
    }, [uid])
    //const newDate = date instanceof Timestamp ? date.toDate() : date
    const convertDate = (date: Date) => {
        const d = date;
        const newDate = d instanceof Timestamp ? d.toDate() : date
        return newDate.toDateString()
    }

    const renderItem = ({ item }: { item: Schedule }) => (
        <View>
            
            <View style={{marginTop: 10, flexDirection: 'row', alignItems:'center'}}>
                <Image source={{ uri: item.pet.picture }} style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    marginRight: 10
                }} />
                <ThemedText type="defaultSemiBold">
                    {item.index + 1}. {item.pet.name}, {item.location}, {convertDate(item.scheduleDate)}
                </ThemedText>
            </View>
        </View>
    )

    return (
        <View>
            {
                (scheduleData.length > 0) ?
                    <View>
                        <ThemedText type='subtitle'>All schedules:</ThemedText>
                        <FlatList
                            data={scheduleData}
                            keyExtractor={(item) => item._id}
                            renderItem={renderItem}
                            numColumns={1}
                            key={1}
                            contentContainerStyle={{ padding: 1, margin: 5 }}
                            scrollEnabled={false}
                        />
                    </View> : <ThemedText>No schedules yet.</ThemedText>
            }
        </View>
    )
}
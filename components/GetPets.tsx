import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "./FirebaseConfig";
import { PetItem } from "@/interface";

export const getPets = async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) return [];

        const petsRef = collection(db, 'users', uid, 'pets')
        const petsSnapshot = await getDocs(petsRef);

        const pets: PetItem[] = petsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                _id: doc.id,
                name: data.name || '',
                sex: data.sex,
                type: data.type || '',
                breed: data.breed || '',
                weight: data.weight ?? 0,
                picture: data.picture || '',
                condition: Array.isArray(data.condition) ? data.condition : [],
            }

        })
        return pets;
    }
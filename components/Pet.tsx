import { PetItem } from "@/interface";

let pet: PetItem | null = null;

export const getSelectedPet = () => pet;
export const setPet = (selectedPet: PetItem) => {
    pet = selectedPet
    // This should work.
}
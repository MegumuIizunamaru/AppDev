import React, { useState } from "react"
import AddPetForm from "@/components/RegisterLoginPet"
import { ScrollView } from "react-native"
import { Text } from "react-native"

export default function RegisterPet(){
    return (
    <ScrollView>
        <AddPetForm/>
    </ScrollView>);
}
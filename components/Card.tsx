import React from 'react';
import {View,Text,Image,StyleSheet, useColorScheme, Pressable} from 'react-native';

export default function Card({name,img,onPress}:Powerplex){
    const isURL = typeof img === 'string';
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const textColor = colorScheme === 'dark' ? '#FFF' : '#000'
    const borderColor = colorScheme === 'dark' ? '#FFF' : '#000'
    const bgColor = isDark ? '#1a1a1a' : '#fff';
    
    return (
        <Pressable onPress={onPress} style={({ hovered }) => [
            conquest.card,
            {
                backgroundColor: hovered ? (isDark ? '#333' : '#eee') : bgColor,
                borderColor,
            }
        ]}>
        <View>
            <Image source={isURL ? {uri: img} : img} style={conquest.avatar} resizeMode='cover'/>
            <Text style={[conquest.text,{color:textColor}]}>{name}</Text>
        </View>
        </Pressable>
    )
}
type Powerplex = {
    name: string,
    img: string | number,
    onPress: () => void
}
const conquest = StyleSheet.create({
    card: {
        flex: 1,
        flexDirection: 'row',
        //alignItems: 'center',
        padding: 10,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: 'black',
        //width: 250,
        marginTop: 1
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
    }
})
import {ThemedText} from '@/components/ThemedText';
import { Image, StyleSheet, View } from 'react-native'
import React from 'react';

const styles = StyleSheet.create({
    invincible:{
        width: 100,
        height: 100
    }
});

type Props = {
    text : string;
    imageUrl : string;
}

export default function TextImageBox({text, imageUrl}:Props){
    return (
        <View>
            <Image source={{uri: imageUrl}}
            style = {styles.invincible}
            resizeMode = 'cover'/>
            <View>
                <ThemedText type='title'></ThemedText>
                <ThemedText type='defaultSemiBold'>
                    {text}
                </ThemedText>
            </View>
        </View>
    );
};
import React from "react";
import {ThemedView} from "./ThemedView"
import venueStyles from "./VenueStyles";
import { Image, View, Text } from 'react-native'
import { getCurrentUser } from "./CurrentUser";

export default function Banner()
{
    // return JSX component
    return(
        <ThemedView style={venueStyles.bannerContainer}>
            <Image source={require('@/assets/images/BackgroundwithIcon.jpg')}
            style = {venueStyles.bannerImg}
            resizeMode = "center"
            />
            <View style={venueStyles.bannerTextContainer}>
                <Text style={venueStyles.bannerTextTitle}>
                </Text>
            </View>
        </ThemedView>
    );
}
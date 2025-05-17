import {StyleSheet} from "react-native"

const venueStyles = StyleSheet.create(
    {
        bannerContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
            width: '100%',
            position: 'relative'
        },
        bannerImg: {
            width: '100%',
            height: '100%',
            margin: 0,
            backgroundColor:'#ddecf7'
        },
        bannerTextTitle:{
            color: 'black',
            textAlign: 'center',
            fontSize: 24,
            fontWeight: 'bold'
        },
        bannerTextSnippet:{
            color: 'white',
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 'bold'
        },
        bannerTextContainer:{
            width: '80%',
            position: 'absolute'
        }
    }
);

const TextBox = StyleSheet.create(
    {
        ImagePart:{
            width: '100%',
            height: '100%'
        }
    }
)

export default venueStyles; TextBox;
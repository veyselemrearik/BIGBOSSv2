import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';


const BabyCard = props => {
    
    let TouchableCmp = TouchableOpacity;
    if(Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    return (
        <TouchableCmp onPress={props.onPersonelDetail} useForeground>
            <View style={styles.babycard}>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{ uri: props.image }} />
                </View>

                <View style={styles.details}>
                    <Text style={styles.name}>{props.name + ' ' + props.surname}</Text>
                    <Text style={styles.birth}>{props.workDate}</Text>
                </View>
                {props.children}
            </View>
        </TouchableCmp>
    );
};

const styles = StyleSheet.create({
    babycard: {
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        height: 300,
        margin: 20
    },
    image: {
        width: '100%',
        height: '100%'
    },
    name: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        marginVertical: 2
    },
    birth: {
        fontSize: 14,
        color: '#888',
        marginTop: 2
    },

    details: {
        alignItems: 'center',
        height: '15%',
        padding: 10
    },
    imageContainer: {
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden'
    },



});

export default BabyCard;
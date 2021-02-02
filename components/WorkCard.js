import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableNativeFeedback, Platform } from 'react-native';


const WorkCard = props => {

    let TouchableCmp = TouchableOpacity;
    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    return (
        <TouchableCmp onPress={props.onWorkDetail} useForeground>
            <View style={styles.artcard}>
                <View style={styles.textCont}>           
                     <Text style={styles.title}>{props.title}</Text>
                </View>
                <View style={styles.details}>
                    <Text style={styles.publish}>{props.workDate}</Text>
                    <Text style={styles.publish}>{props.desc}</Text>
                </View>
                {props.children}
            </View>
        </TouchableCmp>
    );
};

const styles = StyleSheet.create({
    artcard: {
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        height: 150,
        margin: 20
    },

    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        marginVertical: 2
    },
    publih: {
        fontSize: 16,
        color: '#888',
        marginTop: 2
    },

    details: {
        alignItems: 'center',
        padding: 10
    },
    textCont: {
        justifyContent:'center',
        alignItems:'center',
        padding:10
    }




});

export default WorkCard;
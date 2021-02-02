import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, TouchableNativeFeedback, Platform, Image } from 'react-native';

const CategoryGrid = props => {
    let TouchableCmp = TouchableOpacity;

    if (Platform.OS === 'android' && Platform.Version >= 21) {
        TouchableCmp = TouchableNativeFeedback;
    }
    return (
        <View style={styles.gridItem}>
            <TouchableCmp
                style={styles.most}
                onPress={props.onSelect}>
                <View style={{ ...styles.container }}>
                    <View>
                        <Image source={props.image} style={styles.catImage} />
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={styles.title} numberOfLines={1}>{props.title}</Text>
                    </View>
                </View>
            </TouchableCmp>
        </View>
    );
};

const styles = StyleSheet.create({
    gridItem: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: 'row',
        width: '100%',
        padding: 20,

    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        textAlign: 'center',
        color: 'grey'
    },
    catImage: {
        width: 32,
        height: 32,
        borderRadius: 10,
        marginRight:20
    },
    most: {
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default CategoryGrid;
import React, { useEffect, useCallback } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../constants/Colors';


const MyFriendDetailScreen = props => {
    const bossId = props.navigation.getParam('bossId');
    const selectedFriend = useSelector(state => state.bosses.myFriends.find(doc => doc.bossId === bossId));

    return (
        <ScrollView>
            <Image style={styles.image} source={{ uri: selectedFriend.imageUrl }} />

            <View style={styles.labelContainer}>
                <View style={styles.label}>
                    <Text style={styles.info}>Ad Soyad: {selectedFriend.name} {selectedFriend.surname}</Text>
                </View>
                <View style={styles.label}>
                    <Text style={styles.info}>Email Adresi: {selectedFriend.email}</Text>
                </View>
                <View style={styles.label}>
                    <Text style={styles.info}>Telefon: {selectedFriend.phoneNumber}</Text>
                </View>
            </View>
        </ScrollView>
    );

};

MyFriendDetailScreen.navigationOptions = navData => {
    return {
        headerTitle: "Arkadaş Bilgileri",
    };
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300
    },
    info: {
        fontFamily: 'open-sans-bold',
        fontSize: 15,
        textAlign: 'center',
        padding: 5,
        color: Colors.textColor
    },
    actions: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        borderBottomColor: Colors.greyish,
        borderBottomWidth: 1,
        paddingBottom: 10
    },
    actionTitle: {
        fontFamily: 'open-sans-bold',
        fontSize: 17,
        color: Colors.primary
    },
    label: {
        borderBottomColor: Colors.greyish,
        borderBottomWidth: 1,
        padding: 10
    }
});

export default MyFriendDetailScreen;
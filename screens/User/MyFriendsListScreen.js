import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, Text, View, Image, ActivityIndicator, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../constants/Colors';
import * as relationActions from '../../store/actions/relations';
import * as userActions from '../../store/actions/user';

const MyFriendsListScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const relations = props.navigation.getParam('relations');
    const myFriends = props.navigation.getParam('myFriends');
    const dispatch = useDispatch();

    console.log('Arkadaş listesi sayfasına gelen myfriends parametresi:');
    console.log(myFriends);


    if (isLoading || relations === undefined) {
        loadRelations();
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!isLoading && myFriends.length === 0) {
        return (
            <View style={styles.centered}>
                <View style={styles.warningTextContainer}>
                    <Text style={styles.warning}>Herhangi bir arkadaş eşleşmeniz bulunmamaktadır. Davet göndermek ister misiniz?</Text>
                </View>
                <TouchableOpacity style={styles.davet} onPress={() => { props.navigation.navigate('SendRequest', { myFriends: myFriends }); }}>
                    <Text style={{ color: 'white', fontFamily: 'open-sans-bold', fontSize: 16 }}>Davet Gönder</Text>
                </TouchableOpacity>

            </View>

        );
    }

    return (
        <View>
            <FlatList
                data={myFriends}
                keyExtractor={item => item.id}
                renderItem={itemData =>
                    <View style={styles.requestContainer}>
                        <Image style={styles.image} source={{ uri: itemData.item.imageUrl }} />
                        <View style={styles.labelContainer}>
                            <View style={styles.label}>
                                <Text style={styles.info}>Ad Soyad: {itemData.item.name + ' ' + itemData.item.surname}</Text>
                            </View>
                            <View style={styles.label}>
                                <Text style={styles.info}>Email Adresi: {itemData.item.email}</Text>
                            </View>
                            <View style={styles.label}>
                                <Text style={styles.info}>Telefon No: {itemData.item.phoneNumber}</Text>
                            </View>
                        </View>

                    </View>
                }
            />
            <View style={{justifyContent:'center',alignItems:'center'}}>
                <TouchableOpacity style={styles.davet} onPress={() => { props.navigation.navigate('SendRequest', { myFriends: myFriends }); }}>
                    <Text style={{ color: 'white', fontFamily: 'open-sans-bold', fontSize: 16 }}>Arkadaş Ekle</Text>
                </TouchableOpacity>
            </View>
        </View>



    );
};


MyFriendsListScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Arkadaşlarım',
    };

};

const styles = StyleSheet.create({
    actions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginHorizontal: 10
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 20
    },
    warning: {
        fontFamily: 'open-sans-bold',
        fontSize: 17,
        color: Colors.textColor,
        textAlign: 'center'
    },
    imageWarning: {
        width: '60%',
        height: '60%'
    },
    warningTextContainer: {
        paddingVertical: 30
    },
    image: {
        width: 50,
        height: 50
    },
    davet: {
        backgroundColor: Colors.accentOrange,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        width: '50%',
        borderColor: Colors.greyish
    },
    requestContainer: {
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        height: 350,
        margin: 20
    },
    labelContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'open-sans-bold',
        fontSize: 16,
    },
    info: {
        fontSize: 16,
        fontFamily: 'open-sans-bold'
    },
    image: {
        width: '100%',
        height: 200
    },
    label: {
        borderBottomColor: Colors.greyish,
        borderBottomWidth: 1,
        paddingVertical: 10,
    }
});

export default MyFriendsListScreen;
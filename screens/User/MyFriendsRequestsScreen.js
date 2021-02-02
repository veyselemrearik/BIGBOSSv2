import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, StyleSheet, Text, View, Alert, ActivityIndicator, Button, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Card from '../../components/Card';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as userActions from '../../store/actions/user';
import * as relActions from '../../store/actions/relations';

const MyFriendsRequestsScreen = props => {
    const relations = props.navigation.getParam('relations');
    const pendingFriends = props.navigation.getParam('myPendings');
    const [currPendings, setCurrPendings] = useState(pendingFriends);
    const dispatch = useDispatch();

    useEffect(() => {
        setCurrPendings(pendingFriends);
    }, [dispatch, pendingFriends]);

    const acceptHandler = useCallback(
        async (status, id) => {
            let relId;
            for (const key in relations) {
                if (relations[key].bossId === id) {
                    relId = relations[key].id;
                }
            }
            if (status === false) {
                Alert.alert('Emin misiniz?', 'Seçilen kullanıcının isteğini reddediyorsunuz...', [
                    { text: 'Hayır', style: 'default' },
                    {
                        text: 'Evet', style: 'destructive', onPress: async () => {
                            await dispatch(relActions.deleteRelation(relId));
                            const currNew = pendingFriends.filter(fr => fr.bossId !== id);
                            setCurrPendings(currNew);
                        }
                    }
                ]);
            } else {
                Alert.alert('Emin misiniz?', 'Seçilen kullanıcının isteği kabul edilecek...', [
                    { text: 'Hayır', style: 'default' },
                    {
                        text: 'Evet', style: 'destructive', onPress: async () => {
                            await dispatch(relActions.updateBossRelation(relId, id, status));
                            const currNew = pendingFriends.filter(fr => fr.bossId !== id);
                            setCurrPendings(currNew);
                        }
                    }
                ]);

            }

        }, [dispatch, setCurrPendings]
    );




    if (relations === undefined || pendingFriends === undefined) {
        return (
            <View style={styles.centered}>
                <Text style={styles.warning}>Herhangi bir arkadaşlık isteği bulunmamaktadır. Daha sonra tekrar kontrol ediniz!</Text>
            </View>
        );
    }


    if (pendingFriends.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.warning}>Herhangi bir arkadaşlık isteği bulunmamaktadır. Daha sonra tekrar kontrol ediniz!</Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <FlatList
                data={currPendings}
                keyExtractor={item => item.bossId}
                renderItem={
                    itemData =>
                        <Card style={styles.card}>
                            <View style={styles.details}>
                                <View style={styles.identity}>
                                    <Text style={styles.title}>{itemData.item.name} {itemData.item.surname}</Text>
                                </View>
                                <View style={styles.iletisim}>
                                    <View style={styles.ikili}>
                                        <Ionicons name="ios-call" size={24} color="#888" />
                                        <Text style={styles.label}>
                                            {itemData.item.phoneNumber}
                                        </Text>
                                    </View>
                                    <View style={styles.ikili}>
                                        <Ionicons name="ios-mail" size={24} color="#888" />
                                        <Text style={styles.label}>
                                            {itemData.item.email}
                                        </Text>
                                    </View>


                                </View>
                            </View>
                            <View style={styles.iconContainer}>
                                <TouchableOpacity onPress={() => {
                                    acceptHandler(true, itemData.item.bossId);
                                }
                                } style={{ ...styles.icons, alignItems: 'flex-start', justifyContent: 'center' }}>
                                    <Text style={styles.iconText}>
                                        Onayla
                                   </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    acceptHandler(false, itemData.item.bossId);
                                }} style={{ ...styles.icons, alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <Text style={styles.iconText}>
                                        Reddet
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Card>
                }
            />

        </View>

    );

};


MyFriendsRequestsScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Eşleşme İstekleri'
    };

};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    screen: {
        flex: 1
    },
    sections: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        shadowColor: 'white',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        backgroundColor: 'white',
        marginBottom: 10
    },
    topButton1: {
        backgroundColor: Colors.accentOrange,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%'
    },
    topButton2: {
        backgroundColor: Colors.primary,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        width: '50%'
    },
    buttonTitle: {
        fontFamily: 'open-sans-bold',
        fontSize: 17,
        color: 'white'
    },
    card: {
        padding: 10,
        margin: 30,
    },
    identity: {
        padding: 10
    },
    iletisim: {
        padding: 10
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 15,
        color: 'black'
    },
    label: {
        fontFamily: 'open-sans-bold',
        fontSize: 15,
        color: '#888',
        paddingLeft: 10
    },
    details: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        flexDirection: 'row'
    },
    ikili: {
        flexDirection: 'row',
        paddingBottom: 10
    },
    icons: {
        width: '50%',
        borderTopColor: Colors.greyish,
        borderTopWidth: 1,
        padding: 10
    },
    iconText: {
        fontFamily: 'open-sans-bold',
        color: Colors.accentPurple,
        fontSize: 16
    },
    warning: {
        fontFamily: 'open-sans-bold',
        fontSize: 16,
        color: Colors.textColor
    }
});

export default MyFriendsRequestsScreen;
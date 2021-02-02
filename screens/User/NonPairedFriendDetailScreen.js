import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, Text, View, Alert, ActivityIndicator, ScrollView, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'underscore';
import Colors from '../../constants/Colors';
import * as relationActions from '../../store/actions/relations';


const NonPairedFriendDetailScreen = props => {
    const bossId = props.navigation.getParam('bossId');
    const selectedBoss = useSelector(state => state.bosses.allBosses.find(doc => doc.bossId === bossId));
    const relations = useSelector(state => state.relations.bossRelation);
    const [requestSend, setRequestSend] = useState(false);

    const dispatch = useDispatch();

    const checkRequestStatus = useCallback(() => {
        for (const key in relations) {
            if (relations[key].userId === bossId) {
                setRequestSend(true);
            }
        }
    }, [setRequestSend, relations, bossId]);

    useEffect(() => {
        checkRequestStatus();
    }, [checkRequestStatus]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', checkRequestStatus);
        return () => {
            willFocusSub.remove();
        };
    }, [checkRequestStatus]);

    const addFriendHandler = useCallback((userId) => {
        Alert.alert('Emin misiniz?', 'Seçilen kullanıcıya istek göndermek üzeresiniz...', [
            { text: 'Hayır', style: 'default' },
            {
                text: 'Evet', style: 'destructive', onPress: () => {
                    try {
                        dispatch(relationActions.createRelation(userId));
                        Alert.alert('İstek Gönderildi!', 'Davetiniz başarı ile gönderildi. Kullanıcı onayından sonra eşleşme sağlanacaktır!', [{ text: 'Tamam' }]);
                        props.navigation.navigate('SendRequest');
                    } catch (err) {
                        setError(err.message);
                    }
                }
            }
        ]);
    }, [dispatch]);

    return (
        <ScrollView>
            <Image style={styles.image} source={{ uri: selectedBoss.imageUrl }} />
            <View style={styles.actions}>
                {requestSend ?
                    <TouchableOpacity onPress={() => { }}>
                        <Text style={styles.actionTitle}>İstek Gönderildi</Text>
                    </TouchableOpacity> :

                    <TouchableOpacity onPress={() => { addFriendHandler(bossId) }}>
                        <Text style={styles.actionTitle}>Arkadaş İsteği Gönder</Text>
                    </TouchableOpacity>
                }

            </View>
            <View style={styles.labelContainer}>
                <View style={styles.label}>
                    <Text style={styles.info}>Ad Soyad: {selectedBoss.name} {selectedBoss.surname}</Text>
                </View>
                <View style={styles.label}>
                    <Text style={styles.info}>Email Adresi: {selectedBoss.email}</Text>
                </View>
                <View style={styles.label}>
                    <Text style={styles.info}>Telefon: {selectedBoss.phoneNumber}</Text>
                </View>
            </View>
        </ScrollView>
    );

};

NonPairedFriendDetailScreen.navigationOptions = navData => {
    return {
        headerTitle: "Kullanıcı Bilgileri",
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

export default NonPairedFriendDetailScreen;
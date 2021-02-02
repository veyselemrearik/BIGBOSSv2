import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, Text, View, ScrollView, ActivityIndicator, Button, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../constants/Colors';
import * as userActions from '../../store/actions/user';


const SendRequestScreen = props => {
    const myFriends = props.navigation.getParam('myFriends');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const allBosses = useSelector(state => state.bosses.allBosses);

    const dispatch = useDispatch();

    const loadAllBosses = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(userActions.fetchAllBosses());
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadAllBosses);
        return () => {
            willFocusSub.remove();
        };
    }, [loadAllBosses]);

    useEffect(() => {
        loadAllBosses();
    }, [dispatch, loadAllBosses]);

    const goToRequestDetail = (id) => {
        console.log(myFriends);
        if(myFriends === undefined) {
            props.navigation.navigate('NonPairedFriendDetail', { bossId: id });
        } else {
            const isBossPaired = myFriends.find(doc => doc.bossId === id);

            if(isBossPaired === undefined) {
                props.navigation.navigate('NonPairedFriendDetail', { bossId: id });
            } else {
                props.navigation.navigate('MyFriendDetail', { bossId: id });
            }
        }

    };


    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Hata Oluştu!</Text>
                <Button title="Tekrar Dene" onPress={loadAllBosses} color={Colors.primary} />
            </View>
        );
    }

    if (isLoading || allBosses === undefined) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!isLoading && allBosses.length === 0) {
        return (
            <View style={styles.centered2}>
                <View style={styles.warningTextContainer}>
                    <Text style={styles.warning}>Eşleşme gönderebileceğiniz kullanıcı bulunmamaktadır! Daha sonra tekrar kontrol ediniz...</Text>
                </View>
            </View>

        );
    }

    return (
        <FlatList
            data={allBosses}
            keyExtractor={item => item.id}
            renderItem={itemData =>
                <View style={styles.requestContainer}>
                    <Image style={styles.image} source={{ uri: itemData.item.imageUrl }} />
                    <View style={styles.labelContainer}>
                        <View style={styles.label}>
                            <Text style={styles.info}>Ad Soyad: {itemData.item.name + ' ' + itemData.item.surname}</Text>
                        </View>
                    </View>
                    <View style={styles.labelContainer}>
                        <TouchableOpacity style={styles.addButton}  onPress={() => {goToRequestDetail(itemData.item.bossId)}}>
                            <Text style={styles.addButtonText} >Arkadaş Ekle</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        />
    );
};


SendRequestScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Kullanıcı Listesi'
    };

};

const styles = StyleSheet.create({
    buttonTitle: {
        fontFamily: 'open-sans-bold',
        fontSize: 18,
        color: 'white',
        paddingTop: 15
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttons: {
        backgroundColor: Colors.accentPurple,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        borderColor: Colors.greyish
    },
    warning: {
        fontFamily: 'open-sans-bold',
        fontSize: 17,
        color: Colors.textColor,
        textAlign: 'center'
    },
    image: {
        width: '100%',
        height: 200
    },
    warningTextContainer: {
        paddingVertical: 30
    },

    centered2: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 20
    },
    requestContainer: {
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
    labelContainer: {
        justifyContent:'center',
        alignItems:'center',
        paddingTop:10,
        fontFamily:'open-sans-bold',
        fontSize:16
    },
    info: {
        fontSize:16,
        fontFamily:'open-sans-bold'
    },
    addButton: {
        backgroundColor: Colors.accentOrange,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        borderColor: Colors.greyish
    },
    addButtonText: {
        fontFamily:'open-sans-bold',
        fontSize:16,
        color:'white'
    }

});

export default SendRequestScreen;
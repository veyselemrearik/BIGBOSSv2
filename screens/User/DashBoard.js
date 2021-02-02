import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList,Text,ActivityIndicator } from 'react-native';
import CategoryGrid from '../../components/CategoryGrid';
import UserMenu from '../../constants/UserMenu';
import Colors from '../../constants/Colors';
import ImageIcon from '../../components/ImageIcon';
import { useSelector, useDispatch } from 'react-redux';
import * as relActions from '../../store/actions/relations';
import * as userActions from '../../store/actions/user';

const DashBoard = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [counter, setCounter] = useState(0);
    const relations = useSelector(state => state.relations.bossRelation);
    const myFriend = useSelector(state => state.bosses.myFriends);
    const pendings = useSelector(state => state.bosses.myPendingRequests);
    const dispatch = useDispatch();

    console.log('MyFriends:');
    console.log(myFriend);


    const loadBoth = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            await loadRelations();
            await loadPendings();
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [setIsLoading, setError, dispatch]);

    useEffect(() => {
        loadBoth();
    }, [dispatch, loadBoth]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadBoth);
        return () => {
            willFocusSub.remove();
        };
    }, [loadBoth]);

    const loadPendings = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        let reCounter = 0;
        try {
            for (const key in relations) {
                if (relations[key].status === true) {
                    await dispatch(userActions.fetchUsersFriends(relations[key].userId,relations[key].bossId));
                } else {
                    reCounter = reCounter + 1;
                    setCounter(reCounter);
                    await dispatch(userActions.fetchPendingFriends(relations[key].bossId,relations[key].userId ));
                }
            }
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError, relations, setCounter]);

    useEffect(() => {
        loadPendings();
    }, [dispatch, loadPendings]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadPendings);
        return () => {
            willFocusSub.remove();
        };
    }, [loadPendings]);

    const loadRelations = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(relActions.fetchBossRelation());
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadRelations);
        return () => {
            willFocusSub.remove();
        };
    }, [loadRelations]);

    useEffect(() => {
        loadRelations();
    }, [dispatch, loadRelations]);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }



    const renderGridItem = (itemData) => {
        let imagePath;
        if (itemData.item.title === 'Personel Ekle') {
            imagePath = require('../../assets/images/category/catAddPersonel.png');
        }
        if (itemData.item.title === 'Personel Listesi') {
            imagePath = require('../../assets/images/category/catPersonelList.png');
        }
        if (itemData.item.title === 'Günlük Programınız') {
            imagePath = require('../../assets/images/category/catToday.png');
        }
        if (itemData.item.title === 'İş Listesi') {
            imagePath = require('../../assets/images/category/catWorkList.png');
        }
        if (itemData.item.title === 'İş Ekle') {
            imagePath = require('../../assets/images/category/catAddWork.png');
        }
        if (itemData.item.title === 'Arkadaş Listesi') {
            imagePath = require('../../assets/images/category/catAddFriends.png');
        }
        if (itemData.item.title === 'Arkadaş İsteği') {
            imagePath = require('../../assets/images/icons/requests.png');
        }

        if (itemData.item.screen === 'MyFriendsRequests') {
            return (

                <CategoryGrid
                    title={itemData.item.title + ' ' + counter}
                    onSelect={() => {
                        props.navigation.navigate(itemData.item.screen, { myPendings: pendings, relations: relations })
                    }}
                    image={imagePath}
                />

            );
        } else if(itemData.item.screen === 'MyFriendsList'){
            return (
                <CategoryGrid
                    title={itemData.item.title}
                    onSelect={() => {
                        props.navigation.navigate(itemData.item.screen, { myFriends: myFriend, relations: relations })
                    }}
                    image={imagePath}
                />

            );
        } else {
            return (
                <CategoryGrid
                    title={itemData.item.title}
                    onSelect={() => {
                        props.navigation.navigate(itemData.item.screen)
                    }}
                    image={imagePath}
                />

            );
        }





    };
    return (
        <View style={styles.body}>
            <FlatList
                keyExtractor={(item, index) => item.id}
                data={UserMenu.CATEGORIES}
                numColumns={1}
                renderItem={renderGridItem}
            />
        </View>

    );
};

DashBoard.navigationOptions = (navData) => {
    return {

        headerTitle: 'Anasayfa',
        headerRight: () => <ImageIcon imagePath={require('../../assets/images/icons/profile.png')} goTo={() => {
            navData.navigation.navigate('Myinfo')
        }} />
    };

};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    body: {
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icon: {
        width: 32,
        height: 32
    },
});

export default DashBoard;
import React, {useState,useEffect,useCallback} from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Button,FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import Colors from '../../constants/Colors';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import {useDispatch} from 'react-redux';
import * as authActions from '../../store/actions/auth';
import * as userActions from '../../store/actions/user';

const MyInfoScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const bosses = useSelector(state => state.bosses.bossInfo);
    const dispatch = useDispatch();

    const loadBosses = useCallback(async () => {
        setError(null);
        setIsLoading(true); 
        try {
            await dispatch(userActions.fetchUser());
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadBosses);
        return () => {
            willFocusSub.remove();
        };
    },[loadBosses]);

    useEffect(() => {
        loadBosses();
    }, [dispatch,loadBosses]);

    const logoutHandler = useCallback(() => {
        dispatch(authActions.logout());
    }, [dispatch]);

    useEffect(() => {
        props.navigation.setParams({ logout: logoutHandler });
    }, [logoutHandler]);

    const editUserHandler = (id) => {
        props.navigation.navigate('EditMyInfo', { bossId: id });
    };
    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Hata Oluştu!</Text>
                <Button title="Tekrar Dene" onPress={loadBosses} color={Colors.primary} />
            </View>
        );
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }
    return (
        <FlatList
          data={bosses}
          keyExtractor={item => item.id}
          renderItem={itemData => 
            <ScrollView>
                {console.log(itemData.item.imageUrl)}
            <Image style={styles.image} source={{ uri: itemData.item.imageUrl}} />
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => { 
                    editUserHandler(itemData.item.id);
                }}>
                    <Text style={{ ...styles.actionTitle, color: Colors.accentOrange }}>Düzenle</Text>
                </TouchableOpacity>
            </View>
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
        </ScrollView>
          }
        />
      );
};

MyInfoScreen.navigationOptions = navData => {
    const logoutFn = navData.navigation.getParam('logout');
    return {
        headerTitle: 'Profilim',
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title="Çıkış" iconName='md-log-out' color="white" onPress={() => {
                logoutFn();
                navData.navigation.navigate('Auth');
            }} />
        </HeaderButtons>
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
        color: Colors.primary
    },
    actions: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
    },
    actionTitle: {
        fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    label: {
        borderBottomColor: Colors.greyish,
        borderBottomWidth: 1,
        padding: 10
    }
});

export default MyInfoScreen;
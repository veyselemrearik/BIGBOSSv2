import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, Text, View, Alert, ActivityIndicator, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import BabyCard from '../../components/BabyCard';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import Colors from '../../constants/Colors';
import * as personelActions from '../../store/actions/personel';


const MyPersonelScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const personels = useSelector(state => state.personels.userPersonel);
    const dispatch = useDispatch();

    const loadPersonels = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(personelActions.fetchPersonels());
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadPersonels);
        return () => {
            willFocusSub.remove();
        };
    },[loadPersonels]);

    useEffect(() => {
        loadPersonels();
    }, [dispatch,loadPersonels]);

    const editPersonelHandler = (id) => {
        props.navigation.navigate('EditPersonel', { personelId: id });
    };

    const deleteHandler = (id) => {
        Alert.alert('Emin misiniz?', 'Seçilen personeli silmek istediğinizden emin misiniz?', [
            { text: 'Hayır', style: 'default' },
            {
                text: 'Sil', style: 'destructive', onPress: () => {
                    dispatch(personelActions.deletePersonel(id));
                }
            }
        ]);
    };

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Hata Oluştu!</Text>
                <Button title="Tekrar Dene" onPress={loadPersonels} color={Colors.primary} />
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

    if (!isLoading && personels.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.warning}>Personel Kaydınız Bulunmamaktadır. Eklemek ister misiniz?</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={personels}
            keyExtractor={item => item.id}
            renderItem={
                itemData => <BabyCard
                    image={itemData.item.imageUrl}
                    name={itemData.item.name}
                    surname={itemData.item.surname}
                    workDate={itemData.item.workBeginDate}
                    onPersonelDetail={() => {
                        props.navigation.navigate('PersonelDetail', {
                            personelId: itemData.item.id,
                            personelFullName: itemData.item.name + ' ' + itemData.item.surname
                        })
                    }} >
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={() => {
                            editPersonelHandler(itemData.item.id);
                        }}>
                            <Text style={{ ...styles.buttonTitle, color: Colors.primary }}>Düzenle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={deleteHandler.bind(this, itemData.item.id)}>
                            <Text style={{ ...styles.buttonTitle, color: Colors.accentOrange }}>Sil</Text>
                        </TouchableOpacity>
                    </View>
                </BabyCard>
            }
        />
    );
};


MyPersonelScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Personel Listesi',
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title="Personel Ekle" iconName='md-add' color="white" onPress={() => {
                navData.navigation.navigate('AddPersonel');
            }} />
        </HeaderButtons>
    };

};

const styles = StyleSheet.create({
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '25%',
        marginHorizontal: 10
    },
    buttonTitle: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    warning: {
        fontFamily: 'open-sans-bold',
        fontSize: 17,
        color: Colors.primary,
        paddingHorizontal: 20,
        justifyContent: 'center'

    },
});

export default MyPersonelScreen;
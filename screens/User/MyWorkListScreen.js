import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, Text, View, Alert, ActivityIndicator, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import WorkCard from '../../components/WorkCard';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import Colors from '../../constants/Colors';
import * as workActions from '../../store/actions/work';


const MyWorkListScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const works = useSelector(state => state.works.userWork);
    const dispatch = useDispatch();

    const loadWorks = useCallback(async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(workActions.fetchWorks());
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadWorks);
        return () => {
            willFocusSub.remove();
        };
    },[loadWorks]);

    useEffect(() => {
        loadWorks();
    }, [dispatch,loadWorks]);

    const editWorkHandler = (id) => {
        props.navigation.navigate('EditWork', { workId: id });
    };

    const deleteHandler = (id) => {
        Alert.alert('Emin misiniz?', 'Seçilen iş planını silmek istediğinizden emin misiniz?', [
            { text: 'Hayır', style: 'default' },
            {
                text: 'Sil', style: 'destructive', onPress: () => {
                    dispatch(workActions.deleteWork(id));
                }
            }
        ]);
    };

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Hata Oluştu!</Text>
                <Button title="Tekrar Dene" onPress={loadWorks} color={Colors.primary} />
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

    if (!isLoading && works.length === 0) {
        return (
            <View style={styles.centered}>
                <Text style={styles.warning}>İş Planı Kaydınız Bulunmamaktadır. Eklemek ister misiniz?</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={works}
            keyExtractor={item => item.id}
            renderItem={
                itemData => <WorkCard
                    title={itemData.item.title}
                    desc={itemData.item.description}
                    workDate={itemData.item.workDate}
                    onWorkDetail={() => {
                        props.navigation.navigate('WorkDetail', {
                            workId: itemData.item.id,
                            workFullName: itemData.item.title
                        })
                    }} >
                    <View style={styles.actions}>
                        <TouchableOpacity onPress={() => {
                            editWorkHandler(itemData.item.id);
                        }}>
                            <Text style={{ ...styles.buttonTitle, color: Colors.primary }}>Düzenle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={deleteHandler.bind(this, itemData.item.id)}>
                            <Text style={{ ...styles.buttonTitle, color: Colors.accentOrange }}>Sil</Text>
                        </TouchableOpacity>
                    </View>
                </WorkCard>
            }
        />
    );
};


MyWorkListScreen.navigationOptions = navData => {
    return {
        headerTitle: 'İş Listesi',
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title="İş Planı Ekle" iconName='md-add' color="white" onPress={() => {
                navData.navigation.navigate('AddWork');
            }} />
        </HeaderButtons>
    };

};

const styles = StyleSheet.create({
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
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

export default MyWorkListScreen;
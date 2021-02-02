import React, { useState,useEffect, useCallback } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../constants/Colors';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import * as personelActions from '../../store/actions/personel';


const PersonelDetailScreen = props => {
    const personelId = props.navigation.getParam('personelId');
    const selectedPersonel = useSelector(state => state.personels.userPersonel.find(per => per.id === personelId));
    const dispatch = useDispatch();
    const editPersonelHandler = (id) => {
        props.navigation.navigate('EditPersonel', { personelId: id });
    };

    const deleteHandler = useCallback(() => {
        Alert.alert('Emin misiniz?', 'Seçilen personeli silmek istediğinizden emin misiniz?', [
            { text: 'Hayır', style: 'default' },
            {
                text: 'Sil', style: 'destructive', onPress: () => {
                    dispatch(personelActions.deletePersonel(personelId));
                }
            }
        ]);
        props.navigation.navigate('MyPersonel');
    }, [dispatch]);

    useEffect(() => {
        props.navigation.setParams({ delete: deleteHandler });
    }, [deleteHandler]);
    return (
        <ScrollView>
            <Image style={styles.image} source={{ uri: selectedPersonel.imageUrl }} />
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => {
                    editPersonelHandler(personelId);
                }}>
                    <Text style={{ ...styles.actionTitle, color: Colors.accentOrange }}>Düzenle</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.labelContainer}>
                <View style={styles.label}>
                    <Text style={styles.info}>Tc Kimlik No: {selectedPersonel.tcNo}</Text>
                </View>
                <View style={styles.label}>
                    <Text style={styles.info}>E-mail: {selectedPersonel.mail}</Text>
                </View>
                <View style={styles.label}>
                    <Text style={styles.info}>Telefon: {selectedPersonel.telNo}</Text>
                </View>
                <View style={styles.label}>
                    <Text style={styles.info}>Adres: {selectedPersonel.address}</Text>
                </View>
                <View style={styles.label}>
                    <Text style={styles.info}>Aylık avans: {selectedPersonel.avans}</Text>
                </View>
                <View style={styles.label}>
                    <Text style={styles.info}>Yıllık izin: {selectedPersonel.izin}</Text>
                </View>
            </View>
        </ScrollView>
    );

};

PersonelDetailScreen.navigationOptions = navData => {
    const deleteFn = navData.navigation.getParam('delete');
    return {
        headerTitle: navData.navigation.getParam('personelFullName'),
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title="Personel Sil" iconName='ios-trash' color="white"
                onPress={deleteFn} />
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
        flexDirection: 'row',
        justifyContent: 'space-between',
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

export default PersonelDetailScreen;
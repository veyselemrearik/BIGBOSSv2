import React, { useState, useEffect, useCallback } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../constants/Colors';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import * as workActions from '../../store/actions/work';


const WorkDetailScreen = props => {
    const workId = props.navigation.getParam('workId');
    const selectedWork = useSelector(state => state.works.userWork.find(work => work.id === workId));
    const dispatch = useDispatch();
    const editWorkHandler = (id) => {
        props.navigation.navigate('EditWork', { workId: id });
    };

    const deleteHandler = useCallback(() => {
        Alert.alert('Emin misiniz?', 'Seçilen iş planını silmek istediğinizden emin misiniz?', [
            { text: 'Hayır', style: 'default' },
            {
                text: 'Sil', style: 'destructive', onPress: () => {
                    dispatch(workActions.deleteWork(workId));
                }
            }
        ]);
        props.navigation.navigate('MyWorkList');
    }, [dispatch]);

    useEffect(() => {
        props.navigation.setParams({ delete: deleteHandler });
    }, [deleteHandler]);
    return (
        <ScrollView>
            <View style={styles.labelContainer}>
                <View style={styles.label}>
                    <Text style={styles.info}>İş Planı Başlığı: {selectedWork.title}</Text>
                </View>
                <View style={styles.label}>
                    <Text style={styles.info}>İş Planı Tarihi: {selectedWork.workDate}</Text>
                </View>
                <View style={styles.label}>
                    <Text style={styles.info}>Açıklama: {selectedWork.description}</Text>
                </View>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity onPress={() => {
                    editWorkHandler(workId);
                }}>
                    <Text style={{ ...styles.actionTitle, color: Colors.primary }}>Düzenle</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

};

WorkDetailScreen.navigationOptions = navData => {
    const deleteFn = navData.navigation.getParam('delete');
    return {
        headerTitle: navData.navigation.getParam('workFullName'),
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title="İş Planı Sil" iconName='ios-trash' color="white"
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

export default WorkDetailScreen;
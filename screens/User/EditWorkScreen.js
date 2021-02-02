import React, { useEffect, useCallback, useReducer, useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, StyleSheet, Alert, Image, Button, Text, TouchableOpacity } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import { useSelector, useDispatch } from 'react-redux';
import * as workActions from '../../store/actions/work';
import Input from '../../components/Input';
import ImageSelector from '../../components/ImageSelector';
import Colors from '../../constants/Colors';
const FORM_INPUT_UPDATE = 'UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        };
    }
    return state;
};


const EditWorkScreen = props => {
    const workId = props.navigation.getParam('workId');
    const editedWork = useSelector(state => state.works.userWork.find(work => work.id === workId));
    const dispatch = useDispatch();


    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editedWork ? editedWork.title : '',
            workDate: editedWork ? editedWork.workDate : '',
            description: editedWork ? editedWork.description : '',
        },
        inputValidities: {
            title: editedWork ? true : false,
            workDate: editedWork ? true : false,
            description: editedWork ? true : false,

        },
        formIsValid: editedWork ? true : false
    });

    const submitHandler = useCallback(() => {
        if (!formState.formIsValid) {
            Alert.alert('Hatalı form veri girişi!', 'Lütfen form alanlarını uygun doldurunuz!', [
                { text: 'Tamam' }
            ]);
            return;
        }


        dispatch(workActions.updateWork(
            workId,
            formState.inputValues.title,
            formState.inputValues.workDate,
            formState.inputValues.description
        ));

        props.navigation.navigate('MyWorkList');
    }, [dispatch, workId, formState]);

    useEffect(() => {
        props.navigation.setParams({ submit: submitHandler });
    }, [submitHandler]);


    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        });
    }, [dispatchFormState]);

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
            <ScrollView>
                <View style={styles.form}>

                    <Input
                        id="title"
                        label="İş Planı Başlığı"
                        errorText="Lütfen uygun bir başlık giriniz!"
                        keyboardType="default"
                        onInputChange={inputChangeHandler}
                        initialValue={editedWork ? editedWork.title : ''}
                        initiallyValid={!!editedWork}
                        required
                    />
                    <Input
                        id="workDate"
                        label="İş Planı Tarihi:"
                        errorText="Lütfen uygun bir tarih giriniz!"
                        keyboardType="decimal-pad"
                        onInputChange={inputChangeHandler}
                        initialValue={editedWork ? editedWork.workDate : ''}
                        initiallyValid={!!editedWork}
                        required
                    />

                    <Input
                        id="description"
                        label="İş Planı Açıklama:"
                        errorText="Lütfen uygun bir açıklama giriniz!"
                        keyboardType="default"
                        onInputChange={inputChangeHandler}
                        initialValue={editedWork ? editedWork.description : ''}
                        initiallyValid={!!editedWork}
                        required
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

EditWorkScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit');
    return {
        headerTitle: 'İş Planı Düzenle' ,
        headerRight: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title="Kaydet" iconName='md-checkmark' color="white"
                onPress={submitFn} />
        </HeaderButtons>
    };
};

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    formControl: {
        width: '100%'
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8
    },
    birthLabel: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    },
    birtDatePicker: {
        flexDirection: 'row',
        paddingBottom: 10,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
    },
    birthDateContainer: {
        width: '70%'
    },
    birthDatePickerButton: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        width: '30%'
    },
    button: {
        backgroundColor: Colors.accentOrange,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        borderColor: Colors.greyish
    },
    buttonTitle: {
        fontFamily: 'open-sans-bold',
        fontSize: 15,
        color: 'white'
    },


});

export default EditWorkScreen;
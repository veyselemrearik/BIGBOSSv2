import React, { useEffect, useCallback, useReducer, useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, StyleSheet, Alert } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import { useSelector, useDispatch } from 'react-redux';
import * as userActions from '../../store/actions/user';
import Input from '../../components/Input';
import ImageSelector from '../../components/ImageSelector';
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

const EditMyInfoScreen = props => {
    const [selectedImage, setSelectedImage] = useState();
    const bossId = props.navigation.getParam('bossId');
    const editedBoss = useSelector(state => state.bosses.bossInfo.find(boss => boss.id === bossId));
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            bossId: editedBoss.bossId,
            imageUrl: editedBoss.imageUrl,
            name: editedBoss.name,
            surname: editedBoss.surname,
            email: editedBoss.email,
            phoneNumber: editedBoss.phoneNumber
        },
        inputValidities: {
            bossId: true,
            imageUrl: true,
            name: true,
            surname: true,
            email: true,
            phoneNumber: true
        },
        formIsValid: true
    });

    const submitHandler = useCallback(() => {
        if (!formState.formIsValid) {
            Alert.alert('Hatalı form veri girişi!', 'Lütfen form alanlarını uygun doldurunuz!', [
                { text: 'Tamam' }
            ]);
            return;
        }
        dispatch(userActions.updateUser(
            bossId,
            editedBoss.bossId,
            selectedImage,
            formState.inputValues.name,
            formState.inputValues.surname,
            editedBoss.email,
            formState.inputValues.phoneNumber
            ));

        props.navigation.goBack();
    }, [dispatch, bossId, formState]);

    useEffect(() => {
        props.navigation.setParams({ submit: submitHandler });
    }, [submitHandler]);

    const imageTakenHandler = async (imagePath) => {
        let photoUrl1 = await dispatch(
            parentActions.updateUserAvatar(
                imagePath
            )
        );
        const photoUrl2 = photoUrl1+'jpeg';
        setSelectedImage(photoUrl2);
    };

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
                    <ImageSelector onImageTaken={imageTakenHandler} title="Profil Resmi"/>
                    <Input
                        id="name"
                        label="Ad"
                        errorText="Lütfen uygun bir isim giriniz!"
                        keyboardType="default"
                        onInputChange={inputChangeHandler}
                        initialValue={editedBoss.name}
                        initiallyValid={!!editedBoss}
                        required
                    />
                    <Input
                        id="surname"
                        label="Soyad"
                        errorText="Lütfen uygun bir soyisim giriniz!"
                        keyboardType="default"
                        onInputChange={inputChangeHandler}
                        initialValue={editedBoss.surname}
                        initiallyValid={!!editedBoss}
                        required
                    />
                    <Input
                        id="phoneNumber"
                        label="Telefon Numarasi"
                        errorText="Lütfen uygun bir telefon numarasi giriniz!"
                        keyboardType="decimal-pad"
                        onInputChange={inputChangeHandler}
                        initialValue={editedBoss.phoneNumber}
                        initiallyValid={!!editedBoss}
                        required
                        min={0.1}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

EditMyInfoScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit');
    return {
        headerTitle: 'Profil Duzenle',
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
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    }


});

export default EditMyInfoScreen;
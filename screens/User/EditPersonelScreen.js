import React, { useEffect, useCallback, useReducer, useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, StyleSheet, Alert, Image, Button, Text, TouchableOpacity } from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import { useSelector, useDispatch } from 'react-redux';
import * as personelActions from '../../store/actions/personel';
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


const EditPersonelScreen = props => {
    const [selectedImage, setSelectedImage] = useState();
    const personelId = props.navigation.getParam('personelId');
    const editedPersonel = useSelector(state => state.personels.userPersonel.find(per => per.id === personelId));
    const dispatch = useDispatch();


    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            name: editedPersonel ? editedPersonel.name : '',
            imageUrl: editedPersonel ? editedPersonel.imageUrl : '',
            surname: editedPersonel ? editedPersonel.surname : '',
            tcNo: editedPersonel ? editedPersonel.tcNo : '',
            gender: editedPersonel ? editedPersonel.gender : '',
            izin: editedPersonel ? editedPersonel.izin : '',
            avans: editedPersonel ? editedPersonel.avans : '',
            address: editedPersonel ? editedPersonel.address : '',
            mail: editedPersonel ? editedPersonel.mail : '',
            telNo: editedPersonel ? editedPersonel.telNo : '',
        },
        inputValidities: {
            name: editedPersonel ? true : false,
            surname: editedPersonel ? true : false,
            tcNo: editedPersonel ? true : false,
            gender: editedPersonel ? true : false,
            izin: editedPersonel ? true : false,
            avans: editedPersonel ? true : false,
            address: editedPersonel ? true : false,
            mail: editedPersonel ? true : false,
            telNo: editedPersonel ? true : false,

        },
        formIsValid: editedPersonel ? true : false
    });

    const submitHandler = useCallback(() => {
        if (!formState.formIsValid) {
            Alert.alert('Hatalı form veri girişi!', 'Lütfen form alanlarını uygun doldurunuz!', [
                { text: 'Tamam' }
            ]);
            return;
        }


        dispatch(personelActions.updatePersonel(
            personelId,
            selectedImage,
            formState.inputValues.name,
            formState.inputValues.surname,
            formState.inputValues.tcNo,
            formState.inputValues.gender,
            formState.inputValues.izin,
            formState.inputValues.avans,
            formState.inputValues.address,
            formState.inputValues.mail,
            formState.inputValues.telNo
        ));


        props.navigation.navigate('MyPersonel');
    }, [dispatch, personelId, formState]);

    useEffect(() => {
        props.navigation.setParams({ submit: submitHandler });
    }, [submitHandler]);

    const imageTakenHandler = async (imagePath) => {
        let photoUrl1 = await dispatch(
            personelActions.uploadPersonelAvatar(
                imagePath
            )
        );
        const photoUrl2 = photoUrl1 + 'jpeg';
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

                    <ImageSelector onImageTaken={imageTakenHandler} title="Personel Profil Resmi" />

                    <Input
                        id="name"
                        label="Ad"
                        errorText="Lütfen uygun bir isim giriniz!"
                        keyboardType="default"
                        onInputChange={inputChangeHandler}
                        initialValue={editedPersonel ? editedPersonel.name : ''}
                        initiallyValid={!!editedPersonel}
                        required
                    />
                    <Input
                        id="surname"
                        label="Soyad"
                        errorText="Lütfen uygun bir soyisim giriniz!"
                        keyboardType="default"
                        onInputChange={inputChangeHandler}
                        initialValue={editedPersonel ? editedPersonel.surname : ''}
                        initiallyValid={!!editedPersonel}
                        required
                    />

                    <Input
                        id="tcNo"
                        label="Tc Kimlik No:"
                        errorText="Lütfen uygun bir tc giriniz!"
                        keyboardType="decimal-pad"
                        onInputChange={inputChangeHandler}
                        initialValue={editedPersonel ? editedPersonel.tcNo : ''}
                        initiallyValid={!!editedPersonel}
                        required
                        min={0.1}
                    />
                    <Input
                        id="mail"
                        label="Personel Email:"
                        errorText="Lütfen uygun bir email giriniz!"
                        keyboardType="default"
                        onInputChange={inputChangeHandler}
                        initialValue={editedPersonel ? editedPersonel.mail : ''}
                        initiallyValid={!!editedPersonel}
                        required
                        min={0.1}
                    />

                    <Input
                        id="telNo"
                        label="Personel Telefon No:"
                        errorText="Lütfen uygun bir telefon numarası giriniz!"
                        keyboardType="decimal-pad"
                        onInputChange={inputChangeHandler}
                        initialValue={editedPersonel ? editedPersonel.telNo : ''}
                        initiallyValid={!!editedPersonel}
                        required
                        min={0.1}
                    />

                    <Input
                        id="gender"
                        label="Cinsiyet:"
                        errorText="Lütfen uygun bir cinsiyet seçiniz!"
                        keyboardType="default"
                        onInputChange={inputChangeHandler}
                        initialValue={editedPersonel ? editedPersonel.gender : ''}
                        initiallyValid={!!editedPersonel}
                        required
                    />
                    <Input
                        id="izin"
                        label="Kalan Yıllık İzin:"
                        errorText="Lütfen uygun bir sayı seçiniz!"
                        keyboardType="decimal-pad"
                        onInputChange={inputChangeHandler}
                        initialValue={editedPersonel ? editedPersonel.izin : ''}
                        initiallyValid={!!editedPersonel}
                        required
                    />
                    <Input
                        id="avans"
                        label="Alınan Avans:"
                        errorText="Lütfen uygun bir miktar seçiniz!"
                        keyboardType="decimal-pad"
                        onInputChange={inputChangeHandler}
                        initialValue={editedPersonel ? editedPersonel.avans : ''}
                        initiallyValid={!!editedPersonel}
                        required
                    />
                    <Input
                        id="address"
                        label="Personel Adres:"
                        errorText="Lütfen uygun bir adres giriniz!"
                        keyboardType="default"
                        onInputChange={inputChangeHandler}
                        initialValue={editedPersonel ? editedPersonel.address : ''}
                        initiallyValid={!!editedPersonel}
                        required
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

EditPersonelScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit');
    return {
        headerTitle: 'Personel Düzenle' ,
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

export default EditPersonelScreen;
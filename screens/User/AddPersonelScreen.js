import React, { useEffect, useCallback, useReducer, useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, StyleSheet, Alert, Image, Button, Text } from 'react-native';
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



const AddPersonelScreen = props => {
    const [selectedImage, setSelectedImage] = useState();
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            name: '',
            imageUrl: '',
            surname: '',
            tcNo: '',
            gender: '',
            izin: '',
            avans: '',
            address: '',
            mail: '',
            telNo: ''

        },
        inputValidities: {
            name: false,
            surname: false,
            tcNo: false,
            gender: false,
            address: false,
            mail: false,
            telNo: false

        },
        formIsValid: false
    });

    const submitHandler = useCallback(() => {
        if (!formState.formIsValid) {
            Alert.alert('Hatalı form veri girişi!', 'Lütfen form alanlarını uygun doldurunuz!', [
                { text: 'Tamam' }
            ]);
            return;
        }


        dispatch(personelActions.createPersonel(
            selectedImage,
            formState.inputValues.name,
            formState.inputValues.surname,
            formState.inputValues.tcNo,
            formState.inputValues.gender,
            formState.inputValues.address,
            formState.inputValues.mail,
            formState.inputValues.telNo
        ));


        props.navigation.navigate('MyPersonel');
    }, [dispatch, formState]);

    useEffect(() => {
        props.navigation.setParams({ submit: submitHandler });
    }, [submitHandler]);

    const imageTakenHandler = async (imagePath) => {
        let photoUrl1 = await dispatch(
            personelActions.uploadPersonelAvatar(
                imagePath
            )
        );
        const photoUrl2 = photoUrl1 + '.jpeg';
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
                        initialValue={''}
                        initiallyValid={false}
                        required
                    />
                    <Input
                        id="surname"
                        label="Soyad"
                        errorText="Lütfen uygun bir soyisim giriniz!"
                        keyboardType="default"
                        onInputChange={inputChangeHandler}
                        initialValue={''}
                        initiallyValid={false}
                        required
                    />
                    <Input
                        id="tcNo"
                        label="Tc Kimlik No"
                        errorText="Lütfen uygun bir tc giriniz!"
                        keyboardType="decimal-pad"
                        onInputChange={inputChangeHandler}
                        initialValue={''}
                        initiallyValid={false}
                        required
                        min={0.1}
                    />
                    <Input
                        id="mail"
                        label="Personel E-mail"
                        errorText="Lütfen uygun bir mail giriniz!"
                        keyboardType="default"
                        onInputChange={inputChangeHandler}
                        initialValue={''}
                        initiallyValid={false}
                        required
                    />
                    <Input
                        id="telNo"
                        label="Personel Telefon No"
                        errorText="Lütfen uygun bir mail giriniz!"
                        keyboardType="decimal-pad"
                        onInputChange={inputChangeHandler}
                        initialValue={''}
                        initiallyValid={false}
                        required
                    />

                    <Input
                        id="gender"
                        label="Cinsiyet"
                        errorText="Lütfen uygun bir cinsiyet seçiniz!"
                        keyboardType="default"
                        onInputChange={inputChangeHandler}
                        initialValue={''}
                        initiallyValid={false}
                        required
                    />
                    <Input
                        id="address"
                        label="Personel Adres"
                        errorText="Lütfen uygun bir adres giriniz!"
                        keyboardType="default"
                        onInputChange={inputChangeHandler}
                        initialValue={''}
                        initiallyValid={false}
                        required
                    />

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

AddPersonelScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit');
    return {
        headerTitle: 'Personel Ekle',
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

export default AddPersonelScreen;
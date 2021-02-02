import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
    ScrollView,
    View,
    KeyboardAvoidingView,
    StyleSheet,
    Image,
    Text,
    TouchableOpacity,
    Platform,
    ActivityIndicator,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../../components/Input';
import Card from '../../components/Card';
import Colors from '../../constants/Colors';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import { useDispatch } from 'react-redux';
import * as authActions from '../../store/actions/auth';
import * as userActions from '../../store/actions/user';
import ImageSelector from '../../components/ImageSelector';


const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

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


const UserSignUpScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [selectedImage, setSelectedImage] = useState();

    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            name: '',
            surname: '',
            email: '',
            phone: '',
            password: ''
        },
        inputValidities: {
            name: false,
            surname: false,
            email: false,
            phone: false,
            password: false
        },
        formIsValid: false
    });

    useEffect(() => {
        if (error) {
            Alert.alert('Bir hata oluştu!', error, [{ text: 'Tamam' }]);
        }
    }, [error]);

    const signupHandler = async () => {
        setError(null);
        setIsLoading(true);

            try {
                await dispatch(
                    authActions.signup(
                        formState.inputValues.email,
                        formState.inputValues.password
                    )
                );

                let photoUrl1 = await dispatch(
                    userActions.uploadUserAvatar(
                        selectedImage
                    )
                );

                const photoUrl2 = photoUrl1+'.jpeg';
                
                await dispatch(
                    userActions.createUser(
                        photoUrl2,
                        formState.inputValues.name,
                        formState.inputValues.surname,
                        formState.inputValues.email,
                        formState.inputValues.phone,
                    )
                );
                props.navigation.navigate('Dashboard');

            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }



    };

    const imageTakenHandler = imagePath => {
        setSelectedImage(imagePath);
    };

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
            dispatchFormState({
                type: FORM_INPUT_UPDATE,
                value: inputValue,
                isValid: inputValidity,
                input: inputIdentifier
            });
        },
        [dispatchFormState]
    );
    const [readIsChecked, setReadIsChecked] = useState(false);
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={styles.screen}
        >
            <LinearGradient colors={['white', '#900C3F']} style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView style={{ flex: 1, width: '100%' }}>
                        <ScrollView
                            style={styles.inputContainer}
                            keyboardShouldPersistTaps="always"
                            keyboardDismissMode="on-drag">

                            <ImageSelector onImageTaken={imageTakenHandler} title="Profil Resmi"/>

                            <Input
                                id="name"
                                label="Ad"
                                keyboardType="default"
                                required
                                autoCapitalize="none"
                                errorText="Lütfen isminizi giriniz."
                                onInputChange={inputChangeHandler}
                                initialValue=""
                            />
                            <Input
                                id="surname"
                                label="Soyad"
                                keyboardType="default"
                                required
                                autoCapitalize="none"
                                errorText="Lütfen soyisminizi giriniz."
                                onInputChange={inputChangeHandler}
                                initialValue=""
                            />
                            <Input
                                id="email"
                                label="E-mail"
                                keyboardType="email-address"
                                required
                                email
                                autoCapitalize="none"
                                errorText="Lütfen geçerli bir mail adresi giriniz."
                                onInputChange={inputChangeHandler}
                                initialValue=""
                            />
                            <Input
                                id="phone"
                                label="Telefon"
                                keyboardType="phone-pad"
                                required
                                autoCapitalize="none"
                                errorText="Lütfen geçerli bir telefon numarası giriniz."
                                onInputChange={inputChangeHandler}
                                initialValue=""
                            />
                            <Input
                                id="password"
                                label="Şifre"
                                keyboardType="default"
                                secureTextEntry
                                required
                                minLength={6}
                                autoCapitalize="none"
                                errorText="Uygun bir şifre giriniz."
                                onInputChange={inputChangeHandler}
                                initialValue=""
                            />
                        </ScrollView>
                        {isLoading ? (<ActivityIndicator style={{ paddingTop: 20 }} size="large" color={Colors.primary} />) : (
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={{ ...styles.buttons, backgroundColor: Colors.primary, width: '50%' }}
                                    onPress={signupHandler}>
                                    <Text style={styles.buttonTitle}>Kayıt Ol</Text>
                                </TouchableOpacity>
                            </View>)}

                        <View style={styles.girisText}>
                            <Text>Zaten bir hesabınız varsa </Text>
                            <TouchableOpacity onPress={() => {
                                props.navigation.navigate('Login')
                            }}>
                                <Text style={{ textDecorationLine: 'underline' }} >giriş yapın</Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

UserSignUpScreen.navigationOptions = navData => {
    return {
        headerTitle: '',
        headerLeft: () => <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item title='Geri' color={Colors.accentPurple} iconSize={25} iconName='ios-arrow-back' onPress={() => {
                navData.navigation.navigate('Login');
            }} />
        </HeaderButtons>
    };

};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    authContainer: {
        width: '90%',
        height: '90%',
        padding: 20,
        marginTop: 20,
        backgroundColor: '#DCDCDC'
    },
    buttonContainer: {
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        marginTop: 20
    },
    girisText: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    buttons: {
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
    checkboxContainer: {
        flexDirection: "row",
        marginBottom: 10,
        width: '100%'
    },
    checkbox: {
        alignSelf: "center"
    },
    label: {
        margin: 8,
    }

});

export default UserSignUpScreen;

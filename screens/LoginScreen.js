import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
    ScrollView,
    View,
    KeyboardAvoidingView,
    StyleSheet,
    Platform,
    Image,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Input from '../components/Input';
import Card from '../components/Card';
import Colors from '../constants/Colors';
import { useDispatch } from 'react-redux';
import * as authActions from '../store/actions/auth';

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

const LoginScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    });

    useEffect(() => {
        if (error) {
            Alert.alert('Bir hata oluştu!', error, [{ text: 'Tamam' }]);
        }
    }, [error]);

    const loginHandler = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(
                authActions.login(
                    formState.inputValues.email,
                    formState.inputValues.password
                )
            );
            props.navigation.navigate('Dashboard');
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
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
    return (

        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            style={styles.screen}
        >
            <LinearGradient colors={['white', '#900C3F']} style={styles.gradient}>

                <Card style={styles.authContainer}>
                    <View style={styles.logoContainer} >
                        <Image source={require('../assets/images/giris.png')} style={styles.logo} />
                    </View>

                    <ScrollView>

                        <ScrollView style={styles.inputContainer} keyboardShouldPersistTaps="always" keyboardDismissMode="on-drag">
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
                                id="password"
                                label="Şifre"
                                keyboardType="default"
                                secureTextEntry
                                required
                                minLength={6}
                                autoCapitalize="none"
                                errorText="En az 6 karakterli, uygun bir şifre giriniz!"
                                onInputChange={inputChangeHandler}
                                initialValue=""
                            />
                        </ScrollView>
                        {isLoading ? (<ActivityIndicator style={{ paddingTop: 20 }} size="large" color={Colors.primary} />) : (
                            <View style={styles.buttonContainer}>
                                <View style={styles.bottomButtonContainer}>
                                    <TouchableOpacity
                                        style={{ ...styles.buttons, backgroundColor: Colors.primary, width: '50%' }}
                                        onPress={loginHandler}>

                                        <Text style={styles.buttonTitle}>Giriş Yap</Text>

                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{ ...styles.buttons, backgroundColor: Colors.accentOrange, width: '50%' }}
                                        onPress={() => {
                                            props.navigation.navigate('UserSignup');
                                        }}
                                    >
                                        <Text style={styles.buttonTitle}>Kayıt Ol</Text>

                                    </TouchableOpacity>
                                </View>

                            </View>)}
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
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
        marginTop: 50,
        backgroundColor: '#DCDCDC'
    },
    buttonContainer: {
        marginTop: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },

    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        top: -10,
        marginTop: 5
    },
    logo: {
        width: 100,
        height: 100,
    },
    inputContainer: {
        marginTop: 50
    },
    girisText: {
        fontFamily: 'open-sans-bold',
        textAlignVertical: 'center',
        textAlign: 'center'

    },
    buttons: {
        backgroundColor: Colors.accentOrange,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
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
    bottomButtonContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        justifyContent: 'space-between'
    }

});

export default LoginScreen;

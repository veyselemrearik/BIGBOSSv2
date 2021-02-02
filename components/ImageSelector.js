import React, { useState } from 'react';
import { View, Image, StyleSheet, Button, Text, Alert, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const ImageSelector = props => {

    const [pickedImage, setPickedImage] = useState();

    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        if (result.status !== 'granted') {
            Alert.alert('İzin Verilmedi!',
                'Aplikasyonu kullanabilmek için kamera ve galeri izni verilmesi gerekmektedir!'
                , [{ text: 'Tamam' }]);
            return false;
        }
        return true;
    };


    const takeImageHandler = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }
        const image = await ImagePicker.launchCameraAsync(
            {
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            }
        );

        setPickedImage(image.uri);
        props.onImageTaken(image.uri);

    };

    const uploadImageHandler = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }
        const image = await ImagePicker.launchImageLibraryAsync(
            {
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            }
        );

        setPickedImage(image.uri);
        props.onImageTaken(image.uri);

    };
    return (
        
        <View style={styles.imagePicker}>
            <Text style={styles.title}>{props.title}</Text>
            <View style={styles.imagePreview}>

                {!pickedImage ?
                    (<Text>Henüz bir resim seçilmedi.</Text>)
                    :
                    (<Image style={styles.image} source={{ uri: pickedImage }} />)
                }


            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={takeImageHandler}>
                    <Text style={styles.buttonTitle}>Resim Çek</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={uploadImageHandler}>
                    <Text style={styles.buttonTitle}>Galeriden Seç</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: '100%'
    },
    imagePicker: {
        marginBottom: 15
    },
    imagePreview: {
        width: '100%',
        height: 200,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: Colors.primary,
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
    title: {
        fontFamily:'open-sans-bold',
        marginVertical: 5,
    }
});

export default ImageSelector;
import React, { useState } from 'react';
import { View, Image, StyleSheet, Button, Text, Alert, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';
import * as DocumentPicker from 'expo-document-picker';


const FilePicker = props => {
    const [pickedFile, setPickedFile] = useState();

    const takeFileHandler = async () => {
        const file = await DocumentPicker.getDocumentAsync(
            {
                copyToCacheDirectory: true
            }
        );

        setPickedFile(file);
        props.onFileTaken(file);
    };

    return (
        
        <View style={styles.imagePicker}>
            <Text style={styles.title}>{props.title}</Text>
            <View style={styles.imagePreview}>

                {!pickedFile ?
                    (<Text>Henüz bir belge seçilmedi.</Text>)
                    :
                    (<Image style={styles.image} source={{ uri: pickedFile.uri }} />)
                }
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={takeFileHandler}>
                    <Text style={styles.buttonTitle}>Belge Seç</Text>
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
    title: {
        fontFamily:'open-sans-bold',
        marginVertical: 5,
    }
});

export default FilePicker;
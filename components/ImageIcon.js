import React from 'react';
import {TouchableOpacity,Image,StyleSheet} from 'react-native';

const ImageIcon = props => {
    return(
        <TouchableOpacity onPress={props.goTo} style={styles.imageContainer}>
            <Image source={props.imagePath} style={styles.image} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
imageContainer: {
    flex:1,
    paddingTop:10,
    paddingHorizontal:10
},
image: {
    width:30,
    height:30
}
});

export default ImageIcon;
import React from 'react';
import {HeaderButton} from 'react-navigation-header-buttons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const MaterialHeaderButton = props => {
    return(
        <HeaderButton
        {...props}
        IconComponent={MaterialCommunityIcons}
        iconSize={26}
        color='white'
        />
    );
};

export default MaterialHeaderButton;
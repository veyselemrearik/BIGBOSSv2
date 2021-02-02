import { DELETE_PERSONEL, CREATE_PERSONEL, UPDATE_PERSONEL, SET_PERSONEL } from '../actions/personel';
import Personel from '../../models/personel';

const initialState = {
    userPersonel: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_PERSONEL:
            return {
                userPersonel: action.personels
            };
        case CREATE_PERSONEL:
            const newPersonel = new Personel(
                new Date().toString(),
                action.personelData.bossId,
                action.personelData.name,
                action.personelData.surname,
                action.personelData.tcNo,
                action.personelData.gender,
                action.personelData.imageUrl,
                action.personelData.izin,
                action.personelData.avans,
                action.personelData.address,
                action.personelData.mail,
                action.personelData.telNo
            );
            return{
                ...state,
                userPersonel: state.userPersonel.concat(newPersonel)
            };
        case UPDATE_PERSONEL:
            const personelIndex = state.userPersonel.findIndex(per => per.id === action.pId);

            const updatedPersonel = new Personel(
                action.pId,
                state.userPersonel[personelIndex].bossId,
                action.personelData.name,
                action.personelData.surname,
                action.personelData.tcNo,
                action.personelData.gender,
                action.personelData.imageUrl,
                action.personelData.izin,
                action.personelData.avans,
                action.personelData.address,
                action.personelData.mail,
                action.personelData.telNo
            );

            const updatedUserPersonel = [...state.userPersonel];
            updatedUserPersonel[personelIndex] = updatedPersonel;

            return{
                ...state,
                userPersonel: updatedUserPersonel
            };

        case DELETE_PERSONEL:
            return {
                ...state,
                userPersonel: state.userPersonel.filter(
                    per => per.id !== action.pId
                )
            };
    }
    return state;
};
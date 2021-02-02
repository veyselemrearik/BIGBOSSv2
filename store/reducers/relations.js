import { DELETE_RELATION, CREATE_RELATION, UPDATE_RELATION, SET_RELATION } from '../actions/relations';
import Relation from '../../models/relation';


const initialState = {
    bossRelation: [],
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_RELATION:
            return {
                bossRelation: action.relations
            };
        case CREATE_RELATION:
            const newRelation = new Relation(
                action.relationData.id,
                action.relationData.bossId,
                action.relationData.userId,
                action.relationData.status
            );
            return {
                ...state,
                bossRelation: state.bossRelation.concat(newRelation)
            };
        case UPDATE_RELATION:
            const relationIndex = state.bossRelation.findIndex(relation => relation.id === action.rId);

            const updatedRelation = new Relation(
                action.rId,
                action.relationData.userId,
                action.relationData.bossId,
                action.relationData.status
            );

            const updatedBossRelations = [...state.bossRelation];
            updatedBossRelations[relationIndex] = updatedRelation;

            return {
                ...state,
                bossRelation: updatedBossRelations
            };

        case DELETE_RELATION:
            return {
                ...state,
                bossRelation: state.bossRelation.filter(
                    relation => relation.id !== action.rId
                )
            };
    }
    return state;
};
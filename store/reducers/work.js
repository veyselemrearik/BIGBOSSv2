import { DELETE_WORK, CREATE_WORK, UPDATE_WORK, SET_WORK } from '../actions/work';
import Work from '../../models/work';

const initialState = {
    userWork: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_WORK:
            return {
                userWork: action.works
            };
        case CREATE_WORK:
            const newWork = new Work(
                new Date().toString(),
                action.workData.bossId,
                action.workData.title,
                action.workData.workDate,
                action.workData.description
            );
            return{
                ...state,
                userWork: state.userWork.concat(newWork)
            };
        case UPDATE_WORK:
            const workIndex = state.userWork.findIndex(work => work.id === action.wId);

            const updatedWork = new Work(
                action.wId,
                state.userWork[workIndex].bossId,
                action.workData.title,
                action.workData.workDate,
                action.workData.description
            );

            const updatedUserWork = [...state.userWork];
            updatedUserWork[workIndex] = updatedWork;

            return{
                ...state,
                userWork: updatedUserWork
            };

        case DELETE_WORK:
            return {
                ...state,
                userWork: state.userWork.filter(
                    work => work.id !== action.wId
                )
            };
    }
    return state;
};
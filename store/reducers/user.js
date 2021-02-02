import { CREATE_BOSS, UPDATE_BOSS, GET_BOSS, GET_USER_FRIEND, GET_ALL_BOSSES,GET_PENDING_FRIENDS } from '../actions/user';
import Boss from '../../models/boss';


const initialState = {
    bossInfo: [],
    myFriends: [],
    allBosses: [],
    myPendingRequests: []
};

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_PENDING_FRIENDS:
            const totalPendings = action.pendingFriends;
            state.myPendingRequests = initialState.myPendingRequests;
            const resultOfFilter = state.myPendingRequests.filter(x => x.bossId === totalPendings.bossId);

            if (resultOfFilter.length !== 0) {
                const resultOfMyFriends = state.myFriends.filter(x => x.bossId === totalPendings.bossId);
                if (resultOfMyFriends.length !== 0) {
                    return {
                        myPendingRequests: state.myPendingRequests.filter(x => x.bossId !== totalPendings.bossId)
                    };
                } else {
                    return {
                        myPendingRequests: state.myPendingRequests
                    };
                }
            } else {
                return {
                    ...state,
                    myPendingRequests: state.myPendingRequests.concat(totalPendings)
                };
            }
        case GET_BOSS:
            return {
                bossInfo: action.bosses
            };

        case CREATE_BOSS:
            const newBoss = new Boss(
                action.bossData.id,
                action.bossData.bossId,
                action.bossData.imageUrl,
                action.bossData.name,
                action.bossData.surname,
                action.bossData.email,
                action.bossData.phoneNumber);
            return {
                ...state,
                bossInfo: newBoss
            };

        case UPDATE_BOSS:
            const bossIndex = state.bossInfo.findIndex(boss => boss.id === action.bId);

            const updatedBoss = new Boss(
                action.bId,
                state.bossInfo[bossIndex].bossId,
                action.bossData.imageUrl,
                action.bossData.name,
                action.bossData.surname,
                action.bossData.email,
                action.bossData.phoneNumber
            );
            const updatedBossInfo = [...state.bossInfo];
            updatedBossInfo[bossIndex] = updatedBoss;

            return {
                ...state,
                bossInfo: updatedBossInfo
            };

        case GET_USER_FRIEND:
            const check = state.myFriends.find(user => user.bossId === action.uId);
            if (check === undefined) {
                return {
                    myFriends: state.myFriends.concat(action.myFriend)
                };
            } else {
                return {
                    myFriends: state.myFriends
                };
            }

        case GET_ALL_BOSSES:
            return {
                ...state,
                allBosses: action.bosses
            };

    }
    return state;
};
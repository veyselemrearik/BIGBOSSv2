import Relation from '../../models/relation';

export const DELETE_RELATION = 'DELETE_RELATION';
export const CREATE_RELATION = 'CREATE_RELATION';
export const UPDATE_RELATION = 'UPDATE_RELATION';
export const SET_RELATION = 'SET_RELATION';


export const deleteRelation = rlId => {
    return async (dispatch, getState) => {
        await fetch(`https://bigboss-3916b-default-rtdb.firebaseio.com/relations/${rlId}.json`, {
            method: 'DELETE'
        });
        dispatch({
            type: DELETE_RELATION, rId: rlId
        });
    };
};

export const fetchBossRelation = () => {
    return async (dispatch, getState) => {
        try {
            const bossId = getState().auth.userId;
            const response = await fetch(`https://bigboss-3916b-default-rtdb.firebaseio.com/relations.json`);

            if (!response.ok) {
                throw new Error('Hatalı işlem!');
            }

            const resData = await response.json();
            const loadedBossRelations = [];

            for (const key in resData) {
                if (resData[key].bossId === bossId || resData[key].userId === bossId) {
                    loadedBossRelations.push(new Relation(
                        key,
                        resData[key].bossId,
                        resData[key].userId,
                        resData[key].status
                    ));
                }
            }
            dispatch({ type: SET_RELATION, relations: loadedBossRelations });
        } catch (err) {
            throw err;
        }

    };
};


export const createRelation = (userId) => {
    return async (dispatch, getState) => {
        const bossId = getState().auth.userId;
        const status = false;
        const response = await fetch(`https://bigboss-3916b-default-rtdb.firebaseio.com/relations.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bossId,
                userId,
                status
            })
        });

        dispatch({
            type: CREATE_RELATION,
            relationData: {
                bossId,
                userId,
                status
            }
        });
    };
};

export const updateBossRelation = (id, userId, status) => {
    return async (dispatch, getState) => {
        const bossId = getState().auth.userId;

        await fetch(`https://bigboss-3916b-default-rtdb.firebaseio.com/relations/${id}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bossId,
                userId,
                status
            })
        });

        dispatch({
            type: UPDATE_RELATION,
            rId: id,
            relationData: {
                bossId,
                userId,
                status
            }
        });
    };
};
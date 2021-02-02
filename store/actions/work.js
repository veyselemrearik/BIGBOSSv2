import Work from '../../models/work';
import Firebase from '../../constants/Firebase.js';
export const DELETE_WORK = 'DELETE_WORK';
export const CREATE_WORK = 'CREATE_WORK';
export const UPDATE_WORK = 'UPDATE_WORK';
export const SET_WORK = 'SET_WORK';


export const deleteWork = workId => {
    return async (dispatch) => {
        await fetch(`https://bigboss-3916b-default-rtdb.firebaseio.com/works/${workId}.json`, {
            method: 'DELETE'
        });
        dispatch({
            type: DELETE_WORK, wId: workId
        });
    };
};

export const fetchWorks = () => {
    return async (dispatch, getState) => {
        try {
            const userId = getState().auth.userId;
            const response = await fetch(`https://bigboss-3916b-default-rtdb.firebaseio.com/works.json`);

            if (!response.ok) {
                throw new Error('Hatalı işlem!');
            }

            const resData = await response.json();
            const loadedWorks = [];

            for (const key in resData) {
                if (resData[key].bossId === userId) {
                    loadedWorks.push(new Work(
                        key,
                        resData[key].bossId,
                        resData[key].title,
                        resData[key].workDate,
                        resData[key].description
                    ));
                }

            }
            dispatch({ type: SET_WORK, works: loadedWorks });
        } catch (err) {
            throw err;
        }

    };
};


export const createWork = ( title, workDate, description) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        const response = await fetch(`https://bigboss-3916b-default-rtdb.firebaseio.com/works.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bossId: userId,
                title,
                workDate,
                description
            })
        });

        dispatch({
            type: CREATE_WORK,
            workData: {
                title,
                workDate,
                description
            }
        });
    };
};

export const updateWork = (id, title, workDate, description) => {
    return async (dispatch) => {
        await fetch(`https://bigboss-3916b-default-rtdb.firebaseio.com/works/${id}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                workDate,
                description
            })
        });

        dispatch({
            type: UPDATE_WORK,
            wId: id,
            workData: {
                title,
                workDate,
                description
            }
        });
    };
};
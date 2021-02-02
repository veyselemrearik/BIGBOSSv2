import Boss from "../../models/boss";
import Firebase from '../../constants/Firebase.js';
export const CREATE_BOSS = 'CREATE_BOSS';
export const UPDATE_BOSS = 'UPDATE_BOSS';
export const GET_BOSS = 'GET_BOSS';
export const GET_USER_FRIEND = 'GET_USER_FRIEND';
export const GET_ALL_BOSSES = 'GET_ALL_BOSSES';
export const GET_PENDING_FRIENDS = 'GET_PENDING_FRIENDS';



export const fetchUser = () => {
    return async (dispatch, getState) => {
        try {
            const bssId = getState().auth.userId;
            const response = await fetch(`https://bigboss-3916b-default-rtdb.firebaseio.com/users.json`);

            if (!response.ok) {
                throw new Error('Hatalı işlem!');
            }

            const resData = await response.json();
            const loadedBoss = [];

            for (const key in resData) {
                if (resData[key].bossId === bssId) {
                    loadedBoss.push(new Boss(
                        key,
                        resData[key].bossId,
                        resData[key].imageUrl,
                        resData[key].name,
                        resData[key].surname,
                        resData[key].email,
                        resData[key].phoneNumber
                    ));
                }
            }
            dispatch({ type: GET_BOSS, bosses: loadedBoss });
        } catch (err) {
            throw err;
        }

    };
};

export const uploadUserAvatar = (uri) => {
    return async (dispatch, getState) => {
        try {
            const bossId = getState().auth.userId;
            const response = await fetch(uri);
            const blob = await response.blob();
            var ref = Firebase.storage().ref('user-profile/').child(bossId);
            const task = ref.put(blob);
            return new Promise((resolve, reject) => {
                task.on('state_changed', () => { }, reject,
                    () => resolve(task.snapshot.ref.getDownloadURL()));
            });
        } catch (err) {
            throw new Error(err.message);
        }
    }

}

export const updateUserAvatar = (uri) => {
    return async (dispatch, getState) => {
        try {
            const bossId = getState().auth.userId;
            const response = await fetch(uri);
            const blob = await response.blob();
            var ref = Firebase.storage().ref('user-profile/').child(bossId);
            const task = ref.put(blob);
            return new Promise((resolve, reject) => {
                task.on('state_changed', () => { }, reject,
                    () => resolve(task.snapshot.ref.getDownloadURL()));
            });
        } catch (err) {
            throw new Error(err.message);
        }
    }

}



export const createUser = (imageUrl, name, surname, email, phoneNumber) => {
    return async (dispatch, getState) => {
        const bossId = getState().auth.userId;
        const response = await fetch(`https://bigboss-3916b-default-rtdb.firebaseio.com/users.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bossId,
                imageUrl,
                name,
                surname,
                email,
                phoneNumber
            })
        });
        await response.json();
        dispatch({
            type: CREATE_BOSS,
            bossData: {
                bossId,
                imageUrl,
                name,
                surname,
                email,
                phoneNumber
            }
        });

        const update = {
            displayName: name + ' ' + surname,
            phoneNumber: phoneNumber,
            photoURL: imageUrl,
        };

        await Firebase.auth().currentUser.updateProfile(update);

    };


};


export const updateUser = (id, bossId, imageUrl, name, surname, email, phoneNumber) => {
    return async (dispatch) => {
        await fetch(`https://bigboss-3916b-default-rtdb.firebaseio.com/users/${id}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bossId,
                imageUrl,
                name,
                surname,
                email,
                phoneNumber
            })
        });

        dispatch({
            type: UPDATE_BOSS,
            bId: id,
            bossData: {
                bossId,
                imageUrl,
                name,
                surname,
                email,
                phoneNumber
            }
        });

        const update = {
            displayName: name + ' ' + surname,
            phoneNumber: phoneNumber,
            photoURL: imageUrl,
        };

        await Firebase.auth().currentUser.updateProfile(update);
    };
};

export const fetchUsersFriends = (userId,bossId) => {

    console.log('ARKADAŞLARIMI YAKALAMA FONKSİYONUNDAYIM:');

    console.log('Gelen userId: ' + userId);
    console.log('Gelen bossId: ' + bossId);

    return async (dispatch,getState) => {
        const bssId = getState().auth.userId;
        try {
            const response = await fetch(`https://bigboss-3916b-default-rtdb.firebaseio.com/users.json`);

            if (!response.ok) {
                throw new Error('Hatalı işlem!');
            }

            const resData = await response.json();
            let loadedFriend = [];
            let uId;
            for (const key in resData) {
                if (bossId === bssId) {
                    if (resData[key].bossId === userId) {
                        uId = resData[key].bossId;
                        loadedFriend = new Boss(
                            key,
                            resData[key].bossId,
                            resData[key].imageUrl,
                            resData[key].name,
                            resData[key].surname,
                            resData[key].email,
                            resData[key].phoneNumber
                        );
                    }
                }

            }
            console.log('Actionda load olan parent gizem olmalı:');
            console.log(loadedFriend);
            dispatch({ type: GET_USER_FRIEND, uId: uId, myFriend: loadedFriend });
        } catch (err) {
            throw err;
        }

    };
};

export const fetchAllBosses = () => {
    return async (dispatch, getState) => {
        try {
            const bssId = getState().auth.userId;
            const response = await fetch(`https://bigboss-3916b-default-rtdb.firebaseio.com/users.json`);

            if (!response.ok) {
                throw new Error('Hatalı işlem!');
            }

            const resData = await response.json();
            const loadedBosses = [];

            for (const key in resData) {
                if (resData[key].bossId !== bssId) {
                    loadedBosses.push(new Boss(
                        key,
                        resData[key].bossId,
                        resData[key].imageUrl,
                        resData[key].name,
                        resData[key].surname,
                        resData[key].email,
                        resData[key].phoneNumber
                    ));
                }
            }
            dispatch({ type: GET_ALL_BOSSES, bosses: loadedBosses });
        } catch (err) {
            throw err;
        }

    };
};

export const fetchPendingFriends = (bossId, userId) => {
    return async (dispatch, getState) => {
        const bssId = getState().auth.userId;
        try {
            const response = await fetch(`https://bigboss-3916b-default-rtdb.firebaseio.com/users.json`);

            if (!response.ok) {
                throw new Error('Hatalı işlem!');
            }

            const resData = await response.json();
            let loadedUsers;
            let uId;
            for (const key in resData) {
                if (resData[key].bossId === bossId && userId === bssId) {
                    uId = resData[key].bossId;
                    loadedUsers = new Boss(
                        key,
                        resData[key].bossId,
                        resData[key].imageUrl,
                        resData[key].name,
                        resData[key].surname,
                        resData[key].email,
                        resData[key].phoneNumber
                    );
                }
            }
            dispatch({ type: GET_PENDING_FRIENDS, uId: uId, pendingFriends: loadedUsers });
        } catch (err) {
            throw err;
        }

    };
};

import Personel from '../../models/personel';
import Firebase from '../../constants/Firebase.js';
export const DELETE_PERSONEL = 'DELETE_PERSONEL';
export const CREATE_PERSONEL = 'CREATE_PERSONEL';
export const UPDATE_PERSONEL = 'UPDATE_PERSONEL';
export const SET_PERSONEL = 'SET_PERSONEL';


export const deletePersonel = personelId => {
    return async (dispatch) => {
        await fetch(`https://bigboss-3916b-default-rtdb.firebaseio.com/personel/${personelId}.json`, {
            method: 'DELETE'
        });
        dispatch({
            type: DELETE_PERSONEL, pId: personelId
        });
    };
};

export const fetchPersonels = () => {
    return async (dispatch, getState) => {
        try {
            const userId = getState().auth.userId;
            const response = await fetch(`https://bigboss-3916b-default-rtdb.firebaseio.com/personel.json`);

            if (!response.ok) {
                throw new Error('Hatalı işlem!');
            }

            const resData = await response.json();
            const loadedPersonels = [];

            for (const key in resData) {
                if (resData[key].bossId === userId) {
                    loadedPersonels.push(new Personel(
                        key,
                        resData[key].bossId,
                        resData[key].name,
                        resData[key].surname,
                        resData[key].tcNo,
                        resData[key].gender,
                        resData[key].imageUrl,
                        resData[key].izin,
                        resData[key].avans,
                        resData[key].address,
                        resData[key].mail,
                        resData[key].telNo
                    ));
                }

            }
            dispatch({ type: SET_PERSONEL, personels: loadedPersonels });
        } catch (err) {
            throw err;
        }

    };
};

export const uploadPersonelAvatar = (uri) => {
    return async (dispatch, getState) => {
        try {
            const bossId = getState().auth.userId;
            const response = await fetch(uri);
            const blob = await response.blob();
            const tempId = new Date().toString();
            var ref = Firebase.storage().ref(`personel-profile/${bossId}`).child(tempId);
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



export const createPersonel = (imageUrl, name, surname, tcNo, gender,address, mail,telNo) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        let izin = '14';
        let avans = '0';
        const response = await fetch(`https://bigboss-3916b-default-rtdb.firebaseio.com/personel.json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bossId: userId,
                imageUrl,
                name,
                surname,
                tcNo,
                gender,
                izin,
                avans,
                address,
                mail,
                telNo
            })
        });

        dispatch({
            type: CREATE_PERSONEL,
            personelData: {
                imageUrl,
                name,
                surname,
                tcNo,
                gender,
                izin,
                avans,
                address,
                mail,
                telNo
            }
        });
    };
};

export const updatePersonel = (id, imageUrl, name, surname, tcNo, gender, izin, avans, address,mail,telNo) => {
    return async (dispatch) => {
        await fetch(`https://bigboss-3916b-default-rtdb.firebaseio.com/personel/${id}.json`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imageUrl,
                name,
                surname,
                tcNo,
                gender,
                izin,
                avans,
                address,
                mail,
                telNo
            })
        });

        dispatch({
            type: UPDATE_PERSONEL,
            pId: id,
            personelData: {
                imageUrl,
                name,
                surname,
                tcNo,
                gender,
                izin,
                avans,
                address,
                mail,
                telNo
            }
        });
    };
};
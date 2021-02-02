import Firebase from '../../constants/Firebase.js';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

export const authenticate = (userId,token) => {
  return {
    type: AUTHENTICATE, userId: userId, token: token
  };
};

export const signup = (email, password) => {
  return async dispatch => {
    const response = await Firebase.auth().createUserWithEmailAndPassword(email, password);
    const userId = response.user.uid;
    const userToken = Firebase.auth().currentUser.getIdToken();
    dispatch(authenticate(userId, userToken));
  };
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await Firebase.auth().signInWithEmailAndPassword(email, password);
    const userId = response.user.uid;
    const userToken = Firebase.auth().currentUser.getIdToken();
    dispatch(authenticate(userId, userToken));
  };
};


export const logout = () => {
  return {
    type: LOGOUT
  };
};


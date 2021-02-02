// @refresh reset

import React, { useState } from 'react';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import BigbossNavigator from './navigation/BigbossNavigator';
import personelReducer from './store/reducers/personel';
import userReducer from './store/reducers/user';
import workReducer from './store/reducers/work';
import authReducer from './store/reducers/auth';
import relationReducer from './store/reducers/relations';
import { LogBox } from 'react-native';
import _ from 'lodash';


const rootReducer = combineReducers({
  personels: personelReducer,
  bosses: userReducer,
  works: workReducer,
  auth: authReducer,
  relations: relationReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  LogBox.ignoreLogs(['Setting a timer']);
  const _console = _.clone(console);
  console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
      _console.warn(message);
    }
  };

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
      />
    );
  }
  return (
    <Provider store={store}>
      <BigbossNavigator />
    </Provider>

  );

}


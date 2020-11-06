import { combineReducers, createStore } from 'redux';

import web3Reducer from './reducers/web3';

const rootReducers = combineReducers({ web3: web3Reducer });
const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();
const store = createStore(rootReducers, devTools);

export default store;

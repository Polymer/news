import createStore from '../../node_modules/@0xcda7a/redux-es6/es/createStore.js';
import origCompose from '../../node_modules/@0xcda7a/redux-es6/es/compose.js';
import applyMiddleware from '../../node_modules/@0xcda7a/redux-es6/es/applyMiddleware.js';
import thunk from '../../node_modules/redux-thunk/es/index.js';

import reducer from './reducers/all.js';

const compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || origCompose;

export const store = createStore(
  // Do this if you don't have reducers
  // (state, action) => state,
  // compose(applyMiddleware())

  // Do this if you have reducers, but no async reducers
  // reducer,
  // compose(applyMiddleware())

  // Do this if you have async reducers
  reducer,
  compose(applyMiddleware(thunk))
);

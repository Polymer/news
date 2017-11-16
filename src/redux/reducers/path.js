import { PATH_CHANGED } from '../actions/app.js';

const path = (state = {}, action) => {
  switch (action.type) {
    case PATH_CHANGED:
      return {
        ...state,
        path: action.path
      };
    default:
      return state;
  }
}

export default path;

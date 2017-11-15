import { NETWORK_STATUS_CHANGED } from '../actions/app.js';

const app = (state = {online: true}, action) => {
  switch (action.type) {
    case NETWORK_STATUS_CHANGED:
      return {
        ...state,
        online: action.online
      };
    default:
      return state;
  }
}

export default app;

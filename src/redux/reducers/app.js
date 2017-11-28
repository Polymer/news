import { CHANGE_NETWORK_STATUS, OPEN_DRAWER, CLOSE_DRAWER } from '../actions/app.js';

const app = (state = {online: true, drawerOpened: false}, action) => {
  switch (action.type) {
    case CHANGE_NETWORK_STATUS:
      return {
        ...state,
        online: action.online
      };
    case OPEN_DRAWER:
      return {
        ...state,
        drawerOpened: true
      }
    case CLOSE_DRAWER:
      return {
        ...state,
        drawerOpened: false
      }
    default:
      return state;
  }
}

export default app;

import { NETWORK_STATUS_CHANGED, DRAWER_OPENED } from '../actions/app.js';

const app = (state = {online: true, drawerOpened: false}, action) => {
  switch (action.type) {
    case NETWORK_STATUS_CHANGED:
      return {
        ...state,
        online: action.online
      };
    case DRAWER_OPENED:
      return {
        ...state,
        drawerOpened: action.opened
      }
    default:
      return state;
  }
}

export default app;

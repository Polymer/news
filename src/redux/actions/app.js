export const CHANGE_NETWORK_STATUS = 'CHANGE_NETWORK_STATUS';
export const OPEN_DRAWER = 'OPEN_DRAWER';
export const CLOSE_DRAWER = 'CLOSE_DRAWER';
export const NAVIGATE = 'NAVIGATE';

export const networkStatusChanged = (online) => (dispatch) => {
  dispatch({
    type: CHANGE_NETWORK_STATUS,
    online
  });
};

export const drawerOpened = () => (dispatch) => {
  dispatch({
    type: OPEN_DRAWER
  });
};

export const drawerClosed = () => (dispatch) => {
  dispatch({
    type: CLOSE_DRAWER
  });
};

export const pathChanged = (path) => (dispatch, getState) => {
  dispatch({
    type: NAVIGATE,
    path
  });
};

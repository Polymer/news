export const NETWORK_STATUS_CHANGED = 'NETWORK_STATUS_CHANGED';
export const DRAWER_OPENED = 'DRAWER_OPENED';
export const DRAWER_CLOSED = 'DRAWER_CLOSED';
export const PATH_CHANGED = 'PATH_CHANGED';

export const networkStatusChanged = (online) => (dispatch) => {
  dispatch({
    type: NETWORK_STATUS_CHANGED,
    online
  });
};

export const drawerOpened = () => (dispatch) => {
  dispatch({
    type: DRAWER_OPENED
  });
};

export const drawerClosed = () => (dispatch) => {
  dispatch({
    type: DRAWER_CLOSED
  });
};

export const pathChanged = (path) => (dispatch, getState) => {
  dispatch({
    type: PATH_CHANGED,
    path
  });
};

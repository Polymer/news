export const NETWORK_STATUS_CHANGED = 'NETWORK_STATUS_CHANGED';
export const DRAWER_OPENED = 'DRAWER_OPENED';

export const networkStatusChanged = (online) => (dispatch) => {
  dispatch({
    type: NETWORK_STATUS_CHANGED,
    online
  });
};

export const drawerOpened = (opened) => (dispatch) => {
  dispatch({
    type: DRAWER_OPENED,
    opened
  });
};

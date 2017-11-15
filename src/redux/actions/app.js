export const NETWORK_STATUS_CHANGED = 'NETWORK_STATUS_CHANGED';

export const networkStatusChanged = (online) => (dispatch, getState) => {
  dispatch({
    type: NETWORK_STATUS_CHANGED,
    online
  });
};

export const CHANGE_NETWORK_STATUS = 'CHANGE_NETWORK_STATUS';
export const OPEN_DRAWER = 'OPEN_DRAWER';
export const CLOSE_DRAWER = 'CLOSE_DRAWER';
export const NAVIGATE = 'NAVIGATE';

export const networkStatusChanged = (online) =>  {
  return {
    type: CHANGE_NETWORK_STATUS,
    online
  };
};

export const drawerOpened = () => {
  return {
    type: OPEN_DRAWER
  };
};

export const drawerClosed = () => {
  return {
    type: CLOSE_DRAWER
  };
};

export const pathChanged = (path) => {
  return {
    type: NAVIGATE,
    path
  };
};

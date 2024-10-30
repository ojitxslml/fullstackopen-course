import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification: (state, action) => action.payload.message,
    clearNotification: () => '',
  },
});

export const { clearNotification } = notificationSlice.actions;

export const setNotificationWithTimeout = (message, time) => {
  return async (dispatch) => {
    dispatch(setNotification({ message }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, time * 1000);
  };
};

export const { setNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

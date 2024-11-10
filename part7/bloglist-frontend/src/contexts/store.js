import { configureStore } from "@reduxjs/toolkit";
import blogsReducer from "./blogsSlice";
import notificationReducer from "./notificationSlice";
import userReducer from "./userSlice";
import usersListSlice from "./usersListSlice"
const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    notification: notificationReducer,
    user: userReducer,
    users: usersListSlice
  },
});

export default store;

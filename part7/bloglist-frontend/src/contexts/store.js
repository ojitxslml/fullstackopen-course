import { configureStore } from "@reduxjs/toolkit";
import blogsReducer from "./blogsSlice";
import notificationReducer from "./notificationSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    notification: notificationReducer,
    user: userReducer,
  },
});

export default store;

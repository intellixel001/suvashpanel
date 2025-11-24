"use client";
import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./features/userSlice";
import taskReducer from "./features/taskSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: taskReducer,
  },
});

export default store;

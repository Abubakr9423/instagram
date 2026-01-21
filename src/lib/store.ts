import { configureStore } from "@reduxjs/toolkit";
import home from "./features/home/homeslice";
import create from "./features/CreatePost/postSlice";
export const store = configureStore({
  reducer: {
    home: home,
    post: create,
},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

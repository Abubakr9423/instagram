import { configureStore } from "@reduxjs/toolkit";
import home from "./features/home/homeslice";
import messagesReducer from "./features/messages/messagesslice";
import post from "./features/CreatePost/postSlice";

export const store = configureStore({
  reducer: {
    home: home,
    messagesApi: messagesReducer,
    post: post,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import home from "./features/home/homeslice";
import messagesReducer from "./features/messages/messagesslice";
import reelsslice from "./features/reels/reelsslice";
import postsReducer from "./features/explore/api"; // <- твой slice

export const store = configureStore({
  reducer: {
    home: home,
    messagesApi: messagesReducer,
    reels: reelsslice,
    posts: postsReducer, // <- ключ posts совпадает с useSelecto
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

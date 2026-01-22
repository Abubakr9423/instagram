import { configureStore } from "@reduxjs/toolkit";
import home from "./features/home/homeslice";
import messagesReducer from "./features/messages/messagesslice";
import reelsslice from "./features/reels/reelsslice";
import searchslice from "./features/search/searchslice";
import postsReducer from "./features/explore/api";

export const store = configureStore({
  reducer: {
    home: home,
    messagesApi: messagesReducer,
    reels: reelsslice,
    posts: postsReducer,
    search: searchslice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

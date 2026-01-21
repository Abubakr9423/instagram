import { configureStore } from "@reduxjs/toolkit";
import home from "./features/home/homeslice";
import messagesReducer from "./features/messages/messagesslice";
import reelsslice from "./features/reels/reelsslice";

export const store = configureStore({
  reducer: {
    counter: home,
    messagesApi: messagesReducer,
    reels: reelsslice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

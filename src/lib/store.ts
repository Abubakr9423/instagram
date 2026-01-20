import { configureStore } from "@reduxjs/toolkit";
import reelsReducer from "./features/reels/reelsslice"; 
import homeReducer from "./features/home/homeslice"; 

export const store = configureStore({
  reducer: {
    counter: homeReducer,
    reels: reelsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit'
import home from "./features/home/homeslice"
import post from "./features/CreatePost/postSlice"

export const store = configureStore({
    reducer: {
        counter: home,
        post: post
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
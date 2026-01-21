import { configureStore } from '@reduxjs/toolkit'
import home from "./features/home/homeslice"

export const store = configureStore({
    reducer: {
        counter: home
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
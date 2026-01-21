import { configureStore } from '@reduxjs/toolkit'
import home from './features/home/homeslice'
import messagesReducer from './features/messages/messagesslice'

export const store = configureStore({
  reducer: {
    home: home,
    messagesApi: messagesReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

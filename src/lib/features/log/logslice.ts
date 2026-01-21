import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type CounterState = {
}

const initialState: CounterState = {
}

const counterSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {}
})

export const { } = counterSlice.actions
export default counterSlice.reducer
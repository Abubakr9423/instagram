import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { searchuser } from './searchapi'

export interface CounterState {
    data: []
}

const initialState: CounterState = {
    data: []
}

export const counterSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(searchuser.fulfilled, (state, action) => {
                state.data = action.payload
            })
    }

})

// Action creators are generated for each case reducer function
export const { } = counterSlice.actions

export default counterSlice.reducer
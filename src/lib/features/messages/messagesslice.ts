import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Getchats } from './ApiMessages'

type CounterState = {
    data: any[],
    loading: boolean,
    error: string | null
}
const initialState: CounterState = {
    data: [],
    loading: false,
    error: null
}

export const createApiMessages = createSlice({
    name: 'messagesApi',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(Getchats.pending, (state) => {
                state.loading = true
            })
            .addCase(Getchats.fulfilled, (state, action: PayloadAction<any[]>) => {
                state.loading = false
                state.data = action.payload
            })
            .addCase(Getchats.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })
    }
})

export const { } = createApiMessages.actions
export default createApiMessages.reducer
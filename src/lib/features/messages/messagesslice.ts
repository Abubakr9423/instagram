import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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

const createApiMessages = createSlice({
    name: 'MessagesApi',
    initialState,
    reducers: {},
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(getchats.pending, (state) => {
    //             state.loading = true
    //         })
    //         .addCase(getchats.fulfilled, (state, action: PayloadAction<any[]>) => {
    //             state.loading = false
    //             state.data = action.payload
    //         })
    //         .addCase(getchats.rejected, (state, action) => {
    //             state.loading = false
    //             state.error = action.payload as string
    //         })
    // }
})

export const { GetUsersMessages } = createApiMessages.actions
export default createApiMessages.reducer
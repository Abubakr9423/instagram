import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getChatById, Getchats } from './ApiMessages'

type CounterState = {
    chats: any[],
    messages: any[],
    selectedChatId: string | null,
    loading: boolean,
    error: string | null
}
const initialState: CounterState = {
    chats: [],
    messages: [],
    selectedChatId: null,
    loading: false,
    error: null
}

export const createApiMessages = createSlice({
    name: 'messagesApi',
    initialState,
    reducers: {
        setSelectedChat: (state, action) => {
            state.selectedChatId = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(Getchats.pending, (state) => {
                state.loading = true
            })
            .addCase(Getchats.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.chats = action.payload?.data || action.payload || [];
            })
            .addCase(Getchats.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as string
            })

            .addCase(getChatById.pending, (state) => {
                state.loading = true;
            })
            .addCase(getChatById.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.messages = action.payload?.data
            })
            .addCase(getChatById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error";
            })
    }
})

export const { setSelectedChat } = createApiMessages.actions
export default createApiMessages.reducer
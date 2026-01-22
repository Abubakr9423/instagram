import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CreateChat, DeleteChatById, getChatById, Getchats, GetUsers } from './ApiMessages'

type CounterState = {
    chats: any[],
    messages: any[],
    Users: any[],
    selectedChatId: string | null,
    loading: boolean,
    error: string | null
}
const initialState: CounterState = {
    chats: [],
    Users: [],
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
            .addCase(DeleteChatById.pending, (state) => {
                state.loading = true;
            })
            .addCase(DeleteChatById.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.chats = action.payload?.data
            })
            .addCase(GetUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error";
            })
            .addCase(GetUsers.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.Users = action.payload?.data
            })
            .addCase(CreateChat.pending, (state) => {
                state.loading = true;
            })
            .addCase(CreateChat.fulfilled, (state, action) => {
                state.loading = false;
            })
    }
})

export const { setSelectedChat } = createApiMessages.actions
export default createApiMessages.reducer
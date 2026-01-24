import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CreateChat, DeleteChatById, DeleteMessagesById, getChatById, Getchats, GetMyProfile, GetUsers, SendMessage } from './ApiMessages'

interface Chat {
    chatId: number | string;
    receiveUserId: number | string;
    sendUserName: string;
    receiveUserName: string;
    receiveUserImage: string;
    sendUserImage: string;
}

type CounterState = {
    chats: Chat[],
    messages: any[],
    Users: any[],
    myprofile: MyProfileType | null,
    selectedChatId: string | null,
    loading: boolean,
    error: string | null
}

interface MyProfileType {
    about: string;
    dateUpdated: string;
    dob: string;
    firstName: string;
    gender: string;
    image: string;
    lastName: string;
    locationId: number;
    occupation: string;
    postCount: number;
    subscribersCount: number;
    subscriptionsCount: number;
    userName: string;
}

const initialState: CounterState = {
    chats: [],
    Users: [],
    messages: [],
    myprofile: null,
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
                if (state.messages.length === 0) state.loading = true;
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
            .addCase(SendMessage.pending, (state) => {
                state.error = null;
            })
            .addCase(SendMessage.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(GetMyProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetMyProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.myprofile = action.payload?.data || action.payload;
            })
            .addCase(GetMyProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error fetching profile";
            })
            .addCase(DeleteMessagesById.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.messages = action.payload?.data
            })
            .addCase(DeleteMessagesById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Error fetching profile";
            });
    }
})

export const { setSelectedChat } = createApiMessages.actions
export default createApiMessages.reducer
import { axiosRequest, SaveToken } from "@/src/utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit"

export const Getchats = createAsyncThunk("auth/Getchats", async () => {
    try {
        const response = await axiosRequest.get("/Chat/get-chats");
        return response.data;
    } catch (error: any) {
        console.error(error);
    }
}
);
export const getChatById = createAsyncThunk("auth/getChatById", async (chatId) => {
    try {
        const response = await axiosRequest.get(`/Chat/get-chat-by-id?chatId=${chatId}`);
        return response.data;
    } catch (error: any) {
        console.error(error);
    }
}
);
export const DeleteChatById = createAsyncThunk("auth/DeleteChatById", async (chatId, { dispatch }) => {
    try {
        await axiosRequest.delete(`/Chat/delete-chat?chatId=${chatId}`);
        dispatch(Getchats())
        return chatId
    } catch (error: any) {
        console.error(error);
    }
}
);
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
export const GetUsers = createAsyncThunk("auth/GetUsers", async (searchTerm: string = "") => {
    try {
        const response = await axiosRequest.get(`/User/get-users?userName=${searchTerm}`);
        return response.data;
    } catch (error: any) {
        console.error(error);
    }
});
export const CreateChat = createAsyncThunk("auth/CreateChat", async (UserId: string = "") => {
    try {
        const response = await axiosRequest.post(`/Chat/create-chat?receiverUserId=${UserId}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
});
export const SendMessage = createAsyncThunk("messages/SendMessage", async ({ chatId, message, file }: { chatId: string; message: string; file?: File }, { dispatch }) => {
    try {
        const formData = new FormData();
        formData.append('ChatId', chatId);
        formData.append('MessageText', message);
        if (file) {
            formData.append('File', file);
        }
        const response = await axiosRequest.put(`/Chat/send-message`, formData);
        dispatch(getChatById(chatId));
        return response.data;
    } catch (error: any) {
        console.error("Error sending message:", error.response?.data || error.message);
        throw error;
    }
}
);

export const GetMyProfile = createAsyncThunk("auth/GetMyProfile", async () => {
    const response = await axiosRequest.get("/UserProfile/get-my-profile");
    return response.data;
});
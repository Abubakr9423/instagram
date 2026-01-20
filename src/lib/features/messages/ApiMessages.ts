import { axiosRequest, SaveToken } from "@/src/utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit"

export const Getchats = createAsyncThunk("auth/loginUser", async () => {
    try {
        const response = await axiosRequest.get("/Chat/get-chats");
        const token = response.data?.token || response.data;
        SaveToken(token);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
);
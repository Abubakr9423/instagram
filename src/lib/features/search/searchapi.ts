import { axiosRequest, SaveToken } from "@/src/utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const searchuser = createAsyncThunk(
    "search/searchuser",
    async (name: string, { rejectWithValue }) => {
        try {
            const response = await axiosRequest.get(`/User/get-users?UserName=${name}`);

            if (response.data?.token) {
                SaveToken(response.data.token);
            }

            return response.data;
        } catch (error: any) {
            console.error(error);
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);
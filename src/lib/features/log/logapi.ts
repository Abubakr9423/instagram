import { axiosRequest, SaveToken } from "@/src/utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (values, { rejectWithValue }) => {
        try {
            const response = await axiosRequest.post("/Account/login", values);

            const token = response.data?.data;
            if (token) {
                SaveToken(token); 
            }

            return response.data;
        } catch (error) {
            console.error(error);
            return rejectWithValue(error);
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (values, { rejectWithValue }) => {
        try {
            const response = await axiosRequest.post("/api/auth/register", values);

            const token = response.data?.data;
            if (token) {
                SaveToken(token);
            }

            return response.data;
        } catch (error) {
            console.error(error);
            return rejectWithValue(error);
        }
    }
);
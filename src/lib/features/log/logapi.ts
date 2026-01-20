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
        } catch (error: any) {
            console.error(error);

            const message =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Login failed";

            return rejectWithValue(message);
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (values, { rejectWithValue }) => {
        try {
            const response = await axiosRequest.post("/Account/register", values);

            const token = response.data?.data;
            if (token) {
                SaveToken(token);
            }

            return response.data;
        } catch (error: any) {
            console.error(error);

            const message =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "Registration failed";

            return rejectWithValue(message);
        }
    }
);
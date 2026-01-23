import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "@/src/utils/axios";

export const getReels = createAsyncThunk<any[], void, { rejectValue: string }>(
  "reels/getReels",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get(
        "/Post/get-reels?PageNumber=1&PageSize=10",
      );

      return data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch reels",
      );
    }
  },
);
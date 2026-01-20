import { axiosRequest } from "@/src/utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getReels = createAsyncThunk<string, { rejectValue: string }>(
  "reels/getReels",
  async () => {
    try {
      const {data} = await axiosRequest.get("/Post/get-reels")
      return data;
    } catch (error) {
      console.error(error);
    }
  })
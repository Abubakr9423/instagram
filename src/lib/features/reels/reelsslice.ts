// reelsslice.ts
import { createSlice } from "@reduxjs/toolkit";
import { getReels, Reel } from "./reelsapi";

type ReelsState = {
  reels: Reel[];
  loading: boolean;
  error: string | null;
};

const initialState: ReelsState = {
  reels: [],
  loading: false,
  error: null,
};

const reelsSlice = createSlice({
  name: "reels",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReels.fulfilled, (state, action) => {
        state.loading = false;
        state.reels = action.payload;
      })
      .addCase(getReels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default reelsSlice.reducer;

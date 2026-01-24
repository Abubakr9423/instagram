import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getReels } from "./reelsapi";
import { axiosRequest } from "@/src/utils/axios";

interface ReelsState {
  reels: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ReelsState = {
  reels: [],
  loading: false,
  error: null,
};

export const saveposts = createAsyncThunk(
  'home/saveposts',
  async (postId: number) => {
    await axiosRequest.post('/Post/add-post-favorite', { postId })
    return postId
  }
)

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
      .addCase(saveposts.fulfilled, (state, action) => {
  const post = state.reels.find(p => p.postId === action.payload)
  if (post) {
    post.isFavorite = !post.isFavorite
  }
})
      .addCase(getReels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export default reelsSlice.reducer;

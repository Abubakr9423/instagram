import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "@/src/utils/axios";
import { likePostById } from "./thunks"; // make sure this file exists

export interface Post {
  _id?: string;
  postId?: number;
  images?: string[];
  mediaUrl?: string;
  caption?: string;
  likesCount?: number;
  postLike?: boolean;
  commentsCount?: number;
}

export const fetchPosts = createAsyncThunk<Post[]>(
  "posts/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosRequest.get("/Post/get-posts");
      console.log("Fetched posts:", res.data.data);
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // likePostById
      .addCase(likePostById.fulfilled, (state, action) => {
        const post = state.posts.find(
          (p) => p.postId === action.payload.postId,
        );
        if (post) {
          post.postLike = true;
          post.likesCount = action.payload.postLikeCount;
        }
      });
  },
});

export default postsSlice.reducer;

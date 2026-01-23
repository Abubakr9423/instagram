import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosRequest } from "@/src/utils/axios";

interface LikePayload {
  postId: number;
}

interface LikeResponse {
  postId: number;
  postLikeCount: number;
}

export const likePostById = createAsyncThunk<
  LikeResponse,
  LikePayload,
  { rejectValue: string }
>("posts/likePostById", async ({ postId }, { rejectWithValue }) => {
  try {
    const res = await axiosRequest.post(`/Post/like-post?postId=${postId}`, {
      id: postId,
    });
    return { postId, postLikeCount: res.data.likesCount };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || err.message || "Ошибка сервера",
    );
  }
});

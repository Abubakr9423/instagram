import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosRequest } from "@/src/utils/axios";  

 interface ServerResponse {
  data: number; // ID поста (например, 353)
  errors: string[];
  statusCode: number;
}

export interface EditSettings {
  filter: string;
  adjustments: {
    brightness: number;
    contrast: number;
    saturation: number;
  };
  trim: {
    start: number;
    end: number;
  };
  cover: string | number;
  isMuted: boolean;
}

interface PostState {
  images: string[]; 
  caption: string;
  loading: boolean;
  error: string | null;
  editSettings: EditSettings; 
}

const initialState: PostState = {
  images: [],
  caption: '',
  loading: false,
  error: null,
  editSettings: {
    filter: 'original',
    adjustments: { brightness: 0, contrast: 0, saturation: 0 },
    trim: { start: 0, end: 100 },
    cover: 0,
    isMuted: false
  },
};

export const addPostToServer = createAsyncThunk(
  "post/addPostToServer",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosRequest.post<ServerResponse>("/Post/add-post", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
       return response.data.data; 
    } catch (error: any) {
       const serverData = error.response?.data;
      const message = serverData?.errors?.[0] || serverData?.message || "Ошибка при публикации";
      return rejectWithValue(message);
    }
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    addImage: (state, action: PayloadAction<string>) => {
      state.images.push(action.payload);
    },
    removeImage: (state, action: PayloadAction<number>) => {
      state.images = state.images.filter((_, index) => index !== action.payload);
    },
    setCaption: (state, action: PayloadAction<string>) => {
      state.caption = action.payload;
    },
    setEditSettings: (state, action: PayloadAction<EditSettings>) => {
      state.editSettings = action.payload;
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.editSettings.filter = action.payload;
    },
    updateAdjustment: (state, action: PayloadAction<{ key: keyof EditSettings['adjustments'], value: number }>) => {
      const { key, value } = action.payload;
      state.editSettings.adjustments[key] = value;
    },
    setTrim: (state, action: PayloadAction<{ start?: number, end?: number }>) => {
      state.editSettings.trim = { ...state.editSettings.trim, ...action.payload };
    },
    setCover: (state, action: PayloadAction<string | number>) => {
      state.editSettings.cover = action.payload;
    },
    toggleMute: (state) => {
      state.editSettings.isMuted = !state.editSettings.isMuted;
    },
    resetPost: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPostToServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPostToServer.fulfilled, (state) => {
         return initialState;
      })
      .addCase(addPostToServer.rejected, (state, action) => {
        state.loading = false;
         state.error = action.payload as string;
      });
  },
});

export const { 
  addImage, removeImage, setCaption, 
  setFilter, updateAdjustment, setTrim, 
  toggleMute, setCover, resetPost,
  setEditSettings 
} = postSlice.actions;

export default postSlice.reducer;
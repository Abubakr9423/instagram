import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PostState {
  images: string[]; 
  caption: string;
}

const initialState: PostState = {
  images: [],
  caption: '',
};

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
    resetPost: () => initialState,
  },
});

export const { addImage, removeImage, setCaption, resetPost } = postSlice.actions;
export default postSlice.reducer;
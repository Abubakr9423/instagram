import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { axiosRequest, SaveToken } from '@/src/utils/axios'

type HomeState = {
  data: any[]
  loading: boolean
}

const initialState: HomeState = {
  data: [],
  loading: false
}

export const getProduct = createAsyncThunk<any[]>(
  'home/getProduct',
  async () => {
    const res = await axiosRequest.get(`Post/get-reels`)
    return res.data.data;
  }
)

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getProduct.pending, state => {
        state.loading = true
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(getProduct.rejected, state => {
        state.loading = false
      })
  }
})

export default homeSlice.reducer

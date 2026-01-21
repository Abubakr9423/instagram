import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { axiosRequest } from '@/src/utils/axios'

type CounterState = {
  value: number
  data: any[]
  loading: boolean
}

const initialState: CounterState = {
  value: 0,
  data: [],
  loading: false
}

export const getProduct = createAsyncThunk(
  'counter/getProduct',
  async () => {
    try {
      const res = await axiosRequest.get('https://instagram-api.softclub.tj/Post/get-reels')
      return res.data.data
    } catch (error) {
      console.error(error);
    }
  }
)

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: state => {
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    }
  },
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

export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer

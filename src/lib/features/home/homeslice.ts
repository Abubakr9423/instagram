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
  'home/getProduct',
  async () => {
    try {
      const {data} = await axiosRequest.get('Post/get-reels?PageNumber=1&PageSize=20')
      return data.data
      
    } catch (error) {
      console.error(error);
    }
  }
)

const home = createSlice({
  name: 'home',
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

export const { increment, decrement, incrementByAmount } = home.actions
export default home.reducer

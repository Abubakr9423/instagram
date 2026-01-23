import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { axiosRequest } from '@/src/utils/axios'

type CounterState = {
  value: number
  data: any[]
  post: any[]
  follow: any[]
  loading: boolean
}

const initialState: CounterState = {
  value: 0,
  data: [],
  post: [],
  follow: [],
  loading: false
}

export const getProduct = createAsyncThunk(
  'home/getProduct',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get('Post/get-reels?PageNumber=1&PageSize=20')
      return data.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getPost = createAsyncThunk(
  'home/getPost',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosRequest.get('/Post/get-posts')
      return data.data
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const postLike = createAsyncThunk(
  'home/postLike',
  async (id: number, { rejectWithValue }) => {
    try {
      await axiosRequest.post(`/Post/like-post?postId=${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const postComment = createAsyncThunk(
  'home/postComment',
  async (
    { id, comment }: { id: number; comment: string },
    { rejectWithValue }
  ) => {
    try {
      await axiosRequest.post('/Post/add-comment', {
        postId: id,
        comment
      })
      return { id, comment }
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)

export const getFollowing = createAsyncThunk(
  'home/getFollowing',
  async () => {
    try {
      const { data } = await axiosRequest.get(
        `/FollowingRelationShip/get-subscriptions?UserId=6e7757e3-1ca9-40ea-9cb4-c9d9feb62493`
      )
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
        state.data = action.payload || []
      })
      .addCase(getProduct.rejected, state => {
        state.loading = false
      })

      .addCase(getPost.pending, state => {
        state.loading = true
      })
      .addCase(getPost.fulfilled, (state, action) => {
        state.loading = false
        state.post = action.payload || []
      })
      .addCase(getPost.rejected, state => {
        state.loading = false
      })

      .addCase(postLike.fulfilled, (state, action) => {
        const id = action.payload
        const post = state.data.find(p => p.postId === id)
        if (post) {
          post.postLike = !post.postLike
          post.postLikeCount += post.postLike ? 1 : -1
        }
      })

      .addCase(postComment.fulfilled, (state, action) => {
        if (!action.payload) return
        const { id, comment } = action.payload
        const post = state.data.find(p => p.postId === id)
        if (post) {
          if (!post.comments) post.comments = []
          post.comments.push({
            postCommentId: Date.now(),
            userName: 'You',
            
            userImage: null,
            comment
          })
          post.commentCount += 1
        }
      })
  }
})

export const { increment, decrement, incrementByAmount } = home.actions
export default home.reducer

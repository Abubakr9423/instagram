export const getReels = createAsyncThunk<Reel[], string, { rejectValue: string }>(
  "reels/getReels",
  async ({ rejectWithValue }) => {
    try {
      const {data} = await axios
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to fetch reels");
    }
  }
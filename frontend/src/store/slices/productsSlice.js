import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/client.js";

export const fetchProducts = createAsyncThunk("products/fetch", async (category, thunkAPI) => {
  try {
    const res = await api.get("/products", { params: category ? { category } : {} });
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue("Failed to load products");
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], status: "idle", error: null, category: "" },
  reducers: {
    setCategory(state, action) {
      state.category = action.payload;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.status = "succeeded"; s.items = a.payload; })
      .addCase(fetchProducts.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; });
  }
});

export const { setCategory } = productsSlice.actions;
export default productsSlice.reducer;

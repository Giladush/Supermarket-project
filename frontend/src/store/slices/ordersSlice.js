import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/client.js";

export const createOrder = createAsyncThunk("orders/create", async (items, thunkAPI) => {
  try {
    const res = await api.post("/orders", { items });
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e?.response?.data?.message || "Checkout failed");
  }
});

export const fetchMyOrders = createAsyncThunk("orders/me", async (_, thunkAPI) => {
  try {
    const res = await api.get("/orders/me");
    return res.data;
  } catch (e) {
    return thunkAPI.rejectWithValue("Failed to load orders");
  }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState: { list: [], status: "idle", error: null, lastOrderId: null },
  reducers: {
    clearLastOrder(state) { state.lastOrderId = null; }
  },
  extraReducers(builder) {
    builder
      .addCase(createOrder.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(createOrder.fulfilled, (s, a) => { s.status = "succeeded"; s.lastOrderId = a.payload.orderId; })
      .addCase(createOrder.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; })
      .addCase(fetchMyOrders.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(fetchMyOrders.fulfilled, (s, a) => { s.status = "succeeded"; s.list = a.payload; })
      .addCase(fetchMyOrders.rejected, (s, a) => { s.status = "failed"; s.error = a.payload; });
  }
});

export const { clearLastOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

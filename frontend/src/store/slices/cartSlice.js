import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] },
  reducers: {
    addToCart(state, action) {
      const p = action.payload;
      const existing = state.items.find(i => i.productId === p.productId);
      if (existing) existing.quantity += 1;
      else state.items.push({ ...p, quantity: 1 });
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(i => i.productId !== action.payload);
    },
    changeQty(state, action) {
      const { productId, quantity } = action.payload;
      const it = state.items.find(i => i.productId === productId);
      if (!it) return;
      it.quantity = Math.max(1, Number(quantity) || 1);
    },
    clearCart(state) {
      state.items = [];
    }
  }
});

export const { addToCart, removeFromCart, changeQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

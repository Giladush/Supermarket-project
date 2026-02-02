import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeQty, removeFromCart, clearCart } from "../store/slices/cartSlice.js";
import { createOrder, clearLastOrder } from "../store/slices/ordersSlice.js";
import { Link } from "react-router-dom";

export default function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector(s => s.cart.items);
  const token = useSelector(s => s.auth.token);
  const { status, error, lastOrderId } = useSelector(s => s.orders);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  async function checkout() {
    if (!token) return;
    const res = await dispatch(createOrder(cart.map(i => ({ productId: i.productId, quantity: i.quantity }))));
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(clearCart());
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h2>Cart</h2>

        {lastOrderId && (
          <div className="card" style={{marginBottom:12, background:"#eef2ff"}}>
            Order created ✅ (ID: {lastOrderId}) — <Link to="/orders" onClick={()=>dispatch(clearLastOrder())}>see history</Link>
          </div>
        )}

        {cart.length === 0 ? (
          <div>Cart is empty.</div>
        ) : (
          <>
            {cart.map(i => (
              <div key={i.productId} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid #eee"}}>
                <div>
                  <b>{i.name}</b>
                  <div style={{opacity:0.7}}>₪{i.price}</div>
                </div>
                <div style={{display:"flex", gap:8, alignItems:"center"}}>
                  <input
                    className="input"
                    style={{width:80}}
                    type="number"
                    min="1"
                    value={i.quantity}
                    onChange={(e)=>dispatch(changeQty({ productId: i.productId, quantity: e.target.value }))}
                  />
                  <button className="btn btnGhost" onClick={()=>dispatch(removeFromCart(i.productId))}>Remove</button>
                </div>
              </div>
            ))}

            <div style={{display:"flex", justifyContent:"space-between", marginTop:12, alignItems:"center"}}>
              <b>Total: ₪{total.toFixed(2)}</b>
              {!token ? (
                <div>
                  To checkout you must <Link to="/login">login</Link>.
                </div>
              ) : (
                <button className="btn btnPrimary" onClick={checkout} disabled={status==="loading"}>
                  {status==="loading" ? "..." : "Checkout"}
                </button>
              )}
            </div>

            {error && <div style={{color:"crimson", marginTop:10}}>{error}</div>}
          </>
        )}
      </div>
    </div>
  );
}

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../store/slices/ordersSlice.js";
import { Link } from "react-router-dom";

export default function Orders() {
  const dispatch = useDispatch();
  const token = useSelector(s => s.auth.token);
  const { list, status, error } = useSelector(s => s.orders);

  useEffect(() => {
    if (token) dispatch(fetchMyOrders());
  }, [dispatch, token]);

  if (!token) {
    return (
      <div className="container">
        <div className="card">
          You must <Link to="/login">login</Link> to view order history.
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h2>My Orders (BONUS)</h2>
        {status === "loading" && <div>Loading...</div>}
        {error && <div style={{color:"crimson"}}>{error}</div>}
        {list.length === 0 ? (
          <div>No orders yet.</div>
        ) : (
          list.map(o => (
            <div key={o.id} className="card" style={{marginTop:12}}>
              <div style={{display:"flex", justifyContent:"space-between"}}>
                <b>Order #{o.id}</b>
                <b>₪{o.total.toFixed(2)}</b>
              </div>
              <div style={{opacity:0.7, marginTop:6}}>{new Date(o.createdAt).toLocaleString()}</div>
              <div style={{marginTop:10}}>
                {o.items.map((it, idx) => (
                  <div key={idx} style={{display:"flex", justifyContent:"space-between"}}>
                    <span>{it.name} × {it.quantity}</span>
                    <span>₪{(it.price * it.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

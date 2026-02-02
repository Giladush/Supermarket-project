import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice.js";

export default function NavBar() {
  const dispatch = useDispatch();
  const { token } = useSelector(s => s.auth);
  const cartCount = useSelector(s => s.cart.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <div className="nav">
      <div style={{display:"flex", gap:10, alignItems:"center"}}>
        <Link to="/" style={{textDecoration:"none"}}><b>Supermarket</b></Link>
        <span className="badge">Cart: {cartCount}</span>
      </div>

      <div style={{display:"flex", gap:10, alignItems:"center"}}>
        <Link to="/cart">Cart</Link>
        {token && <Link to="/orders">My Orders</Link>}
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button className="btn btnGhost" onClick={() => dispatch(logout())}>Logout</button>
        )}
      </div>
    </div>
  );
}

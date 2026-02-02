import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../store/slices/authSlice.js";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { status, error } = useSelector(s => s.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const res = await dispatch(loginUser({ email, password }));
    if (res.meta.requestStatus === "fulfilled") nav("/");
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth:420}}>
        <h2>Login</h2>
        <form onSubmit={onSubmit}>
          <div style={{marginBottom:10}}>
            <input className="input" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div style={{marginBottom:10}}>
            <input className="input" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button className="btn btnPrimary" disabled={status==="loading"}>
            {status==="loading" ? "..." : "Login"}
          </button>
          {error && <div style={{color:"crimson", marginTop:10}}>{error}</div>}
        </form>
      </div>
    </div>
  );
}

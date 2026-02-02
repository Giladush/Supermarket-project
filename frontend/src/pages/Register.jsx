import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/slices/authSlice.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { status, error } = useSelector(s => s.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    const res = await dispatch(registerUser({ email, password }));
    if (res.meta.requestStatus === "fulfilled") nav("/login");
  }

  return (
    <div className="container">
      <div className="card" style={{maxWidth:420}}>
        <h2>Register</h2>
        <form onSubmit={onSubmit}>
          <div style={{marginBottom:10}}>
            <input className="input" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div style={{marginBottom:10}}>
            <input className="input" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button className="btn btnPrimary" disabled={status==="loading"}>
            {status==="loading" ? "..." : "Create account"}
          </button>
          {error && <div style={{color:"crimson", marginTop:10}}>{error}</div>}
        </form>
      </div>
    </div>
  );
}

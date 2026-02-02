import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setCategory } from "../store/slices/productsSlice.js";
import { addToCart } from "../store/slices/cartSlice.js";

const categories = ["", "milk", "meat", "fruits", "vegetables"];

export default function Home() {
  const dispatch = useDispatch();
  const { items, status, category } = useSelector(s => s.products);

  useEffect(() => {
    dispatch(fetchProducts(category || ""));
  }, [dispatch, category]);

  return (
    <div className="container">
      <div className="card" style={{marginBottom:12}}>
        <div style={{display:"flex", gap:10, alignItems:"center", flexWrap:"wrap"}}>
          <b>Categories:</b>
          {categories.map(c => (
            <button
              key={c || "all"}
              className={"btn " + (category === c ? "btnPrimary" : "btnGhost")}
              onClick={() => dispatch(setCategory(c))}
            >
              {c || "all"}
            </button>
          ))}
        </div>
      </div>

      <div className="row">
        {status === "loading" && <div className="card">Loading...</div>}
        {items.map(p => (
          
          <div className="card" key={p.id} style={{width: "calc(33% - 12px)", minWidth: 240}}>
            <img
                src={p.imageUrl}
                alt={p.name}
                style={{
                width: "100%",
                height: 160,
                objectFit: "cover",
                borderRadius: 10,
                marginBottom: 10
                }}
            />

            <div style={{display:"flex", justifyContent:"space-between"}}>
              <b>{p.name}</b>
              <span>₪{p.price}</span>
            </div>
            <div style={{opacity:0.7, marginTop:6}}>category: {p.category}</div>
            <div style={{marginTop:10}}>
              <button
                className="btn btnPrimary"
                onClick={() => dispatch(addToCart({ productId: p.id, name: p.name, price: p.price }))}
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

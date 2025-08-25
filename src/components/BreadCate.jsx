import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "./cartContact";

const BreadMenu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext); // ✅ ใช้ useContext

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3001/products?categoryId=1");
        const data = await res.json();
        if (data.success && data.products) {
          setItems(data.products);
        }
      } catch (err) {
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p>กำลังโหลดสินค้าขนมปัง...</p>;

  return (
    <div className="container mt-3 mb-5">
      <h4
        style={{
          borderLeft: "5px solid #ed1b2f",
          paddingLeft: 10,
          fontWeight: "bold",
        }}
      >
        🍞 ขนมปังแผ่น
      </h4>
      <div className="row g-3">
        {items.map((product) => (
          <div key={product.ProductID} className="col-md-3 mb-4">
            <div className="card h-100 text-center">
              <img
                src={product.ImageURL}
                alt={product.ProductName}
                style={{
                  width: 150,
                  height: 150,
                  objectFit: "contain",
                  margin: "auto",
                }}
              />
              <div className="card-body">
                <h5>{product.ProductName}</h5>
                <p style={{ fontWeight: 700 }}>{product.Price} ฿</p>
                <button
                  className="btn btn-danger"
                  style={{ borderRadius: 25 }}
                  onClick={() => addToCart({ ...product, quantity: 1 })} // ✅ ใส่ quantity
                >
                  <i className="fas fa-shopping-cart me-2"></i> ใส่ตะกร้า
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreadMenu;

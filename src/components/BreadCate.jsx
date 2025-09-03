import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "./cartContact";

const BreadMenu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [quantities, setQuantities] = useState({}); // เก็บจำนวนสินค้าตาม ProductID

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3001/products?categoryId=1");
        const data = await res.json();
        if (data.success && data.products) {
          setItems(data.products);
          // เริ่มต้น quantity = 1
          const initialQuantities = {};
          data.products.forEach(p => (initialQuantities[p.ProductID] = 1));
          setQuantities(initialQuantities);
        }
      } catch (err) {
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (id, value) => {
    if (value < 1) value = 1;
    setQuantities(prev => ({ ...prev, [id]: Number(value) }));
  };

  const handleAddToCart = (product, e) => {
    // ดึงค่า input number จาก card ที่กด
    const input = e.currentTarget.closest(".card").querySelector("input[type='number']");
    const quantity = parseInt(input.value) || 1;

    // เพิ่มสินค้าลงตะกร้า
    addToCart({ ...product, quantity });

    // หา cart icon
    const cartIcon = document.getElementById("cart-icon");
    if (!cartIcon) return;

    // หา image ของสินค้าที่กด
    const img = e.currentTarget.closest(".card").querySelector("img");
    if (!img) return;

    const imgRect = img.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    // clone image
    const imgClone = img.cloneNode(true);
    imgClone.style.position = "fixed";
    imgClone.style.left = `${imgRect.left}px`;
    imgClone.style.top = `${imgRect.top}px`;
    imgClone.style.width = `${imgRect.width}px`;
    imgClone.style.height = `${imgRect.height}px`;
    imgClone.style.transition = "all 0.7s ease-in-out";
    imgClone.style.zIndex = 9999;
    imgClone.style.borderRadius = "10px";
    document.body.appendChild(imgClone);

    requestAnimationFrame(() => {
      imgClone.style.left = `${cartRect.left}px`;
      imgClone.style.top = `${cartRect.top}px`;
      imgClone.style.width = "30px";
      imgClone.style.height = "30px";
      imgClone.style.opacity = "0.5";
    });

    imgClone.addEventListener("transitionend", () => {
      imgClone.remove();
    });

    // สร้างตัวเลข +จำนวน
    const flyingNum = document.createElement("div");
    flyingNum.innerText = `+${quantity}`;
    flyingNum.style.position = "fixed";
    flyingNum.style.left = `${imgRect.left}px`;
    flyingNum.style.top = `${imgRect.top}px`;
    flyingNum.style.fontSize = "18px";
    flyingNum.style.fontWeight = "bold";
    flyingNum.style.color = "red";
    flyingNum.style.zIndex = 9999;
    document.body.appendChild(flyingNum);

    flyingNum.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        {
          transform: `translate(${cartRect.left - imgRect.left}px, ${cartRect.top - imgRect.top}px) scale(0.5)`,
          opacity: 0,
        },
      ],
      { duration: 700, easing: "ease-in-out" }
    ).onfinish = () => flyingNum.remove();
  };

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
      <p className="text-muted" style={{ marginTop: -10, marginBottom: 20 }}>
        ขนมปังแผ่นนุ่ม หอม สดใหม่ เหมาะสำหรับมื้อเช้า แซนด์วิช หรือทานเล่นได้ทุกเวลา
      </p>

      <div className="row g-3">
        {items.map(({ ProductID, ProductName, Price, ShortDescription, ImageURL }) => (
          <div key={ProductID} className="col-md-3 mb-4">
            <div className="card h-100 text-center">
              <div className="image-box mx-auto" style={{ width: 150, height: 150, overflow: "hidden" }}>
                <img src={ImageURL} alt={ProductName} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
              <div className="card-body text-center">
                <h5 className="card-title" style={{ fontWeight: 600, fontSize: "1rem" }}>{ProductName}</h5>
                <p
                  className="card-price"
                  style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "0.3rem" }}
                >
                  {Price} ฿
                </p>
                <p className="card-text" style={{ color: "#555", fontSize: "0.9rem", marginBottom: 16 }}>
                  <i className="fas fa-weight-hanging me-1"></i> {ShortDescription}
                </p>

                {/* Input จำนวน */}
                <div className="d-flex justify-content-center align-items-center mb-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantityChange(ProductID, quantities[ProductID] - 1)}>-</button>
                  <input
                    type="number"
                    value={quantities[ProductID]}
                    onChange={e => handleQuantityChange(ProductID, parseInt(e.target.value))}
                    style={{ width: 50, textAlign: "center", margin: "0 5px" }}
                  />
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => handleQuantityChange(ProductID, quantities[ProductID] + 1)}>+</button>
                </div>

                <button
                  className="btn btn-danger"
                  style={{ borderRadius: 25 }}
                  onClick={e => handleAddToCart({ ProductID, ProductName, Price, ImageURL }, e)}
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
